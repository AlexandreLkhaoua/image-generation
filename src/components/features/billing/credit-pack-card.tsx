import * as React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CreditPack {
  id: string
  name: string
  credits: number
  price: number
  popular?: boolean
}

interface CreditPackCardProps {
  pack: CreditPack
  onSelect: (packId: string) => void
  isLoading?: boolean
  className?: string
}

export function CreditPackCard({ pack, onSelect, isLoading = false, className }: CreditPackCardProps) {
  const pricePerCredit = pack.price / pack.credits

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all hover:shadow-lg',
        pack.popular && 'border-2 border-yellow-500 shadow-md',
        className
      )}
    >
      {/* Badge Popular */}
      {pack.popular && (
        <div className="absolute -right-10 top-4 rotate-45 bg-gradient-to-r from-yellow-500 to-orange-600 px-12 py-1 text-xs font-semibold text-white shadow-md">
          Populaire
        </div>
      )}

      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-900">{pack.name}</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-gray-900">{pack.price}€</span>
          </div>
          <p className="text-sm text-gray-500">
            {pricePerCredit.toFixed(2)}€ par crédit
          </p>
        </div>

        {/* Credits */}
        <div className="py-4 border-y border-gray-200">
          <div className="flex items-center justify-center gap-2">
            <svg
              className="w-6 h-6 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-3xl font-bold text-gray-900">{pack.credits}</span>
            <span className="text-gray-500">crédits</span>
          </div>
        </div>

        {/* Description */}
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{pack.credits} images générées</span>
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Pas d&apos;expiration</span>
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Qualité professionnelle</span>
          </li>
        </ul>

        {/* CTA Button */}
        <Button
          onClick={() => onSelect(pack.id)}
          disabled={isLoading}
          className="w-full"
          size="lg"
          variant={pack.popular ? 'default' : 'outline'}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Chargement...</span>
            </div>
          ) : (
            'Acheter maintenant'
          )}
        </Button>

        {/* Badge économie si applicable */}
        {pack.credits >= 25 && (
          <div className="text-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              💰 Économisez {((2 - pricePerCredit) * pack.credits).toFixed(0)}€
            </span>
          </div>
        )}
      </div>
    </Card>
  )
}
