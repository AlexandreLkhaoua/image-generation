'use client'

import { useState, useRef } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ImageUpload } from '@/components/generate/image-upload'
import { PromptInput } from '@/components/generate/prompt-input'
import { ResultDisplay } from '@/components/generate/result-display'
import { useFileUpload } from '@/hooks/use-file-upload'
import { useImageGeneration } from '@/hooks/use-image-generation'

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const {
    selectedFile,
    previewUrl,
    error: uploadError,
    handleDrop,
    handleFileInput,
  } = useFileUpload()

  const {
    generatedImage,
    isLoading,
    error: generationError,
    generateImage,
  } = useImageGeneration()

  const handleGenerate = async () => {
    if (selectedFile) {
      await generateImage(selectedFile, prompt)
    }
  }

  const error = uploadError || generationError

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <Header />

          {/* Main Content - 3 Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Column 1: Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle>1. Sélectionnez votre image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  previewUrl={previewUrl}
                  onDrop={handleDrop}
                  onFileSelect={() => fileInputRef.current?.click()}
                  error={uploadError}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </CardContent>
            </Card>

            {/* Column 2: Prompt Input */}
            <Card>
              <CardHeader>
                <CardTitle>2. Décrivez la transformation</CardTitle>
              </CardHeader>
              <CardContent>
                <PromptInput
                  value={prompt}
                  onChange={setPrompt}
                  onGenerate={handleGenerate}
                  isLoading={isLoading}
                  disabled={!selectedFile || !prompt.trim()}
                />
                {error && !isLoading && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Column 3: Result Display */}
            <Card>
              <CardHeader>
                <CardTitle>3. Résultat</CardTitle>
              </CardHeader>
              <CardContent>
                <ResultDisplay
                  imageUrl={generatedImage?.url || null}
                  projectId={generatedImage?.projectId}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <footer className="mt-12 text-center text-sm text-gray-500">
            <p>
              Propulsé par l&apos;IA • Transformez vos images en quelques clics
            </p>
          </footer>
        </div>
      </div>
    </div>
  )
}
