import * as React from 'react'
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
    <div className="space-y-3 sm:space-y-4">
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={onFileSelect}
        className={cn(
          'border-2 border-dashed rounded-lg sm:rounded-xl p-4 sm:p-6 text-center cursor-pointer transition-colors touch-manipulation active:scale-[0.98]',
          error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-purple-400 active:border-purple-500'
        )}
      >
        {previewUrl ? (
          <div className="space-y-3 sm:space-y-4">
            <div className="relative w-full h-40 sm:h-48 rounded-lg overflow-hidden">
              <Image
                src={previewUrl}
                alt="Image sélectionnée"
                fill
                className="object-cover"
                priority
              />
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              Cliquez pour changer d&apos;image
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm sm:text-base text-gray-600 font-medium mb-1">
                Glissez une image ici
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                ou cliquez pour sélectionner
              </p>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-400">
              JPG, PNG, WEBP (max 10MB)
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <div className="p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-xs sm:text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}
