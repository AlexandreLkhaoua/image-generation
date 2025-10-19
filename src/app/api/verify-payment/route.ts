import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '../../../../lib/supabase'

/**
 * API pour vérifier manuellement le statut d'une session Stripe
 * Utile en développement quand le webhook n'est pas configuré
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { sessionId } = await req.json()

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID requis' },
        { status: 400 }
      )
    }

    // Récupérer la session Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    console.log('🔍 Vérification session Stripe:', {
      sessionId: session.id,
      paymentStatus: session.payment_status,
      projectId: session.metadata?.project_id,
    })

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Paiement non complété', session },
        { status: 400 }
      )
    }

    // Récupérer le project_id depuis les metadata
    const projectId = session.metadata?.project_id
    const userId = session.metadata?.user_id

    if (!projectId || userId !== user.id) {
      return NextResponse.json(
        { error: 'Projet introuvable ou non autorisé' },
        { status: 404 }
      )
    }

    // Mettre à jour le projet dans Supabase
    const { data: project, error: updateError } = await supabaseAdmin
      .from('projects')
      .update({
        payment_status: 'paid',
        stripe_payment_intent_id: session.payment_intent as string,
        stripe_checkout_session_id: session.id,
      })
      .eq('id', projectId)
      .eq('user_id', userId)
      .select()
      .single()

    if (updateError) {
      console.error('❌ Erreur mise à jour projet:', updateError)
      return NextResponse.json(
        { error: 'Erreur mise à jour projet' },
        { status: 500 }
      )
    }

    console.log('✅ Paiement vérifié et projet mis à jour:', project)

    return NextResponse.json({
      success: true,
      project,
    })

  } catch (error) {
    console.error('Erreur vérification paiement:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
