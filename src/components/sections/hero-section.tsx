'use client'

import { motion } from 'framer-motion'

export function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center py-12"
    >
      {/* Icon Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl mb-6 shadow-2xl"
      >
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </motion.div>
      
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600"
      >
        Éditeur d&apos;Images IA
      </motion.h1>
      
      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed"
      >
        Transformez vos images avec l&apos;intelligence artificielle de nouvelle génération.
        <br />
        <span className="text-purple-600 font-semibold">Décrivez, générez, téléchargez</span> — C&apos;est aussi simple que ça.
      </motion.p>

      {/* Features Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap items-center justify-center gap-4"
      >
        {[
          { icon: '⚡', text: 'Rapide', color: 'from-yellow-400 to-orange-500' },
          { icon: '✨', text: 'Créatif', color: 'from-pink-400 to-purple-500' },
          { icon: '⭐', text: 'Puissant', color: 'from-blue-400 to-cyan-500' },
        ].map((badge, index) => (
          <motion.div
            key={badge.text}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${badge.color} text-white rounded-full shadow-lg font-semibold text-sm`}
          >
            <span className="text-lg">{badge.icon}</span>
            {badge.text}
          </motion.div>
        ))}
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
      >
        {[
          { value: '10-15s', label: 'Temps moyen' },
          { value: '100%', label: 'Gratuit' },
          { value: '∞', label: 'Possibilités' },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </motion.section>
  )
}
