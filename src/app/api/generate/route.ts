import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import Replicate from 'replicate'

const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { projectId } = body

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'Project ID requis' },
        { status: 400 }
      )
    }

    // Vérifier que le projet existe et appartient à l'utilisateur
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (projectError || !project) {
      return NextResponse.json(
        { success: false, error: 'Projet non trouvé' },
        { status: 404 }
      )
    }

    // IMPORTANT: Vérifier que le paiement a été effectué
    if (project.payment_status !== 'paid') {
      return NextResponse.json(
        { success: false, error: 'Paiement requis avant de générer l\'image' },
        { status: 402 } // 402 Payment Required
      )
    }

    // Vérifier que le projet n'a pas déjà été généré
    if (project.status === 'completed') {
      return NextResponse.json(
        { success: false, error: 'Ce projet a déjà été généré' },
        { status: 400 }
      )
    }

    // Mettre à jour le statut du projet à 'processing'
    await supabaseAdmin
      .from('projects')
      .update({ status: 'processing' })
      .eq('id', projectId)

    const inputImageUrl = project.input_image_url
    const prompt = project.prompt

    // 4. Appeler Replicate pour générer l'image
    console.log('Appel Replicate avec URL:', inputImageUrl)
    console.log('Prompt utilisateur:', prompt)
    
    // Utiliser directement le prompt de l'utilisateur pour que le modèle l'interprète correctement
    // Le modèle Gemini 2.5 comprend bien les instructions naturelles en anglais et en français
    console.log('Prompt envoyé à Replicate:', prompt)
    
    let output
    try {
      // L'API Replicate attend un tableau même pour une seule image
      output = await replicate.run(
        process.env.REPLICATE_MODEL! as `${string}/${string}` | `${string}/${string}:${string}`,
        {
          input: {
            prompt: prompt,  // Utiliser le prompt original de l'utilisateur
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
        .eq('id', projectId)

      return NextResponse.json(
        { success: false, error: `Erreur Replicate: ${replicateError}` },
        { status: 500 }
      )
    }

    if (!output) {
      await supabaseAdmin
        .from('projects')
        .update({ status: 'failed' })
        .eq('id', projectId)

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
        .eq('id', projectId)

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
        .eq('id', projectId)

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
      .eq('id', projectId)

    if (updateError) {
      console.error('Erreur update:', updateError)
      return NextResponse.json(
        { success: false, error: 'Erreur lors de la mise à jour' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      projectId: projectId,
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