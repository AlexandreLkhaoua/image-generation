'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  previewUrl: string
  onDrop: (e: React.DragEvent) => void
  onFileSelect: () => void
  error?: string
}

export function ImageUpload({ previewUrl, onDrop, onFileSelect, error }: ImageUploadProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={onFileSelect}
        className={cn(
          'relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300',
          error 
            ? 'border-red-300 bg-red-50' 
            : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/30'
        )}
      >
        <AnimatePresence mode="wait">
          {previewUrl ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-4"
            >
              <div className="relative w-full h-56 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={previewUrl}
                  alt="Image sélectionnée"
                  fill
                  className="object-cover"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                  <div className="text-white text-sm font-medium">
                    Cliquer pour changer
                  </div>
                </div>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-gray-500 font-medium"
              >
                ✓ Image chargée avec succès
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Animated Icon */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center"
              >
                <svg
                  className="w-10 h-10 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </motion.div>

              <div>
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  Glissez votre image ici
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  ou cliquez pour parcourir vos fichiers
                </p>
                <div className="inline-flex items-center gap-2 text-xs text-gray-400">
                  <span className="px-2 py-1 bg-gray-100 rounded">JPG</span>
                  <span className="px-2 py-1 bg-gray-100 rounded">PNG</span>
                  <span className="px-2 py-1 bg-gray-100 rounded">WEBP</span>
                  <span className="text-gray-300">•</span>
                  <span>Max 10MB</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-red-50 border border-red-200 rounded-xl"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
