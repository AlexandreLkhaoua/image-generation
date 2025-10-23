'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/auth-context'
import { useIsMobile } from '@/hooks/use-media-query'

export default function Home() {
  const router = useRouter()
  const { user } = useAuth()
  const isMobile = useIsMobile()

  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/signup')
    }
  }

  return (
    <div className="min-h-screen overflow-hidden bg-white flex flex-col">
      
      <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto flex flex-col">
        <div className="flex-1 flex items-center justify-center text-center py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            {/* Icon - Responsive */}
            <div className={`
              inline-flex items-center justify-center 
              ${isMobile ? 'w-16 h-16' : 'w-20 h-20'}
              bg-gradient-to-br from-yellow-500 to-orange-600 
              rounded-2xl sm:rounded-3xl 
              mb-6 sm:mb-8 
              shadow-xl sm:shadow-2xl
            `}>
              <svg 
                className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} text-white`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>

            {/* Title - Mobile-first responsive */}
            <h1 className="
              text-4xl sm:text-5xl md:text-6xl lg:text-7xl 
              font-bold text-gray-900 
              mb-4 sm:mb-6 
              leading-tight
              px-2
            ">
              Transformez vos images avec l&apos;IA
            </h1>

            {/* Description - Responsive text size */}
            <p className="
              text-base sm:text-lg md:text-xl lg:text-2xl 
              text-gray-600 
              mb-6 sm:mb-8 
              max-w-3xl mx-auto
              px-4
            ">
              Décrivez simplement la transformation souhaitée et laissez notre IA générer des images époustouflantes.
            </p>

            {/* Buttons - Stack on mobile, side-by-side on desktop */}
            <div className="
              flex flex-col sm:flex-row 
              items-center justify-center 
              gap-3 sm:gap-4 
              mb-8 sm:mb-12
              px-4
            ">
              <Button
                onClick={handleGetStarted}
                size={isMobile ? "lg" : "default"}
                className="
                  w-full sm:w-auto
                  text-base sm:text-lg 
                  px-6 sm:px-8 
                  py-5 sm:py-6 
                  shadow-xl hover:shadow-2xl 
                  transition-all
                  bg-gradient-to-r from-yellow-500 to-orange-600
                  hover:from-yellow-600 hover:to-orange-700
                "
              >
                {user ? 'Accéder au Dashboard' : 'Commencer gratuitement'}
              </Button>

              {!user && (
                <Button
                  onClick={() => router.push('/login')}
                  variant="outline"
                  size={isMobile ? "lg" : "default"}
                  className="
                    w-full sm:w-auto
                    text-base sm:text-lg 
                    px-6 sm:px-8 
                    py-5 sm:py-6 
                    text-orange-600 hover:text-orange-700 
                    border-orange-500 hover:border-orange-600
                  "
                >
                  Se connecter
                </Button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Footer - Responsive */}
        <footer className="
          py-4 sm:py-6 
          text-center 
          text-xs sm:text-sm 
          text-gray-500 
          border-t border-gray-100
          px-4
        ">
          <p className="leading-relaxed">
            Propulsé par l&apos;IA • Next.js 15 • React 19 • Supabase • Replicate
          </p>
        </footer>
      </div>
    </div>
  )
}
