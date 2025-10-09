import { useState } from 'react'
import { validateImageFile } from '@/lib/utils'

interface UseFileUploadReturn {
  selectedFile: File | null
  previewUrl: string
  error: string
  handleFileSelect: (file: File) => void
  handleDrop: (e: React.DragEvent) => void
  handleFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void
  clearFile: () => void
}

export function useFileUpload(): UseFileUploadReturn {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleFileSelect = (file: File) => {
    const validation = validateImageFile(file)
    
    if (!validation.valid) {
      setError(validation.error || 'Fichier invalide')
      return
    }

    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setError('')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const clearFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setSelectedFile(null)
    setPreviewUrl('')
    setError('')
  }

  return {
    selectedFile,
    previewUrl,
    error,
    handleFileSelect,
    handleDrop,
    handleFileInput,
    clearFile,
  }
}
