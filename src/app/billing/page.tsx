'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { CREDIT_PACKS } from '@/lib/credit-packs'

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
  const [promoMessage, setPromoMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

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

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      succeeded: { label: 'Payé', className: 'bg-green-100 text-green-800' },
      processing: { label: 'En cours', className: 'bg-yellow-100 text-yellow-800' },
      requires_payment_method: { label: 'Action requise', className: 'bg-orange-100 text-orange-800' },
      canceled: { label: 'Annulé', className: 'bg-gray-100 text-gray-800' },
      failed: { label: 'Échoué', className: 'bg-red-100 text-red-800' },
    }

    const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800' }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
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
      alert(err instanceof Error ? err.message : 'Erreur lors de l achat')
    } finally {
      setBuyingPack(null)
    }
  }

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoMessage({ type: 'error', text: 'Veuillez entrer un code promo' })
      return
    }

    setApplyingPromo(true)
    setPromoMessage(null)

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

      setPromoMessage({ 
        type: 'success', 
        text: `Code promo appliqué ! ${data.credits} crédits ajoutés.` 
      })
      setPromoCode('')
      
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (err) {
      setPromoMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'Code promo invalide' 
      })
    } finally {
      setApplyingPromo(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Facturation & Crédits
          </h1>
          <p className="text-lg text-gray-600">
            Achetez des crédits et gérez vos paiements
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Acheter des crédits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CREDIT_PACKS.map((pack) => (
              <Card 
                key={pack.id}
                className={`relative overflow-hidden transition-all hover:shadow-lg ${
                  pack.popular ? 'border-2 border-transparent bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-border' : ''
                }`}
                style={pack.popular ? {
                  backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, rgb(234, 179, 8), rgb(234, 88, 12))',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box'
                } : undefined}
              >
                {pack.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-3 py-1 text-xs font-bold">
                    POPULAIRE
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{pack.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-gray-900">{pack.credits}</div>
                    <div className="text-sm text-gray-500">crédits</div>
                  </div>
                  <div className="mb-4">
                    <div className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">{pack.price}€</div>
                    <div className="text-sm text-gray-500">
                      {(pack.price / pack.credits).toFixed(2)}€ / crédit
                    </div>
                  </div>
                  <Button
                    onClick={() => handleBuyCredits(pack.id)}
                    disabled={buyingPack === pack.id}
                    className="w-full"
                  >
                    {buyingPack === pack.id ? (
                      <span className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Chargement...
                      </span>
                    ) : (
                      'Acheter'
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-xl">Code Promo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Entrez votre code"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-900"
                  disabled={applyingPromo}
                />
                <Button
                  onClick={handleApplyPromoCode}
                  disabled={applyingPromo || !promoCode.trim()}
                >
                  {applyingPromo ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Appliquer'
                  )}
                </Button>
              </div>
              {promoMessage && (
                <div className={`mt-3 p-3 rounded-lg text-sm ${
                  promoMessage.type === 'success' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {promoMessage.text}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Historique des achats</h2>
          
          {error ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-red-600">
                  <p>{error}</p>
                </div>
              </CardContent>
            </Card>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Crédits
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reçu
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(payment.created)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.description || 'Achat de crédits'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.credits ? (
                            <span className="font-medium bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">
                              +{payment.credits} crédits
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {(payment.amount / 100).toFixed(2)} {payment.currency.toUpperCase()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(payment.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
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
