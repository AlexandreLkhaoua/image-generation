import * as React from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface PromptInputProps {
  value: string
  onChange: (value: string) => void
  onGenerate: () => void
  isLoading: boolean
  disabled: boolean
}

export function PromptInput({ 
  value, 
  onChange, 
  onGenerate, 
  isLoading, 
  disabled 
}: PromptInputProps) {
  return (
    <div className="space-y-4">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Décrivez comment vous voulez transformer votre image... Ex: 'add a hat to the dog', 'make the sky more dramatic', 'change background to beach'"
        className="h-32"
        disabled={isLoading}
      />
      
      <Button
        onClick={onGenerate}
        disabled={disabled || isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Génération en cours...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Générer l&apos;image</span>
          </div>
        )}
      </Button>

      {isLoading && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">
                Génération en cours
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Cela peut prendre 10-15 secondes...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
