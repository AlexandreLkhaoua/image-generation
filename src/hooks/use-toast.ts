import { toast as sonnerToast } from 'sonner'

/**
 * Hook pour utiliser les toasts (notifications)
 * Wrapper autour de sonner pour une API plus simple
 */
export function useToast() {
  return {
    toast: ({
      title,
      description,
      variant = 'default',
      duration = 4000,
    }: {
      title: string
      description?: string
      variant?: 'default' | 'success' | 'error' | 'warning' | 'info'
      duration?: number
    }) => {
      switch (variant) {
        case 'success':
          return sonnerToast.success(title, {
            description,
            duration,
          })
        case 'error':
          return sonnerToast.error(title, {
            description,
            duration,
          })
        case 'warning':
          return sonnerToast.warning(title, {
            description,
            duration,
          })
        case 'info':
          return sonnerToast.info(title, {
            description,
            duration,
          })
        default:
          return sonnerToast(title, {
            description,
            duration,
          })
      }
    },
    success: (title: string, description?: string) => {
      return sonnerToast.success(title, { description })
    },
    error: (title: string, description?: string) => {
      return sonnerToast.error(title, { description })
    },
    warning: (title: string, description?: string) => {
      return sonnerToast.warning(title, { description })
    },
    info: (title: string, description?: string) => {
      return sonnerToast.info(title, { description })
    },
  }
}
