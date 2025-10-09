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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Log des cookies reçus
    const cookies = request.cookies.getAll()
    console.log('DELETE /api/projects - Cookies reçus:', {
      count: cookies.length,
      names: cookies.map(c => c.name),
      hasAuthCookie: cookies.some(c => c.name.includes('auth'))
    })
    
    const supabase = await createClient()

    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    console.log('DELETE /api/projects - Auth check:', { 
      hasUser: !!user, 
      userId: user?.id,
      authError: authError?.message,
      authErrorDetails: authError
    })
    
    if (authError || !user) {
      console.error('DELETE /api/projects - Auth failed:', {
        error: authError,
        message: authError?.message,
        status: authError?.status
      })
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer les URLs des images avant suppression
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('input_image_url, output_image_url, user_id')
      .eq('id', id)
      .single()

    if (fetchError || !project) {
      return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 })
    }

    // Vérifier que l'utilisateur est propriétaire du projet
    if (project.user_id !== user.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    // Supprimer les fichiers des buckets
    const inputBucket = process.env.SUPABASE_INPUT_BUCKET!
    const outputBucket = process.env.SUPABASE_OUTPUT_BUCKET!

    // Extraire les noms de fichiers des URLs
    if (project.input_image_url) {
      const inputFileName = project.input_image_url.split('/').pop()
      if (inputFileName) {
        await supabaseAdmin.storage
          .from(inputBucket)
          .remove([inputFileName])
      }
    }

    if (project.output_image_url) {
      const outputFileName = project.output_image_url.split('/').pop()
      if (outputFileName) {
        await supabaseAdmin.storage
          .from(outputBucket)
          .remove([outputFileName])
      }
    }

    // Supprimer le projet de la base de données
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur suppression projet:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}
