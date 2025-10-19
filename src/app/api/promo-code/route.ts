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

// Définition des codes promo disponibles
const PROMO_CODES: Record<string, { credits: number; description: string }> = {
  'ALEX10': { credits: 10, description: 'Code promo spécial - 10 crédits offerts' },
}

export async function POST(req: NextRequest) {
  try {
    // Vérifier l'authentification
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Récupérer le code promo
    const body = await req.json()
    const { code } = body

    if (!code) {
      return NextResponse.json(
        { error: 'Code promo requis' },
        { status: 400 }
      )
    }

    const upperCode = code.toUpperCase()

    // Vérifier si le code existe
    const promoConfig = PROMO_CODES[upperCode]
    if (!promoConfig) {
      return NextResponse.json(
        { error: 'Code promo invalide' },
        { status: 404 }
      )
    }

    // Vérifier si l'utilisateur a déjà utilisé ce code promo
    const { data: existingUsage } = await supabaseAdmin
      .from('promo_code_usage')
      .select('*')
      .eq('user_id', user.id)
      .eq('promo_code', upperCode)
      .single()

    if (existingUsage) {
      return NextResponse.json(
        { error: 'Vous avez déjà utilisé ce code promo' },
        { status: 400 }
      )
    }

    // Récupérer ou créer l'entrée de crédits pour l'utilisateur
    const { data: userCredits } = await supabaseAdmin
      .from('credits')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (userCredits) {
      // Ajouter les crédits
      const { error: updateError } = await supabaseAdmin
        .from('credits')
        .update({
          credits_remaining: userCredits.credits_remaining + promoConfig.credits,
          credits_total: userCredits.credits_total + promoConfig.credits,
        })
        .eq('user_id', user.id)

      if (updateError) {
        console.error('❌ Erreur mise à jour crédits:', updateError)
        return NextResponse.json(
          { error: 'Erreur lors de la mise à jour des crédits' },
          { status: 500 }
        )
      }
    } else {
      // Créer l'entrée de crédits
      const { error: insertError } = await supabaseAdmin
        .from('credits')
        .insert({
          user_id: user.id,
          credits_remaining: promoConfig.credits,
          credits_total: promoConfig.credits,
        })

      if (insertError) {
        console.error('❌ Erreur création crédits:', insertError)
        return NextResponse.json(
          { error: 'Erreur lors de la création des crédits' },
          { status: 500 }
        )
      }
    }

    // Enregistrer l'utilisation du code promo
    const { error: usageError } = await supabaseAdmin
      .from('promo_code_usage')
      .insert({
        user_id: user.id,
        promo_code: upperCode,
        credits_awarded: promoConfig.credits,
      })

    if (usageError) {
      console.error('⚠️ Erreur enregistrement usage code promo:', usageError)
      // Ne pas bloquer si l'enregistrement échoue, les crédits ont été ajoutés
    }

    // Enregistrer la transaction
    await supabaseAdmin
      .from('credit_transactions')
      .insert({
        user_id: user.id,
        amount: promoConfig.credits,
        type: 'purchase',
        description: `Code promo: ${upperCode} - ${promoConfig.description}`,
      })

    console.log(`✅ Code promo ${upperCode} appliqué: ${promoConfig.credits} crédits ajoutés à l'utilisateur ${user.id}`)

    return NextResponse.json({
      success: true,
      credits: promoConfig.credits,
      message: promoConfig.description,
    })

  } catch (error) {
    console.error('Erreur API code promo:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
