'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { motion } from 'framer-motion'
import { CREDIT_PACKS } from '@/lib/credit-packs'
import { CreditPackCard } from '@/components/features/billing'
import { useToast } from '@/hooks/use-toast'

interface Payment {
  id: string
  amount: number
  currency: string
  status: string
  created: number
  receiptUrl: string | null
  description: string
  credits?: number
}

export default function BillingPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [buyingPack, setBuyingPack] = useState<string | null>(null)
  const [promoCode, setPromoCode] = useState('')
  const [applyingPromo, setApplyingPromo] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch('/api/billing')
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des paiements')
        }

        const data = await response.json()
        setPayments(data.payments || [])
      } catch (err) {
        console.error('Erreur chargement paiements:', err)
        setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchPayments()
    }
  }, [user])

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const { success, error: showError } = useToast()

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      succeeded: { label: 'Payé', variant: 'default' },
      processing: { label: 'En cours', variant: 'secondary' },
      requires_payment_method: { label: 'Action requise', variant: 'outline' },
      canceled: { label: 'Annulé', variant: 'secondary' },
      failed: { label: 'Échoué', variant: 'destructive' },
    }

    const config = statusConfig[status] || { label: status, variant: 'secondary' as const }

    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    )
  }

  const handleBuyCredits = async (packId: string) => {
    setBuyingPack(packId)
    try {
      const response = await fetch('/api/buy-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l achat')
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error('Erreur achat crédits:', err)
      showError(
        'Erreur lors de l\'achat',
        err instanceof Error ? err.message : 'Une erreur est survenue'
      )
    } finally {
      setBuyingPack(null)
    }
  }

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      showError('Erreur', 'Veuillez entrer un code promo')
      return
    }

    setApplyingPromo(true)

    try {
      const response = await fetch('/api/promo-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Code promo invalide')
      }

      success(
        'Code promo appliqué !',
        `${data.credits} crédits ajoutés à votre compte`
      )
      setPromoCode('')
      
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (err) {
      showError(
        'Code promo invalide',
        err instanceof Error ? err.message : 'Ce code promo n\'existe pas ou a expiré'
      )
    } finally {
      setApplyingPromo(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-72 mx-auto" />
          </div>
          <div className="mb-12">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Facturation & Crédits
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Achetez des crédits et gérez vos paiements
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 sm:mb-12"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Acheter des crédits</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {CREDIT_PACKS.map((pack) => (
              <CreditPackCard
                key={pack.id}
                pack={pack}
                onSelect={handleBuyCredits}
                isLoading={buyingPack === pack.id}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 sm:mb-12"
        >
          <Card className="max-w-md mx-auto bg-white">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Code Promo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Entrez votre code"
                  disabled={applyingPromo}
                  className="flex-1 bg-white text-gray-900 focus:ring-0 focus:outline-none"
                />
                <Button
                  onClick={handleApplyPromoCode}
                  disabled={applyingPromo || !promoCode.trim()}
                  className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-semibold"
                >
                  {applyingPromo ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Appliquer'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Historique des achats</h2>
          
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          ) : payments.length === 0 ? (
            <Card>
              <CardContent className="p-12">
                <div className="text-center text-gray-500">
                  <svg
                    className="mx-auto h-12 w-12 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  <p className="text-lg font-medium">Aucun paiement pour le moment</p>
                  <p className="text-sm mt-2">Vos achats de crédits apparaîtront ici</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                        Description
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Crédits
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Statut
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Reçu
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">
                          <div className="whitespace-nowrap">{formatDate(payment.created)}</div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden sm:table-cell">
                          {payment.description || 'Achat de crédits'}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          {payment.credits ? (
                            <span className="font-medium bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">
                              +{payment.credits}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                          {(payment.amount / 100).toFixed(2)} {payment.currency.toUpperCase()}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                          {getStatusBadge(payment.status)}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm hidden lg:table-cell">
                          {payment.receiptUrl ? (
                            <a
                              href={payment.receiptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent hover:from-yellow-600 hover:to-orange-700 hover:underline font-medium"
                            >
                              Voir le reçu
                            </a>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
