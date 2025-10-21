import { NextRequest, NextResponse } from 'next/server'
import { stripe, CURRENCY } from '@/lib/stripe'
import { createClient } from '@/lib/supabase-server'
import { CREDIT_PACKS } from '@/lib/credit-packs'

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

    // Récupérer le pack choisi
    const body = await req.json()
    const { packId } = body

    if (!packId) {
      return NextResponse.json(
        { error: 'Pack ID requis' },
        { status: 400 }
      )
    }

    // Trouver le pack correspondant
    const pack = CREDIT_PACKS.find(p => p.id === packId)
    if (!pack) {
      return NextResponse.json(
        { error: 'Pack non trouvé' },
        { status: 404 }
      )
    }

    // Déterminer l'URL de base
    const baseUrl = process.env.NEXT_PUBLIC_URL || 
                    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

    console.log('📍 Base URL pour Stripe:', baseUrl)

    // Créer une session Stripe Checkout pour l'achat de crédits
    let session
    try {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: CURRENCY,
              product_data: {
                name: pack.name,
                description: `${pack.credits} crédits pour générer ${pack.credits} images IA`,
              },
              unit_amount: pack.price * 100, // Convertir en centimes
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}&credits_purchase=true`,
        cancel_url: `${baseUrl}/billing`,
        metadata: {
          user_id: user.id,
          pack_id: pack.id,
          credits: pack.credits.toString(),
          type: 'credit_purchase',
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

    console.log('✅ Session Stripe créée pour achat de crédits:', session.id)

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })

  } catch (error) {
    console.error('Erreur inattendue:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
