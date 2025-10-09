'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setGeneratedImage(null)
      setError(null)
    }
  }

  const handleGenerate = async () => {
    if (!selectedImage || !prompt.trim()) {
      setError('Veuillez sélectionner une image et saisir un prompt')
      return
    }

    setIsGenerating(true)
    setError(null)
    setGeneratedImage(null)

    try {
      const formData = new FormData()
      formData.append('image', selectedImage)
      formData.append('prompt', prompt)

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedImage(data.outputImageUrl)
      } else {
        setError(data.error || 'Erreur lors de la génération')
      }
    } catch {
      setError('Erreur de connexion')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Éditeur d&apos;Images IA
          </h1>
          <p className="text-base text-gray-600">
            Transformez vos images avec l&apos;intelligence artificielle
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Panel - Upload & Controls */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  1. Sélectionnez votre image
                </h2>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer block"
                  >
                    {imagePreview ? (
                      <div className="space-y-3">
                        <Image
                          src={imagePreview}
                          alt="Aperçu"
                          width={250}
                          height={150}
                          className="mx-auto rounded-lg object-cover"
                        />
                        <p className="text-sm text-gray-500">
                          Cliquez pour changer d&apos;image
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-purple-600"
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
                        </div>
                        <div>
                          <p className="text-base font-medium text-gray-900">
                            Cliquez pour uploader une image
                          </p>
                          <p className="text-sm text-gray-500">
                            PNG, JPG ou JPEG jusqu&apos;à 10MB
                          </p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  2. Décrivez la transformation
                </h2>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Décrivez comment vous voulez transformer votre image..."
                  className="w-full h-24 p-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={!selectedImage || !prompt.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Génération en cours...</span>
                  </div>
                ) : (
                  "Générer l'image"
                )}
              </button>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-xl text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Right Panel - Result */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                3. Résultat
              </h2>
              
              <div className="border-2 border-gray-200 rounded-xl p-6 min-h-80 flex items-center justify-center">
                {isGenerating ? (
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 mx-auto border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                    <div>
                      <p className="text-base font-medium text-gray-900">
                        Génération en cours...
                      </p>
                      <p className="text-sm text-gray-500">
                        Cela peut prendre quelques minutes
                      </p>
                    </div>
                  </div>
                ) : generatedImage ? (
                  <div className="text-center space-y-4">
                    <Image
                      src={generatedImage}
                      alt="Image générée"
                      width={350}
                      height={250}
                      className="mx-auto rounded-lg shadow-lg object-cover"
                    />
                    <a
                      href={generatedImage}
                      download
                      className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span>Télécharger</span>
                    </a>
                  </div>
                ) : (
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-gray-400"
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
                    </div>
                    <p className="text-gray-500">
                      L&apos;image générée apparaîtra ici
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">
            Propulsé par l&apos;IA - Transformez vos images en quelques clics
          </p>
        </div>
      </div>
    </div>
  )
}
