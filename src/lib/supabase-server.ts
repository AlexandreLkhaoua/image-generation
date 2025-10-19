import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  // Log les cookies disponibles
  const allCookies = cookieStore.getAll()
  console.log('Server Client - Cookies disponibles:', {
    count: allCookies.length,
    names: allCookies.map(c => c.name),
    hasAuthCookie: allCookies.some(c => c.name.includes('auth'))
  })

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Configuration des cookies pour localhost et production
              cookieStore.set(name, value, {
                ...options,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                domain: process.env.NODE_ENV === 'production' ? options?.domain : undefined,
              })
            })
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
