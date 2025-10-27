import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

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

export async function POST(req: NextRequest) {
  try {
    // Récupérer l'utilisateur authentifié
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Récupérer les données du FormData
    const formData = await req.formData()
    const prompt = formData.get('prompt') as string
    const model = formData.get('model') as string || 'google/nano-banana'
    const imagesCount = parseInt(formData.get('images_count') as string || '0')

    if (imagesCount === 0 || !prompt) {
      return NextResponse.json(
        { error: 'Au moins une image et un prompt requis' },
        { status: 400 }
      )
    }

    // Uploader toutes les images et collecter les URLs
    const imageUrls: string[] = []
    
    for (let i = 0; i < imagesCount; i++) {
      const imageFile = formData.get(`image_${i}`) as File
      
      if (!imageFile) continue

      // 1. Uploader l'image dans Supabase Storage
      const fileName = `${user.id}/${Date.now()}-${i}-${imageFile.name}`
      const { error: uploadError } = await supabaseAdmin.storage
        .from(process.env.SUPABASE_INPUT_BUCKET || 'input-images')
        .upload(fileName, imageFile, {
          contentType: imageFile.type,
          upsert: false,
        })

      if (uploadError) {
        console.error('Erreur upload image:', uploadError)
        return NextResponse.json(
          { error: `Erreur lors de l'upload de l'image ${i + 1}` },
          { status: 500 }
        )
      }

      // Générer l'URL publique de l'image
      const { data: { publicUrl } } = supabaseAdmin.storage
        .from(process.env.SUPABASE_INPUT_BUCKET || 'input-images')
        .getPublicUrl(fileName)

      imageUrls.push(publicUrl)
    }

    // Stocker la première URL comme input_image_url et toutes les URLs dans un champ JSON
    const primaryImageUrl = imageUrls[0]

    // 2. Créer un projet dans la base de données avec payment_status='paid' (car payé avec crédits)
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .insert({
        user_id: user.id,
        input_image_url: primaryImageUrl,
        input_images_urls: imageUrls, // Tableau de toutes les URLs
        prompt,
        model,
        status: 'pending',
        payment_status: 'paid', // Considéré comme payé car utilise des crédits
        payment_amount: 0, // Pas de paiement Stripe
      })
      .select()
      .single()

    if (projectError || !project) {
      console.error('Erreur création projet:', projectError)
      return NextResponse.json(
        { error: 'Erreur lors de la création du projet' },
        { status: 500 }
      )
    }

    console.log('✅ Projet créé avec succès:', project.id)

    return NextResponse.json({
      success: true,
      projectId: project.id,
    })

  } catch (error) {
    console.error('Erreur création projet:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
