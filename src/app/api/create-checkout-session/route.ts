import { NextRequest, NextResponse } from 'next/server'
import { stripe, PRICE_PER_GENERATION, CURRENCY } from '@/lib/stripe'
import { createClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '../../../../lib/supabase'

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
    const imageFile = formData.get('image') as File
    const prompt = formData.get('prompt') as string

    if (!imageFile || !prompt) {
      return NextResponse.json(
        { error: 'Image et prompt requis' },
        { status: 400 }
      )
    }

    // 1. Uploader l'image dans Supabase Storage
    const fileName = `${user.id}/${Date.now()}-${imageFile.name}`
    const { error: uploadError } = await supabaseAdmin.storage
      .from(process.env.SUPABASE_INPUT_BUCKET || 'input-images')
      .upload(fileName, imageFile, {
        contentType: imageFile.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Erreur upload image:', uploadError)
      return NextResponse.json(
        { error: 'Erreur lors de l\'upload de l\'image' },
        { status: 500 }
      )
    }

    // Générer l'URL publique de l'image
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(process.env.SUPABASE_INPUT_BUCKET || 'input-images')
      .getPublicUrl(fileName)

    // 2. Créer un projet dans la base de données avec status='pending' et payment_status='pending'
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .insert({
        user_id: user.id,
        input_image_url: publicUrl,
        prompt,
        status: 'pending',
        payment_status: 'pending',
        payment_amount: PRICE_PER_GENERATION / 100, // Convertir en euros (2.00)
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

    // 3. Déterminer l'URL de base (localhost ou production)
    const baseUrl = process.env.NEXT_PUBLIC_URL || 
                    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

    console.log('📍 Base URL pour Stripe:', baseUrl)

    // 4. Créer une session Stripe Checkout
    let session
    try {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: CURRENCY,
              product_data: {
                name: 'Génération d\'image IA',
                description: 'Génération d\'une image transformée par intelligence artificielle',
              },
              unit_amount: PRICE_PER_GENERATION, // 200 centimes = 2.00 EUR
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/dashboard`,
        metadata: {
          project_id: project.id,
          user_id: user.id,
        },
      })
    } catch (stripeError: unknown) {
      console.error('Erreur Stripe:', stripeError)
      const error = stripeError as { type?: string; code?: string; message?: string }
      
      // Gérer les erreurs spécifiques de Stripe
      if (error.type === 'StripeInvalidRequestError') {
        if (error.code === 'resource_missing') {
          return NextResponse.json(
            { error: 'Prix invalide ou non trouvé' },
            { status: 400 }
          )
        }
        return NextResponse.json(
          { error: 'Requête invalide: ' + error.message },
          { status: 400 }
        )
      }
      
      if (error.type === 'StripeAPIError') {
        return NextResponse.json(
          { error: 'Erreur de l\'API Stripe. Veuillez réessayer.' },
          { status: 503 }
        )
      }

      // Erreur générique
      return NextResponse.json(
        { error: 'Erreur lors de la création de la session de paiement' },
        { status: 500 }
      )
    }

    // 5. Mettre à jour le projet avec le session_id
    await supabaseAdmin
      .from('projects')
      .update({ stripe_checkout_session_id: session.id })
      .eq('id', project.id)

    console.log('✅ Session Stripe créée:', session.id)

    // 6. Retourner l'URL de la session Stripe
    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      projectId: project.id,
    })

  } catch (error) {
    console.error('Erreur inattendue:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
