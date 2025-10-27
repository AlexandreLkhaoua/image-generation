'use client'

import { Suspense, useEffect, useState, useRef, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/generate/image-upload'
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
  stripe_checkout_session_id: string | null
  stripe_payment_intent_id: string | null
}

function DashboardContent() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [projects, setProjects] = useState<Project[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [prompt, setPrompt] = useState('')
  const [generatingProject, setGeneratingProject] = useState<string | null>(null)
  const [verifyingPayment, setVerifyingPayment] = useState(false)
  const [paymentVerified, setPaymentVerified] = useState(false)
  const [pendingProjectId, setPendingProjectId] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState('google/nano-banana')
  const [showInsufficientCreditsModal, setShowInsufficientCreditsModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const supabase = createClient()
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null)
  const [loadingCredits, setLoadingCredits] = useState(true)

  const {
    selectedFiles,
    error: uploadError,
    handleDrop,
    handleFileInput,
    removeFile,
  } = useFileUpload()

  const {
    error: checkoutError,
  } = useStripeCheckout({ imageFile: selectedFiles[0]?.file || null, prompt })

  // Redirection si non authentifié
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  const loadProjects = useCallback(async () => {
    try {
      if (!user?.id) {
        console.log('⏳ User not ready yet, skipping loadProjects')
        return
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erreur Supabase:', error)
        return
      }
      
      setProjects(data || [])
      console.log('✅ Projets chargés:', data?.length || 0)
    } catch (error) {
      console.error('Erreur chargement projets:', error)
    } finally {
      setLoadingProjects(false)
    }
  }, [user, supabase])

  // Charger les crédits de l'utilisateur
  const loadCredits = async () => {
    try {
      const response = await fetch('/api/credits')
      if (response.ok) {
        const data = await response.json()
        setCreditsRemaining(data.credits_remaining)
      } else {
        console.error('Erreur chargement crédits')
      }
    } catch (error) {
      console.error('Erreur chargement crédits:', error)
    } finally {
      setLoadingCredits(false)
    }
  }

  // Charger les projets de l'utilisateur
  useEffect(() => {
    if (user) {
      loadProjects()
      loadCredits()
    }
  }, [user, loadProjects])

  // Polling pour vérifier le statut du projet en attente
  useEffect(() => {
    if (!pendingProjectId) return

    const checkProjectStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('payment_status')
          .eq('id', pendingProjectId)
          .single()

        if (error) {
          console.error('Erreur vérification statut:', error)
          return
        }

        if (data?.payment_status === 'paid') {
          console.log('✓ Paiement confirmé !')
          setPaymentVerified(true)
          setVerifyingPayment(false)
          setPendingProjectId(null)
          
          // Arrêter le polling
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current)
            pollingIntervalRef.current = null
          }

          // Recharger les projets
          await loadProjects()

          // Masquer le bandeau vert après 3 secondes
          setTimeout(() => {
            setPaymentVerified(false)
          }, 3000)
        }
      } catch (error) {
        console.error('Erreur polling:', error)
      }
    }

    // Vérifier immédiatement
    checkProjectStatus()

    // Puis vérifier toutes les 1 seconde
    pollingIntervalRef.current = setInterval(checkProjectStatus, 1000)

    // Nettoyage
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    }
  }, [pendingProjectId, supabase, loadProjects])

  // Gérer le retour de Stripe après paiement
  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id')
      const creditsPurchase = searchParams.get('credits_purchase')
      if (!sessionId) return

      // Si c'est un achat de crédits
      if (creditsPurchase === 'true') {
        console.log('Achat de crédits réussi!')
        setPaymentVerified(true)
        await loadCredits()
        
        // Masquer le message après 3 secondes
        setTimeout(() => {
          setPaymentVerified(false)
        }, 3000)

        // Nettoyer l'URL
        setTimeout(() => {
          window.history.replaceState({}, '', '/dashboard')
        }, 1000)
        
        return
      }

      setVerifyingPayment(true)
      console.log('Vérification du paiement Stripe...', sessionId)

      try {
        // Appeler l'API pour vérifier et mettre à jour le paiement
        const response = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        })

        const data = await response.json()

        if (response.ok && data.project) {
          console.log('Paiement vérifié:', data)
          
          // Démarrer le polling pour ce projet
          setPendingProjectId(data.project.id)
        } else {
          console.error('Erreur vérification paiement:', data.error)
          setVerifyingPayment(false)
          // Recharger quand même les projets
          await loadProjects()
        }
      } catch (error) {
        console.error('Erreur:', error)
        setVerifyingPayment(false)
        await loadProjects()
      } finally {
        // Nettoyer l'URL
        setTimeout(() => {
          window.history.replaceState({}, '', '/dashboard')
        }, 1000)
      }
    }

    verifyPayment()
  }, [searchParams, loadProjects])

  const handlePayAndGenerate = async () => {
    if (!selectedFiles || selectedFiles.length === 0 || !prompt.trim()) {
      return
    }

    // Validation : Flux Kontext Max n'accepte qu'une seule image
    if (selectedModel === 'black-forest-labs/flux-kontext-max' && selectedFiles.length > 1) {
      alert('⚠️ Flux Kontext Max n\'accepte qu\'une seule image.\n\nVeuillez supprimer les images supplémentaires ou sélectionner le modèle Google Nano Banana pour utiliser plusieurs images.')
      return
    }

    // Vérifier si l'utilisateur a assez de crédits
    if (creditsRemaining !== null && creditsRemaining >= 1) {
      // L'utilisateur a assez de crédits, on lance directement la génération
      await handleGenerateWithCredits()
    } else {
      // Pas assez de crédits, afficher la modal
      setShowInsufficientCreditsModal(true)
    }
  }

  const handleGenerateWithCredits = async () => {
    if (!selectedFiles || selectedFiles.length === 0 || !prompt.trim()) {
      return
    }

    setGeneratingProject('new')
    try {
      // 1. Créer le projet avec les images uploadées
      const formData = new FormData()
      selectedFiles.forEach((img, index) => {
        formData.append(`image_${index}`, img.file)
      })
      formData.append('images_count', selectedFiles.length.toString())
      formData.append('prompt', prompt)
      formData.append('model', selectedModel)

      const createResponse = await fetch('/api/projects/create', {
        method: 'POST',
        body: formData,
      })

      if (!createResponse.ok) {
        const error = await createResponse.json()
        throw new Error(error.error || 'Erreur lors de la création du projet')
      }

      const { projectId } = await createResponse.json()

      // 2. Lancer la génération avec le projectId
      const generateResponse = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      })

      if (!generateResponse.ok) {
        const error = await generateResponse.json()
        throw new Error(error.error || 'Erreur lors de la génération')
      }

      const data = await generateResponse.json()
      console.log('✅ Génération réussie:', data)

      // Recharger les projets et les crédits
      await loadProjects()
      await loadCredits()

      // Réinitialiser le formulaire
      setPrompt('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

    } catch (error) {
      console.error('Erreur génération:', error)
      alert(error instanceof Error ? error.message : 'Erreur lors de la génération')
      await loadCredits()
    } finally {
      setGeneratingProject(null)
    }
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
      
      // Recharger les projets et les crédits
      await loadProjects()
      await loadCredits()
      
    } catch (error) {
      console.error('Erreur génération:', error)
      alert(error instanceof Error ? error.message : 'Erreur lors de la génération')
      // Recharger les crédits même en cas d'erreur (ils peuvent avoir été déduits)
      await loadCredits()
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full px-6 py-8 max-w-[1600px] mx-auto">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-600">
              Bienvenue {user.email} ! Créez et gérez vos images IA.
            </p>
          </div>
          
          {/* Affichage des crédits */}
          <div className="flex flex-row sm:flex-row gap-2 sm:gap-3 items-center">
            {loadingCredits ? (
              <div className="text-sm text-gray-500">Chargement...</div>
            ) : (
              <>
                {/* Bouton non cliquable - Crédits disponibles */}
                <div className="bg-gray-800 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl shadow-lg cursor-default flex-1 sm:flex-initial">
                  <div className="text-xs sm:text-sm font-medium opacity-90">Crédits disponibles</div>
                  <div className="text-2xl sm:text-4xl font-bold mt-1">
                    {creditsRemaining ?? 0}
                  </div>
                </div>
                
                {/* Bouton cliquable - Obtenir des crédits */}
                <Button
                  onClick={() => router.push('/billing')}
                  className="bg-gradient-to-br from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-4 sm:px-6 py-3 sm:py-4 h-auto rounded-lg sm:rounded-xl shadow-lg transition-all hover:shadow-xl flex-1 sm:flex-initial"
                >
                  <div className="flex flex-col items-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">Obtenir des crédits</span>
                  </div>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Message de vérification du paiement */}
        {verifyingPayment && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-yellow-800 font-medium">
                Paiement réussi ! Vérification en cours...
              </p>
            </div>
          </div>
        )}

        {/* Message de confirmation */}
        {paymentVerified && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-green-800 font-medium">
                Opération finalisée
              </p>
            </div>
          </motion.div>
        )}

        {/* Formulaire de génération */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <Card className="h-[350px] sm:h-[400px] flex flex-col">
            <CardHeader>
              <CardTitle>1. Sélectionnez votre image</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileInput}
                className="hidden"
              />
              <ImageUpload
                images={selectedFiles}
                onDrop={handleDrop}
                onFileSelect={() => fileInputRef.current?.click()}
                onRemove={removeFile}
                error={uploadError || undefined}
                maxImages={selectedModel === 'black-forest-labs/flux-kontext-max' ? 1 : 10}
              />
            </CardContent>
          </Card>

          <Card className="h-[350px] sm:h-[400px] flex flex-col">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">2. Sélectionnez votre modèle</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center space-y-4">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 bg-white"
              >
                <option value="google/nano-banana">Google Nano Banana</option>
                <option value="black-forest-labs/flux-kontext-max">Flux Kontext Max</option>
              </select>
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {selectedModel === 'black-forest-labs/flux-kontext-max' ? (
                  <div>
                    <p className="font-medium mb-1">🎨 Flux Kontext Max</p>
                    <p className="text-xs">Transformations créatives 3D, effets spatiaux et modifications de contexte avancées</p>
                    <p className="text-xs text-orange-600 font-medium mt-2">⚠️ 1 seule image maximum</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium mb-1">🤖 Google Nano Banana</p>
                    <p className="text-xs">Édition d&apos;images polyvalente avec compréhension du contexte et multi-image fusion</p>
                    <p className="text-xs text-green-600 font-medium mt-2">✓ Plusieurs images acceptées (fusion automatique)</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="h-[350px] sm:h-[400px] flex flex-col">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">3. Décrivez la transformation</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center space-y-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Décrivez comment vous voulez transformer votre image... Ex: 'add a hat to the dog', 'make the sky more dramatic', 'change background to beach'"
                className="w-full flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none text-gray-900 placeholder:text-gray-400"
              />
            </CardContent>
          </Card>
        </div>

        {/* Bouton de génération */}
        <div className="mb-8 sm:mb-12 flex flex-col items-center px-4">
          <Button
            onClick={handlePayAndGenerate}
            disabled={!selectedFiles || selectedFiles.length === 0 || !prompt.trim() || generatingProject === 'new'}
            className="w-full sm:max-w-md bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-semibold py-3 sm:py-4 px-8 sm:px-12 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg"
          >
            {generatingProject === 'new' ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Génération en cours...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Générer (1 crédit)
              </span>
            )}
          </Button>
            
          {(uploadError || checkoutError) && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 max-w-md w-full">
              {uploadError || checkoutError}
            </div>
          )}

          <div className="mt-4 text-xs text-gray-500 text-center">
            Paiement sécurisé par Stripe • 1 crédit par génération
          </div>
        </div>

        {/* Modal crédits insuffisants */}
        {showInsufficientCreditsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-8 max-w-md mx-4 shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Crédits insuffisants</h3>
                <p className="text-gray-600">
                  Vous n&apos;avez pas assez de crédits pour effectuer cette génération.
                  <br />
                  Souhaitez-vous acheter des crédits ?
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowInsufficientCreditsModal(false)
                    router.push('/billing')
                  }}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white"
                >
                  Oui, acheter des crédits
                </Button>
                <Button
                  onClick={() => setShowInsufficientCreditsModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Annuler
                </Button>
              </div>
            </motion.div>
          </div>
        )}

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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
      <div className="min-h-screen bg-white flex items-center justify-center">
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
