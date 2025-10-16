'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/generate/image-upload'
import { PromptInput } from '@/components/generate/prompt-input'
import { useFileUpload } from '@/hooks/use-file-upload'
import { useStripeCheckout } from '@/hooks/use-stripe-checkout'
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
  payment_status: string
  payment_amount: number | null
}

function DashboardContent() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [projects, setProjects] = useState<Project[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [prompt, setPrompt] = useState('')
  const [generatingProject, setGeneratingProject] = useState<string | null>(null)
  const supabase = createClient()

  const {
    selectedFile,
    previewUrl,
    error: uploadError,
    handleDrop,
    handleFileInput,
  } = useFileUpload()

  const {
    isLoading: isCheckoutLoading,
    error: checkoutError,
    createCheckoutSession,
  } = useStripeCheckout({ imageFile: selectedFile, prompt })

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

  // Gérer le retour de Stripe après paiement
  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (sessionId) {
      // Recharger les projets pour afficher le nouveau projet payé
      loadProjects()
      // Nettoyer l'URL
      window.history.replaceState({}, '', '/dashboard')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handlePayAndGenerate = async () => {
    if (!selectedFile || !prompt.trim()) {
      return
    }
    // Créer la session de paiement Stripe
    await createCheckoutSession()
  }

  const handleGenerateFromPaidProject = async (projectId: string) => {
    setGeneratingProject(projectId)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de la génération')
      }

      const data = await response.json()
      console.log('✅ Génération réussie:', data)
      
      // Recharger les projets
      await loadProjects()
      
    } catch (error) {
      console.error('Erreur génération:', error)
      alert(error instanceof Error ? error.message : 'Erreur lors de la génération')
    } finally {
      setGeneratingProject(null)
    }
  }

  const handleDelete = async (projectId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return

    try {
      // Vérifier la session avant de faire la requête
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      console.log('Client - Session check:', {
        hasSession: !!session,
        hasAccessToken: !!session?.access_token,
        error: sessionError
      })
      
      if (!session) {
        alert('Session expirée. Veuillez vous reconnecter.')
        router.push('/login')
        return
      }

      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        credentials: 'include', // Inclure les cookies dans la requête
        headers: {
          'Content-Type': 'application/json',
        }
      })

      console.log('Client - DELETE response:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      })

      if (response.ok) {
        setProjects(projects.filter(p => p.id !== projectId))
        alert('Projet supprimé avec succès!')
      } else {
        const text = await response.text()
        console.error('Client - DELETE error response:', {
          status: response.status,
          text: text
        })
        
        let errorMessage = 'Impossible de supprimer le projet'
        try {
          const data = JSON.parse(text)
          errorMessage = data.error || errorMessage
        } catch {
          errorMessage = text || errorMessage
        }
        
        alert(`Erreur: ${errorMessage}`)
      }
    } catch (error) {
      console.error('Erreur suppression:', error)
      alert('Erreur lors de la suppression du projet')
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
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Décrivez comment vous voulez transformer votre image... Ex: 'add a hat to the dog', 'make the sky more dramatic', 'change background to beach'"
                className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
              />
              
              <Button
                onClick={handlePayAndGenerate}
                disabled={!selectedFile || !prompt.trim() || isCheckoutLoading}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckoutLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Préparation du paiement...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Générer (2,00 €)
                  </span>
                )}
              </Button>
              
              {(uploadError || checkoutError) && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {uploadError || checkoutError}
                </div>
              )}

              <div className="text-xs text-gray-500 text-center">
                Paiement sécurisé par Stripe • 2,00 € par génération
              </div>
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
                        <Image
                          src={project.output_image_url}
                          alt="Generated"
                          fill
                          className="object-cover"
                        />
                      ) : project.payment_status === 'paid' && project.status === 'processing' ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            <p className="text-sm text-gray-500">Génération en cours...</p>
                          </div>
                        </div>
                      ) : project.payment_status === 'paid' ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <svg className="w-12 h-12 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm text-gray-600">Paiement validé</p>
                            <p className="text-xs text-gray-500">Prêt à générer</p>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <p className="text-sm text-gray-600">En attente de paiement</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {project.prompt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>{formatDateParis(project.created_at)}</span>
                        <div className="flex gap-1">
                          <span className={`px-2 py-1 rounded-full ${
                            project.payment_status === 'paid'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {project.payment_status === 'paid' ? 'Payé' : 'En attente'}
                          </span>
                          <span className={`px-2 py-1 rounded-full ${
                            project.status === 'completed' 
                              ? 'bg-green-100 text-green-700'
                              : project.status === 'processing'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex gap-2">
                        {project.payment_status === 'paid' && !project.output_image_url && project.status !== 'processing' && (
                          <button
                            onClick={() => handleGenerateFromPaidProject(project.id)}
                            disabled={generatingProject === project.id}
                            className="flex-1 px-3 py-2 text-sm bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {generatingProject === project.id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Génération...
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Lancer la génération
                              </>
                            )}
                          </button>
                        )}
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

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
