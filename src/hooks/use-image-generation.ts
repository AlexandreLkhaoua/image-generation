import { useState } from 'react'

interface GeneratedImage {
  url: string
  projectId: string
}

interface UseImageGenerationReturn {
  generatedImage: GeneratedImage | null
  isLoading: boolean
  error: string
  generateImage: (file: File, prompt: string) => Promise<void>
  clearGeneration: () => void
}

export function useImageGeneration(): UseImageGenerationReturn {
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const generateImage = async (file: File, prompt: string) => {
    if (!file || !prompt.trim()) {
      setError('Veuillez sélectionner une image et entrer un prompt')
      return
    }

    setIsLoading(true)
    setError('')
    setGeneratedImage(null)

    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('prompt', prompt)

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la génération')
      }

      const data = await response.json()
      setGeneratedImage(data)
    } catch (err) {
      console.error('Erreur de génération:', err)
      setError(err instanceof Error ? err.message : 'Échec de la génération d&apos;image')
    } finally {
      setIsLoading(false)
    }
  }

  const clearGeneration = () => {
    setGeneratedImage(null)
    setError('')
  }

  return {
    generatedImage,
    isLoading,
    error,
    generateImage,
    clearGeneration,
  }
}
