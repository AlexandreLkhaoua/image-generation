import { useState, useEffect } from 'react'

/**
 * Hook pour détecter la taille de l'écran
 * Retourne true si l'écran correspond à la media query
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    
    // Définir la valeur initiale
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    // Écouter les changements
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    
    // Utiliser la nouvelle API ou la version legacy
    if (media.addEventListener) {
      media.addEventListener('change', listener)
    } else {
      // Fallback pour les anciens navigateurs
      media.addListener(listener)
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener)
      } else {
        media.removeListener(listener)
      }
    }
  }, [matches, query])

  return matches
}

/**
 * Hook pour détecter si on est sur mobile
 * Retourne true si la largeur est < 768px (Tailwind breakpoint md)
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)')
}

/**
 * Hook pour détecter si on est sur tablette
 * Retourne true si la largeur est entre 768px et 1023px
 */
export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
}

/**
 * Hook pour détecter si on est sur desktop
 * Retourne true si la largeur est >= 1024px
 */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)')
}

/**
 * Hook pour obtenir le breakpoint actuel
 */
export function useBreakpoint(): 'mobile' | 'tablet' | 'desktop' {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  
  if (isMobile) return 'mobile'
  if (isTablet) return 'tablet'
  return 'desktop'
}
