import * as React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { downloadImage } from '@/lib/utils'

interface ResultDisplayProps {
  imageUrl: string | null
  projectId?: string
  isLoading: boolean
}

export function ResultDisplay({ imageUrl, projectId, isLoading }: ResultDisplayProps) {
  const [isDownloading, setIsDownloading] = React.useState(false)

  const handleDownload = async () => {
    if (!imageUrl || !projectId) return

    setIsDownloading(true)
    try {
      await downloadImage(imageUrl, `generated-${projectId}.jpg`)
    } catch (error) {
      console.error('Erreur téléchargement:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="border border-gray-200 rounded-xl p-8 min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <div>
            <p className="text-gray-700 font-medium">Génération en cours...</p>
            <p className="text-sm text-gray-500 mt-1">L&apos;IA transforme votre image</p>
          </div>
        </div>
      </div>
    )
  }

  if (imageUrl) {
    return (
      <div className="space-y-4">
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="relative w-full h-[400px]">
            <Image
              src={imageUrl}
              alt="Image générée"
              fill
              className="object-contain"
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            variant="default"
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {isDownloading ? 'Téléchargement...' : 'Télécharger'}
          </Button>
          
          <Button
            onClick={() => window.open(imageUrl, '_blank')}
            variant="outline"
            className="flex-1"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Ouvrir
          </Button>
        </div>

        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-green-800">
              Image générée avec succès !
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-xl p-8 min-h-[400px] flex items-center justify-center">
      <div className="text-center text-gray-400">
        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-sm font-medium mb-1">Aucune image générée</p>
        <p className="text-xs">L&apos;image générée apparaîtra ici</p>
      </div>
    </div>
  )
}
