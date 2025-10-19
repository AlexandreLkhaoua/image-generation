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

export async function GET(request: NextRequest) {
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

    // Récupérer les crédits de l'utilisateur
    const { data: credits, error: creditsError } = await supabaseAdmin
      .from('credits')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (creditsError) {
      // Si l'utilisateur n'a pas encore de crédits, créer une entrée avec 0 crédits
      if (creditsError.code === 'PGRST116') {
        const { data: newCredits, error: insertError } = await supabaseAdmin
          .from('credits')
          .insert({
            user_id: user.id,
            credits_remaining: 0,
            credits_total: 0,
          })
          .select()
          .single()

        if (insertError) {
          console.error('Erreur création crédits:', insertError)
          return NextResponse.json(
            { error: 'Erreur lors de la création des crédits' },
            { status: 500 }
          )
        }

        return NextResponse.json({
          credits_remaining: newCredits.credits_remaining,
          credits_total: newCredits.credits_total,
        })
      }

      console.error('Erreur récupération crédits:', creditsError)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des crédits' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      credits_remaining: credits.credits_remaining,
      credits_total: credits.credits_total,
    })

  } catch (error) {
    console.error('Erreur API crédits:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
