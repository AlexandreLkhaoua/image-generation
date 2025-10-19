import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, {
              ...options,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
              path: '/',
              domain: process.env.NODE_ENV === 'production' ? options?.domain : undefined,
            })
          )
        },
      },
    }
  )

  // Vérifier l'utilisateur seulement pour les routes protégées
  const isProtectedRoute = (
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/api/generate') ||
    request.nextUrl.pathname.startsWith('/api/projects')
  )

  // Ne pas rediriger les routes API, laisser l'API gérer l'erreur
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/')

  if (isProtectedRoute) {
    // Log pour les routes API
    if (isApiRoute) {
      console.log('Middleware - API Route:', {
        path: request.nextUrl.pathname,
        method: request.method,
        hasCookies: request.cookies.getAll().length > 0
      })
    }

    const {
      data: { user },
      error
    } = await supabase.auth.getUser()

    // Si pas d'utilisateur ou erreur
    if (error || !user) {
      console.log('Middleware - Auth failed:', {
        path: request.nextUrl.pathname,
        isApiRoute,
        hasUser: !!user,
        error: error?.message
      })

      // Pour les routes API, laisser l'API route gérer l'erreur 401
      if (isApiRoute) {
        return supabaseResponse
      }
      
      // Pour les pages, rediriger vers login
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
