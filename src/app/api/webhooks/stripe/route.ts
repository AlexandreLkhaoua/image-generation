import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '../../../../../lib/supabase'
import { sendEmail, getPaymentFailedEmailHtml, getSubscriptionCancelledEmailHtml } from '@/lib/email'

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

        const userId = session.metadata?.user_id
        const type = session.metadata?.type

        // Gérer l'achat de crédits
        if (type === 'credit_purchase') {
          const credits = parseInt(session.metadata?.credits || '0', 10)
          const packId = session.metadata?.pack_id

          if (!credits || !userId) {
            console.error('❌ Informations manquantes pour l\'achat de crédits')
            return NextResponse.json(
              { error: 'Informations manquantes' },
              { status: 400 }
            )
          }

          // Récupérer ou créer l'entrée de crédits pour l'utilisateur
          const { data: existingCredits } = await supabaseAdmin
            .from('credits')
            .select('*')
            .eq('user_id', userId)
            .single()

          if (existingCredits) {
            // Ajouter les crédits
            const { error: updateError } = await supabaseAdmin
              .from('credits')
              .update({
                credits_remaining: existingCredits.credits_remaining + credits,
                credits_total: existingCredits.credits_total + credits,
              })
              .eq('user_id', userId)

            if (updateError) {
              console.error('❌ Erreur mise à jour crédits:', updateError)
            } else {
              console.log(`✅ ${credits} crédits ajoutés à l'utilisateur ${userId}`)
            }
          } else {
            // Créer l'entrée de crédits
            const { error: insertError } = await supabaseAdmin
              .from('credits')
              .insert({
                user_id: userId,
                credits_remaining: credits,
                credits_total: credits,
              })

            if (insertError) {
              console.error('❌ Erreur création crédits:', insertError)
            } else {
              console.log(`✅ ${credits} crédits créés pour l'utilisateur ${userId}`)
            }
          }

          // Enregistrer la transaction
          await supabaseAdmin
            .from('credit_transactions')
            .insert({
              user_id: userId,
              amount: credits,
              type: 'purchase',
              description: `Achat de ${credits} crédits (${packId})`,
              stripe_payment_intent_id: session.payment_intent as string,
            })

          break
        }

        // Gérer l'ancien système de paiement par projet
        const projectId = session.metadata?.project_id

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

      case 'checkout.session.async_payment_failed': {
        const session = event.data.object as Stripe.Checkout.Session
        console.error('❌ Échec de paiement asynchrone pour la session:', session.id)

        const userId = session.metadata?.user_id
        const type = session.metadata?.type

        // Gérer l'échec d'achat de crédits avec paiement différé (SEPA, etc.)
        if (type === 'credit_purchase') {
          const credits = parseInt(session.metadata?.credits || '0', 10)
          
          if (credits && userId) {
            // Récupérer les crédits de l'utilisateur
            const { data: userCredits } = await supabaseAdmin
              .from('credits')
              .select('*')
              .eq('user_id', userId)
              .single()

            if (userCredits && userCredits.credits_remaining >= credits) {
              // Retirer les crédits qui avaient été ajoutés prématurément
              await supabaseAdmin
                .from('credits')
                .update({
                  credits_remaining: userCredits.credits_remaining - credits,
                  credits_total: userCredits.credits_total - credits,
                })
                .eq('user_id', userId)

              // Enregistrer la transaction d'annulation
              await supabaseAdmin
                .from('credit_transactions')
                .insert({
                  user_id: userId,
                  amount: -credits,
                  type: 'refund',
                  description: `Annulation suite à échec de paiement différé (${credits} crédits)`,
                  stripe_payment_intent_id: session.payment_intent as string,
                })

              console.log(`✅ ${credits} crédits retirés suite à échec de paiement asynchrone`)
            }
          }
        }

        // Gérer l'échec d'un projet avec paiement différé
        const projectId = session.metadata?.project_id
        if (projectId) {
          await supabaseAdmin
            .from('projects')
            .update({
              payment_status: 'failed',
              status: 'cancelled',
            })
            .eq('id', projectId)

          console.log('❌ Projet annulé suite à échec de paiement asynchrone:', projectId)
        }

        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.error('❌ Échec du paiement:', paymentIntent.id)
        
        // Récupérer les informations du client
        const customerId = paymentIntent.customer as string
        
        if (customerId) {
          try {
            // Récupérer les infos du customer depuis Stripe
            const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer
            
            if (customer && !customer.deleted && customer.email) {
              // Envoyer un email d'échec de paiement
              await sendEmail({
                to: customer.email,
                subject: 'Échec de votre paiement - AI Image Editor',
                html: getPaymentFailedEmailHtml(
                  customer.name || customer.email,
                  paymentIntent.amount / 100,
                  paymentIntent.currency
                )
              })
              
              console.log('📧 Email d\'échec de paiement envoyé à:', customer.email)
            }
            
            // Mettre à jour le statut dans Supabase si on trouve le projet
            if (paymentIntent.metadata?.project_id) {
              await supabaseAdmin
                .from('projects')
                .update({
                  payment_status: 'failed',
                  status: 'cancelled',
                })
                .eq('id', paymentIntent.metadata.project_id)
            }
          } catch (emailError) {
            console.error('Erreur envoi email échec paiement:', emailError)
          }
        }
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        console.log('💸 Remboursement détecté:', charge.id)
        
        const paymentIntentId = charge.payment_intent as string
        
        if (!paymentIntentId) {
          console.error('❌ PaymentIntent manquant pour le remboursement')
          break
        }
        
        // Trouver la transaction d'achat de crédits concernée
        const { data: transaction } = await supabaseAdmin
          .from('credit_transactions')
          .select('*')
          .eq('stripe_payment_intent_id', paymentIntentId)
          .eq('type', 'purchase')
          .single()
        
        if (transaction) {
          // Récupérer les crédits actuels de l'utilisateur
          const { data: userCredits } = await supabaseAdmin
            .from('credits')
            .select('*')
            .eq('user_id', transaction.user_id)
            .single()
          
          if (userCredits) {
            // Retirer les crédits qui avaient été ajoutés
            const newRemaining = Math.max(0, userCredits.credits_remaining - transaction.amount)
            const newTotal = Math.max(0, userCredits.credits_total - transaction.amount)
            
            await supabaseAdmin
              .from('credits')
              .update({
                credits_remaining: newRemaining,
                credits_total: newTotal,
              })
              .eq('user_id', transaction.user_id)
            
            // Enregistrer la transaction de remboursement
            await supabaseAdmin
              .from('credit_transactions')
              .insert({
                user_id: transaction.user_id,
                amount: -transaction.amount,
                type: 'refund',
                description: `Remboursement de ${transaction.amount} crédits`,
                stripe_payment_intent_id: paymentIntentId,
              })
            
            console.log(`✅ ${transaction.amount} crédits retirés pour l'utilisateur ${transaction.user_id}`)
            console.log(`Crédits restants: ${newRemaining}`)
          }
        } else {
          console.log('⚠️ Aucune transaction trouvée pour ce remboursement')
        }
        break
      }

      case 'charge.dispute.created': {
        const dispute = event.data.object as Stripe.Dispute
        console.log('⚠️ Litige créé:', dispute.id)
        
        // Notifier l'équipe admin d'un litige
        // TODO: Envoyer un email à l'équipe ou créer une alerte
        console.log(`💰 Montant contesté: ${dispute.amount / 100} ${dispute.currency}`)
        console.log(`Raison: ${dispute.reason}`)
        break
      }

      case 'charge.dispute.closed': {
        const dispute = event.data.object as Stripe.Dispute
        console.log(`${dispute.status === 'won' ? '✅' : '❌'} Litige clôturé:`, dispute.id)
        console.log(`Statut: ${dispute.status}`)
        
        // Si perdu, les crédits ont déjà été retirés par charge.refunded
        // Si gagné, rien à faire
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        console.log('🔔 Abonnement annulé:', subscription.id)
        
        // Récupérer les informations du client
        const customerId = subscription.customer as string
        
        if (customerId) {
          try {
            // Récupérer les infos du customer depuis Stripe
            const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer
            
            if (customer && !customer.deleted && customer.email) {
              // Envoyer un email de confirmation d'annulation
              await sendEmail({
                to: customer.email,
                subject: 'Confirmation d\'annulation de votre abonnement - AI Image Editor',
                html: getSubscriptionCancelledEmailHtml(
                  customer.name || customer.email
                )
              })
              
              console.log('📧 Email de confirmation d\'annulation envoyé à:', customer.email)
            }
            
            // Mettre à jour le statut de l'abonnement dans Supabase
            // (si vous avez une table subscriptions)
            /*
            await supabaseAdmin
              .from('subscriptions')
              .update({
                status: 'cancelled',
                cancelled_at: new Date().toISOString(),
              })
              .eq('stripe_subscription_id', subscription.id)
            */
          } catch (emailError) {
            console.error('Erreur envoi email annulation:', emailError)
          }
        }
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
