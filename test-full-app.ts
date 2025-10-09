// Test complet de l'application
import { config } from 'dotenv'
import { join } from 'path'

// Charger les variables d'environnement
config({ path: join(process.cwd(), '.env.local') })

async function testFullApplication() {
  console.log('🧪 Test complet de l\'application...\n')

  try {
    // Test 1: Vérifier que le serveur répond
    console.log('1. Test du serveur Next.js...')
    const serverResponse = await fetch('http://localhost:3000')
    if (serverResponse.ok) {
      console.log('✅ Serveur Next.js accessible')
    } else {
      console.log('❌ Serveur Next.js non accessible')
      return
    }

    // Test 2: Vérifier l'endpoint API
    console.log('\n2. Test de l\'endpoint API...')
    
    // Créer un FormData simple pour tester
    const formData = new FormData()
    
    // Utiliser une image test simple (1x1 pixel PNG)
    const testImageBlob = new Blob([
      new Uint8Array([
        137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 2, 0, 0, 0, 144, 119, 83, 222, 0, 0, 0, 12, 73, 68, 65, 84, 8, 215, 99, 248, 15, 0, 1, 1, 1, 0, 24, 221, 219, 219, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130
      ])
    ], { type: 'image/png' })
    
    formData.append('image', testImageBlob, 'test.png')
    formData.append('prompt', 'make it beautiful')

    console.log('Envoi de la requête à l\'API...')
    const apiResponse = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      body: formData,
    })

    const result = await apiResponse.json()
    console.log('Statut API:', apiResponse.status)
    console.log('Réponse:', result)

    if (result.success) {
      console.log('✅ API fonctionne correctement !')
      console.log('Image générée:', result.outputImageUrl)
    } else {
      console.log('❌ Erreur API:', result.error)
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error)
  }
}

// Attendre un peu pour que le serveur soit prêt
setTimeout(testFullApplication, 2000)