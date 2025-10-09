'use client'

import { motion } from 'framer-motion'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="mt-16 pb-8"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Separator */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-8"></div>
        
        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Column 1 - Branding */}
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-bold text-gray-900">AI Image Editor</span>
            </div>
            <p className="text-sm text-gray-600">
              Propulsé par l&apos;intelligence artificielle
            </p>
          </div>

          {/* Column 2 - Tech Stack */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Technologies</h3>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {['Next.js 15', 'React 19', 'Tailwind v4', 'Supabase', 'Replicate'].map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Column 3 - Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Liens rapides</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors">
                GitHub
              </a>
              <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors">
                Déployé sur Vercel
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>
            © {currentYear} AI Image Editor. Tous droits réservés.
          </p>
          <p className="mt-2">
            Créé avec ❤️ en utilisant les dernières technologies web
          </p>
        </div>
      </div>
    </motion.footer>
  )
}
