import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface UploadedImage {
  file: File
  previewUrl: string
  id: string
}

interface ImageUploadProps {
  images: UploadedImage[]
  onDrop: (e: React.DragEvent) => void
  onFileSelect: () => void
  onRemove: (id: string) => void
  error?: string
  maxImages?: number
}

export function ImageUpload({ images, onDrop, onFileSelect, onRemove, error, maxImages = 10 }: ImageUploadProps) {
  const canAddMore = images.length < maxImages
  
  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Message d'avertissement si limite atteinte */}
      {!canAddMore && images.length > 0 && (
        <div className="p-2 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-xs text-orange-700 font-medium text-center">
            ⚠️ Limite atteinte : {maxImages} image{maxImages > 1 ? 's' : ''} maximum
          </p>
        </div>
      )}
      
      {/* Zone de drop principale */}
      <div
        onDrop={canAddMore ? onDrop : undefined}
        onDragOver={(e) => e.preventDefault()}
        className={cn(
          'border-2 border-dashed rounded-lg sm:rounded-xl p-4 transition-colors min-h-[200px]',
          error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50/50'
        )}
      >
        {/* Grille d'images uploadées */}
        {images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((img) => (
              <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                <Image
                  src={img.previewUrl}
                  alt="Image sélectionnée"
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Boutons d'action */}
                <div className="absolute top-2 right-2 flex gap-2">
                  {/* Bouton Corbeille */}
                  <button
                    onClick={() => onRemove(img.id)}
                    className="w-8 h-8 bg-red-500/90 hover:bg-red-600 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-10"
                    aria-label="Supprimer l'image"
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            
            {/* Bouton + pour ajouter une autre image */}
            {canAddMore && (
              <button
                onClick={onFileSelect}
                className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-yellow-500 hover:bg-yellow-50 flex items-center justify-center transition-all cursor-pointer group"
              >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-gray-100 group-hover:bg-yellow-100 rounded-full flex items-center justify-center mb-2 transition-colors">
                  <svg
                    className="w-6 h-6 text-gray-400 group-hover:text-yellow-600"
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
                <p className="text-xs text-gray-500 group-hover:text-yellow-700">Ajouter</p>
              </div>
            </button>
            )}
          </div>
        ) : (
          // État vide - premier upload
          <div 
            onClick={onFileSelect}
            className="cursor-pointer flex items-center justify-center h-full min-h-[180px]"
          >
            <div className="text-center space-y-3">
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
                <p className="text-base text-gray-600 font-medium mb-1">
                  Glissez des images ici
                </p>
                <p className="text-sm text-gray-500">
                  ou cliquez pour sélectionner
                </p>
              </div>
              <p className="text-xs text-gray-400">
                JPG, PNG, WEBP (max 10MB)
              </p>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-xs sm:text-sm">{error}</p>
        </div>
      )}
      
      {images.length > 0 && (
        <p className="text-xs text-gray-500 text-center">
          {images.length} image{images.length > 1 ? 's' : ''} sélectionnée{images.length > 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}
