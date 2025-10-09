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
    <div className="space-y-4">
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={onFileSelect}
        className={cn(
          'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors',
          error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-purple-400'
        )}
      >
        {previewUrl ? (
          <div className="space-y-4">
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <Image
                src={previewUrl}
                alt="Image sélectionnée"
                fill
                className="object-cover"
              />
            </div>
            <p className="text-sm text-gray-500">
              Cliquez pour changer d&apos;image
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
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
              <p className="text-gray-600 font-medium mb-1">
                Glissez une image ici
              </p>
              <p className="text-sm text-gray-500">
                ou cliquez pour sélectionner
              </p>
            </div>
            <p className="text-xs text-gray-400">
              JPG, PNG, WEBP (max 10MB)
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}
