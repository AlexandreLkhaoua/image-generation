'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { createClient, resetClient } from '@/lib/supabase-browser'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Nettoyer l'ancien localStorage si présent
    if (typeof window !== 'undefined') {
      const oldToken = localStorage.getItem('supabase.auth.token')
      if (oldToken) {
        console.log('Migration: nettoyage ancien token localStorage')
        localStorage.removeItem('supabase.auth.token')
      }
    }

    // Récupérer la session initiale
    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          console.error('Erreur récupération session:', error)
        }
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Erreur session:', error)
        setSession(null)
        setUser(null)
        setLoading(false)
      })

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Pas besoin de emailRedirectTo car on gère tout côté client
        data: {
          email_confirm: false,
        },
      },
    })
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut({ scope: 'local' })
      if (error) throw error
      
      // Force la mise à jour de l'état
      setUser(null)
      setSession(null)
      
      // Supprime les données locales de Supabase
      if (typeof window !== 'undefined') {
        localStorage.removeItem('supabase.auth.token')
        sessionStorage.clear()
      }
      
      // Réinitialise le client singleton
      resetClient()
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      
      // Force quand même la déconnexion locale en cas d'erreur
      setUser(null)
      setSession(null)
      
      // Nettoie le localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('supabase.auth.token')
        sessionStorage.clear()
      }
      
      // Réinitialise le client
      resetClient()
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
