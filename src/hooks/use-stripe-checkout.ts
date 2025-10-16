import { useState } from 'react'

interface UseStripeCheckoutProps {
  imageFile: File | null
  prompt: string
}

interface UseStripeCheckoutReturn {
  isLoading: boolean
  error: string | null
  createCheckoutSession: () => Promise<void>
}

export function useStripeCheckout({ imageFile, prompt }: UseStripeCheckoutProps): UseStripeCheckoutReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createCheckoutSession = async () => {
    if (!imageFile) {
      setError('Veuillez sélectionner une image')
      return
    }

    if (!prompt.trim()) {
      setError('Veuillez entrer un prompt')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Préparer les données en FormData
      const formData = new FormData()
      formData.append('image', imageFile)
      formData.append('prompt', prompt.trim())

      // Appeler l'API pour créer la session de paiement
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la création de la session de paiement')
      }

      const data = await response.json()

      // Rediriger vers la page de paiement Stripe
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('URL de paiement non reçue')
      }

    } catch (err) {
      console.error('Erreur création session:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    createCheckoutSession,
  }
}
