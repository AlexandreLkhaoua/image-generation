/**
 * Exemple de Composant Responsive avec Tailwind CSS
 * 
 * Ce fichier montre les bonnes pratiques pour créer
 * des composants qui s'adaptent parfaitement aux smartphones et PC
 */

'use client'

import { useIsMobile, useIsTablet, useIsDesktop } from '@/hooks/use-media-query'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export function ResponsiveExample() {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const isDesktop = useIsDesktop()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      
      {/* Container avec max-width responsive */}
      <div className="max-w-7xl mx-auto">
        
        {/* Header avec titre adaptatif */}
        <header className="mb-6 sm:mb-8 lg:mb-12">
          <h1 className="
            text-3xl sm:text-4xl lg:text-5xl xl:text-6xl
            font-bold text-gray-900
            mb-2 sm:mb-4
            text-center sm:text-left
          ">
            Composant Responsive
          </h1>
          
          <p className="
            text-sm sm:text-base lg:text-lg
            text-gray-600
            text-center sm:text-left
            max-w-2xl
          ">
            Exemple d&apos;utilisation de Tailwind CSS pour créer un composant adaptatif
          </p>
        </header>

        {/* Badge de device actuel */}
        <div className="mb-8 flex justify-center sm:justify-start">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
            <div className={`w-3 h-3 rounded-full ${
              isMobile ? 'bg-green-500' : isTablet ? 'bg-blue-500' : 'bg-purple-500'
            }`}></div>
            <span className="font-medium text-sm">
              {isMobile && '📱 Mobile'}
              {isTablet && '📱 Tablet'}
              {isDesktop && '💻 Desktop'}
            </span>
          </div>
        </div>

        {/* Grid responsive - 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {[1, 2, 3].map((num) => (
            <Card key={num} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Card {num}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  Contenu adaptatif qui s&apos;ajuste selon la taille de l&apos;écran
                </p>
                <Button 
                  className="w-full sm:w-auto"
                  size={isMobile ? "default" : "sm"}
                >
                  Action {num}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Flex responsive - Stack sur mobile, row sur desktop */}
        <div className="
          flex flex-col sm:flex-row
          gap-4 sm:gap-6
          items-stretch sm:items-center
          mb-8
        ">
          <div className="flex-1 bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="font-semibold text-base sm:text-lg mb-2">
              Section 1
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Cette section prend toute la largeur sur mobile et partage l&apos;espace sur desktop
            </p>
          </div>
          
          <div className="flex-1 bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="font-semibold text-base sm:text-lg mb-2">
              Section 2
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Layout flexible qui s&apos;adapte automatiquement
            </p>
          </div>
        </div>

        {/* Tableau responsive avec scroll horizontal sur mobile */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tableau Responsive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Nom
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">
                      Description
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Statut
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[1, 2, 3].map((num) => (
                    <tr key={num}>
                      <td className="px-3 sm:px-6 py-4 text-sm whitespace-nowrap">
                        Item {num}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm hidden sm:table-cell">
                        Description longue visible uniquement sur tablet+
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Actif
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm hidden lg:table-cell">
                        <Button size="sm" variant="outline">
                          Voir
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Boutons responsives */}
        <div className="
          flex flex-col sm:flex-row
          gap-3 sm:gap-4
          items-stretch sm:items-center
          justify-center sm:justify-start
        ">
          <Button 
            size={isMobile ? "lg" : "default"}
            className="w-full sm:w-auto"
          >
            Bouton Principal
          </Button>
          
          <Button 
            variant="outline"
            size={isMobile ? "lg" : "default"}
            className="w-full sm:w-auto"
          >
            Bouton Secondaire
          </Button>
        </div>

        {/* Spacing responsive */}
        <div className="mt-8 sm:mt-12 lg:mt-16">
          <Card>
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 lg:mb-6">
                Spacing Adaptatif
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600">
                Les marges et paddings s&apos;adaptent automatiquement selon la taille de l&apos;écran.
                Plus l&apos;écran est grand, plus l&apos;espacement augmente pour une meilleure lisibilité.
              </p>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}

/**
 * CHEATSHEET TAILWIND RESPONSIVE
 * 
 * Spacing:
 * - Mobile: p-4, m-4, gap-3
 * - Tablet: sm:p-6, sm:m-6, sm:gap-4
 * - Desktop: lg:p-8, lg:m-8, lg:gap-6
 * 
 * Typography:
 * - Mobile: text-sm, text-base
 * - Tablet: sm:text-base, sm:text-lg
 * - Desktop: lg:text-lg, lg:text-xl
 * 
 * Layout:
 * - Mobile: flex flex-col, grid-cols-1
 * - Tablet: sm:flex-row, sm:grid-cols-2
 * - Desktop: lg:grid-cols-3, lg:grid-cols-4
 * 
 * Visibility:
 * - Mobile only: block sm:hidden
 * - Tablet+: hidden sm:block
 * - Desktop only: hidden lg:block
 * 
 * Width:
 * - Mobile: w-full
 * - Tablet+: sm:w-auto, sm:max-w-md
 * - Desktop: lg:max-w-4xl
 */
