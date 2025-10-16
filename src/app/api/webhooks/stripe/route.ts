import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '../../../../../lib/supabase'

// IMPORTANT: Désactiver le parsing du body pour recevoir le raw body
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    console.error('Pas de signature Stripe trouvée')
    return NextResponse.json(
      { error: 'Signature manquante' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    // Vérifier la signature du webhook
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Erreur de vérification du webhook:', err)
    return NextResponse.json(
      { error: `Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}` },
      { status: 400 }
    )
  }

  // Gérer les différents types d'événements
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        console.log('✅ Paiement réussi pour la session:', session.id)

        // Récupérer le project_id depuis les metadata
        const projectId = session.metadata?.project_id
        const userId = session.metadata?.user_id

        if (!projectId) {
          console.error('❌ project_id manquant dans les metadata')
          return NextResponse.json(
            { error: 'project_id manquant' },
            { status: 400 }
          )
        }

        // Récupérer le PaymentIntent pour obtenir les détails du paiement
        const paymentIntentId = session.payment_intent as string

        // Mettre à jour le projet dans Supabase
        const { data, error } = await supabaseAdmin
          .from('projects')
          .update({
            payment_status: 'paid',
            stripe_payment_intent_id: paymentIntentId,
            stripe_checkout_session_id: session.id,
          })
          .eq('id', projectId)
          .eq('user_id', userId) // Sécurité supplémentaire
          .select()

        if (error) {
          console.error('❌ Erreur mise à jour projet:', error)
          return NextResponse.json(
            { error: 'Erreur mise à jour projet' },
            { status: 500 }
          )
        }

        console.log('✅ Projet mis à jour avec succès:', data)
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        const projectId = session.metadata?.project_id

        if (projectId) {
          // Marquer le projet comme expiré
          await supabaseAdmin
            .from('projects')
            .update({
              payment_status: 'expired',
              status: 'cancelled',
            })
            .eq('id', projectId)

          console.log('⏰ Session expirée pour le projet:', projectId)
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.error('❌ Échec du paiement:', paymentIntent.id)
        break
      }

      default:
        console.log(`Type d'événement non géré: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Erreur traitement webhook:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
