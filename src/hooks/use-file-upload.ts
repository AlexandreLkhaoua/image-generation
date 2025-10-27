import { useState } from 'react'
import { validateImageFile } from '@/lib/utils'

interface UploadedImage {
  file: File
  previewUrl: string
  id: string
}

interface UseFileUploadReturn {
  selectedFiles: UploadedImage[]
  error: string
  handleDrop: (e: React.DragEvent) => void
  handleFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeFile: (id: string) => void
  clearFiles: () => void
}

export function useFileUpload(): UseFileUploadReturn {
  const [selectedFiles, setSelectedFiles] = useState<UploadedImage[]>([])
  const [error, setError] = useState<string>('')

  const handleFileSelect = (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    
    fileArray.forEach(file => {
      const validation = validateImageFile(file)
      
      if (!validation.valid) {
        setError(validation.error || 'Fichier invalide')
        return
      }

      const url = URL.createObjectURL(file)
      const newImage: UploadedImage = {
        file,
        previewUrl: url,
        id: `${Date.now()}-${Math.random()}`
      }
      
      setSelectedFiles(prev => [...prev, newImage])
      setError('')
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files)
    }
    // Réinitialiser l'input pour permettre de sélectionner le même fichier
    e.target.value = ''
  }

  const removeFile = (id: string) => {
    setSelectedFiles(prev => {
      const imageToRemove = prev.find(img => img.id === id)
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl)
      }
      return prev.filter(img => img.id !== id)
    })
  }

  const clearFiles = () => {
    selectedFiles.forEach(img => URL.revokeObjectURL(img.previewUrl))
    setSelectedFiles([])
    setError('')
  }

  return {
    selectedFiles,
    error,
    handleDrop,
    handleFileInput,
    removeFile,
    clearFiles,
  }
}
