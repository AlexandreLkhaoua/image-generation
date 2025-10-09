import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase'
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    const prompt = formData.get('prompt') as string

    if (!image || !prompt) {
      return NextResponse.json(
        { success: false, error: 'Image et prompt sont requis' },
        { status: 400 }
      )
    }

    // 1. Upload de l'image d'entrée vers Supabase
    const fileName = `${Date.now()}-${image.name}`
    const { error: uploadError } = await supabaseAdmin.storage
      .from(process.env.SUPABASE_INPUT_BUCKET!)
      .upload(fileName, image, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Erreur upload:', uploadError)
      return NextResponse.json(
        { success: false, error: 'Erreur lors de l\'upload de l\'image' },
        { status: 500 }
      )
    }

    // 2. Récupérer l'URL publique de l'image uploadée
    const { data: urlData } = supabaseAdmin.storage
      .from(process.env.SUPABASE_INPUT_BUCKET!)
      .getPublicUrl(fileName)

    const inputImageUrl = urlData.publicUrl

    // 3. Créer un enregistrement dans la base de données
    const { data: projectData, error: dbError } = await supabaseAdmin
      .from('projects')
      .insert({
        input_image_url: inputImageUrl,
        prompt: prompt,
        status: 'processing'
      })
      .select()
      .single()

    if (dbError) {
      console.error('Erreur DB:', dbError)
      return NextResponse.json(
        { success: false, error: 'Erreur lors de la sauvegarde' },
        { status: 500 }
      )
    }

    // 4. Appeler Replicate pour générer l'image
    console.log('Appel Replicate avec URL:', inputImageUrl)
    console.log('Prompt utilisateur:', prompt)
    
    // Améliorer le prompt pour une meilleure interprétation par le modèle Gemini 2.5
    // Le modèle fonctionne mieux avec des instructions claires et conversationnelles
    const enhancedPrompt = `Please edit this image. ${prompt}. Keep all other elements unchanged. Make the edits look natural and realistic.`
    console.log('Prompt envoyé à Replicate:', enhancedPrompt)
    
    let output
    try {
      // L'API Replicate attend un tableau même pour une seule image
      output = await replicate.run(
        process.env.REPLICATE_MODEL! as `${string}/${string}` | `${string}/${string}:${string}`,
        {
          input: {
            prompt: enhancedPrompt,
            image_input: [inputImageUrl],
            aspect_ratio: "match_input_image",
            output_format: "jpg"
          }
        }
      )
      console.log('Réponse Replicate:', typeof output)
      console.log('Output details:', output)
    } catch (replicateError) {
      console.error('Erreur Replicate:', replicateError)
      await supabaseAdmin
        .from('projects')
        .update({ status: 'failed' })
        .eq('id', projectData.id)

      return NextResponse.json(
        { success: false, error: `Erreur Replicate: ${replicateError}` },
        { status: 500 }
      )
    }

    if (!output) {
      await supabaseAdmin
        .from('projects')
        .update({ status: 'failed' })
        .eq('id', projectData.id)

      return NextResponse.json(
        { success: false, error: 'Échec de la génération d\'image' },
        { status: 500 }
      )
    }

    // 5. Récupérer l'URL de l'image générée
    let imageBuffer: Uint8Array
    
    try {
      let outputImageUrl: string
      
      // Gérer différents formats de réponse de Replicate
      if (typeof output === 'string') {
        outputImageUrl = output
      } else if (output && typeof output === 'object' && 'url' in output && typeof output.url === 'function') {
        outputImageUrl = output.url()
      } else if (output && typeof output === 'object' && 'url' in output) {
        const outputObj = output as { url: string }
        outputImageUrl = outputObj.url
      } else if (Array.isArray(output) && output.length > 0) {
        outputImageUrl = output[0]
      } else {
        throw new Error('Format de réponse Replicate non supporté')
      }

      console.log('URL de l\'image générée:', outputImageUrl)

      // Télécharger l'image depuis l'URL
      const imageResponse = await fetch(outputImageUrl)
      if (!imageResponse.ok) {
        throw new Error(`Erreur lors du téléchargement: ${imageResponse.status}`)
      }
      imageBuffer = new Uint8Array(await imageResponse.arrayBuffer())
      
    } catch (streamError) {
      console.error('Erreur lors du traitement de la réponse:', streamError)
      await supabaseAdmin
        .from('projects')
        .update({ status: 'failed' })
        .eq('id', projectData.id)

      return NextResponse.json(
        { success: false, error: 'Erreur lors du traitement de l\'image' },
        { status: 500 }
      )
    }

    // 6. Upload de l'image générée vers Supabase
    const outputFileName = `generated-${Date.now()}.png`
    const { error: outputUploadError } = await supabaseAdmin.storage
      .from(process.env.SUPABASE_OUTPUT_BUCKET!)
      .upload(outputFileName, imageBuffer, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: false
      })

    if (outputUploadError) {
      console.error('Erreur upload output:', outputUploadError)
      await supabaseAdmin
        .from('projects')
        .update({ status: 'failed' })
        .eq('id', projectData.id)

      return NextResponse.json(
        { success: false, error: 'Erreur lors de la sauvegarde de l\'image générée' },
        { status: 500 }
      )
    }

    // 7. Récupérer l'URL publique de l'image générée
    const { data: outputUrlData } = supabaseAdmin.storage
      .from(process.env.SUPABASE_OUTPUT_BUCKET!)
      .getPublicUrl(outputFileName)

    const finalOutputImageUrl = outputUrlData.publicUrl

    // 8. Mettre à jour le projet avec l'URL de l'image générée
    const { error: updateError } = await supabaseAdmin
      .from('projects')
      .update({
        output_image_url: finalOutputImageUrl,
        status: 'completed'
      })
      .eq('id', projectData.id)

    if (updateError) {
      console.error('Erreur update:', updateError)
      return NextResponse.json(
        { success: false, error: 'Erreur lors de la mise à jour' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      projectId: projectData.id,
      outputImageUrl: finalOutputImageUrl
    })

  } catch (error) {
    console.error('Erreur génération:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}