import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format file size to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Format non supporté. Utilisez JPG, PNG ou WEBP.' }
  }

  if (file.size > maxSize) {
    return { valid: false, error: `Fichier trop volumineux. Maximum ${formatFileSize(maxSize)}.` }
  }

  return { valid: true }
}

/**
 * Download image from URL
 */
export async function downloadImage(url: string, filename: string): Promise<void> {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(blobUrl)
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error)
    throw new Error('Échec du téléchargement')
  }
}

/**
 * Format date to Paris timezone with date and time
 * Assumes dateString is in UTC (as stored in Supabase)
 */
export function formatDateParis(dateString: string): string {
  // Supabase returns timestamps without 'Z', so we need to append it to treat it as UTC
  const utcDate = dateString.endsWith('Z') ? dateString : dateString + 'Z'
  return new Date(utcDate).toLocaleString('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'Europe/Paris'
  })
}

/**
 * Format date to Paris timezone with full format
 * Assumes dateString is in UTC (as stored in Supabase)
 */
export function formatDateParisFull(dateString: string): string {
  // Supabase returns timestamps without 'Z', so we need to append it to treat it as UTC
  const utcDate = dateString.endsWith('Z') ? dateString : dateString + 'Z'
  return new Date(utcDate).toLocaleString('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'medium',
    timeZone: 'Europe/Paris'
  })
}
