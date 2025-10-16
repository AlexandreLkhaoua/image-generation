'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

interface Payment {
  id: string
  amount: number
  currency: string
  status: string
  created: number
  receiptUrl: string | null
  description: string
}

export default function BillingPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Redirection si non authentifié
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // Charger l'historique des paiements
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
              className="mb-4"
            >
              ← Retour au dashboard
            </Button>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Historique des paiements
            </h1>
            <p className="text-gray-600">
              Consultez l&apos;historique de toutes vos transactions
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Paiements</CardTitle>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="w-16 h-16 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  <p className="text-gray-600">Aucun paiement pour le moment</p>
                  <Button
                    onClick={() => router.push('/dashboard')}
                    className="mt-4"
                  >
                    Commencer une génération
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Description
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Montant
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Statut
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Facture
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr
                          key={payment.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {formatDate(payment.created)}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            {payment.description}
                          </td>
                          <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                            {payment.amount.toFixed(2)} {payment.currency.toUpperCase()}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            {getStatusBadge(payment.status)}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            {payment.receiptUrl ? (
                              <a
                                href={payment.receiptUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
                              >
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                                PDF
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
              )}
            </CardContent>
          </Card>

          {payments.length > 0 && (
            <div className="mt-6 text-sm text-gray-500 text-center">
              Total des paiements : {payments.length}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
