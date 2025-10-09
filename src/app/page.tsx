'use client'

import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/auth-context'

export default function Home() {
  const router = useRouter()
  const { user } = useAuth()

  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/signup')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      
      <div className="w-full px-6 max-w-[1600px] mx-auto">
        <div className="text-center py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-3xl mb-8 shadow-2xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6">
              Transformez vos images avec l&apos;IA
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Décrivez simplement la transformation souhaitée et laissez notre IA générer des images époustouflantes.
            </p>

            <div className="flex items-center justify-center gap-4 mb-12">
              <Button
                onClick={handleGetStarted}
                size="default"
                className="text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all"
              >
                {user ? 'Accéder au Dashboard' : 'Commencer gratuitement'}
              </Button>

              {!user && (
                <Button
                  onClick={() => router.push('/login')}
                  variant="outline"
                  size="default"
                  className="text-lg px-8 py-6"
                >
                  Se connecter
                </Button>
              )}
            </div>
          </motion.div>
        </div>

        <footer className="py-12 text-center text-sm text-gray-500 border-t border-gray-200">
          <p>Propulsé par l&apos;IA • Next.js 15 • React 19 • Supabase • Replicate</p>
        </footer>
      </div>
    </div>
  )
}
