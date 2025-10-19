import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '../../../../lib/supabase'

export async function GET(req: NextRequest) {
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

    // Récupérer tous les PaymentIntents de l'utilisateur via son email
    // On cherche dans les checkout sessions associées à l'email de l'utilisateur
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
    })

    // Filtrer les sessions pour cet utilisateur
    const userSessions = sessions.data.filter(
      session => session.metadata?.user_id === user.id
    )

    // Récupérer les détails des PaymentIntents pour chaque session
    const paymentDetails = await Promise.all(
      userSessions.map(async (session) => {
        if (!session.payment_intent) return null

        const paymentIntent = await stripe.paymentIntents.retrieve(
          session.payment_intent as string,
          {
            expand: ['latest_charge']
          }
        )

        // Récupérer l'URL de la facture depuis la charge
        const latestCharge = paymentIntent.latest_charge
        const receiptUrl = latestCharge && typeof latestCharge === 'object' ? latestCharge.receipt_url : null

        // Récupérer le prompt depuis Supabase
        let prompt = 'Génération d\'image IA'
        if (session.metadata?.project_id) {
          const { data: project } = await supabaseAdmin
            .from('projects')
            .select('prompt')
            .eq('id', session.metadata.project_id)
            .single()
          
          if (project?.prompt) {
            prompt = project.prompt
          }
        }

        return {
          id: paymentIntent.id,
          amount: paymentIntent.amount / 100, // Convertir de centimes en euros
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          created: paymentIntent.created,
          receiptUrl,
          prompt,
        }
      })
    )

    // Filtrer les résultats null et trier par date décroissante
    const validPayments = paymentDetails
      .filter(payment => payment !== null)
      .sort((a, b) => b!.created - a!.created)

    return NextResponse.json({
      payments: validPayments,
    })

  } catch (error) {
    console.error('Erreur récupération historique paiements:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'historique des paiements' },
      { status: 500 }
    )
  }
}
