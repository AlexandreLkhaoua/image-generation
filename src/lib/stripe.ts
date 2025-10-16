import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

// Initialiser Stripe avec la clé secrète
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
  typescript: true,
})

// Prix par génération en centimes (2.00 EUR = 200 centimes)
export const PRICE_PER_GENERATION = 200 // 2.00 EUR
export const CURRENCY = 'eur'
