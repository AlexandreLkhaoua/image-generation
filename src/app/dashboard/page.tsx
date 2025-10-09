'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/generate/image-upload'
import { PromptInput } from '@/components/generate/prompt-input'
import { useFileUpload } from '@/hooks/use-file-upload'
import { useImageGeneration } from '@/hooks/use-image-generation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase-browser'
import { formatDateParis } from '@/lib/utils'

interface Project {
  id: string
  created_at: string
  input_image_url: string
  output_image_url: string | null
  prompt: string
  status: string
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [prompt, setPrompt] = useState('')
  const supabase = createClient()

  const {
    selectedFile,
    previewUrl,
    error: uploadError,
    handleDrop,
    handleFileInput,
  } = useFileUpload()

  const {
    generatedImage,
    isLoading: generating,
    error: generationError,
    generateImage,
  } = useImageGeneration()

  // Redirection si non authentifié
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Erreur chargement projets:', error)
    } finally {
      setLoadingProjects(false)
    }
  }

  // Charger les projets de l'utilisateur
  useEffect(() => {
    if (user) {
      loadProjects()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleGenerate = async () => {
    if (selectedFile) {
      await generateImage(selectedFile, prompt)
      // Recharger les projets après génération
      setTimeout(loadProjects, 1000)
    }
  }

  const handleDelete = async (projectId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProjects(projects.filter(p => p.id !== projectId))
      }
    } catch (error) {
      console.error('Erreur suppression:', error)
    }
  }

  const handleDownload = async (imageUrl: string, projectId: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `image-ai-${projectId}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Erreur téléchargement:', error)
      alert('Erreur lors du téléchargement de l\'image')
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="w-full px-6 py-8 max-w-[1600px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Bienvenue {user.email} ! Créez et gérez vos images IA.
          </p>
        </div>

        {/* Formulaire de génération */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>1. Sélectionnez votre image</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                onDrop={handleDrop}
                onFileSelect={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = 'image/*'
                  input.onchange = (e) => handleFileInput(e as unknown as React.ChangeEvent<HTMLInputElement>)
                  input.click()
                }}
                previewUrl={previewUrl}
                error={uploadError || undefined}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Décrivez la transformation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <PromptInput
                value={prompt}
                onChange={setPrompt}
                onGenerate={handleGenerate}
                disabled={!selectedFile || generating}
                isLoading={generating}
              />
              
              {(uploadError || generationError) && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {uploadError || generationError}
                </div>
              )}

              {generatedImage && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
                  ✓ Image générée avec succès !
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Galerie des projets */}
        <Card>
          <CardHeader>
            <CardTitle>Mes projets ({projects.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingProjects ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement de vos projets...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-600 mb-2">Aucun projet pour le moment</p>
                <p className="text-sm text-gray-500">Créez votre première image pour commencer !</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-video bg-gray-100 relative">
                      {project.output_image_url ? (
                        <img
                          src={project.output_image_url}
                          alt="Generated"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            <p className="text-sm text-gray-500">Génération...</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {project.prompt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatDateParis(project.created_at)}</span>
                        <span className={`px-2 py-1 rounded-full ${
                          project.status === 'completed' 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      
                      <div className="mt-3 flex gap-2">
                        {project.output_image_url && (
                          <button
                            onClick={() => handleDownload(project.output_image_url!, project.id)}
                            className="flex-1 px-3 py-2 text-sm bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg hover:from-yellow-600 hover:to-orange-700 transition-colors"
                          >
                            Télécharger
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
