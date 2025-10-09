// Test simple de l'API Replicate
import { config } from 'dotenv'
import { join } from 'path'
import Replicate from 'replicate'

// Charger les variables d'environnement
config({ path: join(process.cwd(), '.env.local') })

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

async function testReplicate() {
  console.log('🧪 Test de l\'API Replicate...\n')
  
  try {
    console.log('Token Replicate:', process.env.REPLICATE_API_TOKEN ? '✅ Présent' : '❌ Manquant')
    console.log('Modèle:', process.env.REPLICATE_MODEL)
    
    // Test simple avec une image publique
    const testImageUrl = 'https://replicate.delivery/pbxt/JZy4zPdxC0p1lHQVh5gKWqgjGBxnkpb9RKQzFcOxK1sdOJZL/output.png'
    
    console.log('\nTest avec une image exemple...')
    
    const output = await replicate.run(
      process.env.REPLICATE_MODEL! as any,
      {
        input: {
          image: testImageUrl,
          prompt: "beautiful sunset scene, high quality, detailed",
          hdr: 1,
          resolution: 1024
        }
      }
    )
    
    console.log('✅ Test réussi!')
    console.log('Type de résultat:', typeof output)
    console.log('Résultat:', output)
    
    // Si c'est un stream, essayons de le lire
    if (output && typeof output === 'object' && 'pipe' in output) {
      console.log('C\'est un stream, tentative de lecture...')
    } else if (Array.isArray(output)) {
      console.log('Nombre d\'éléments:', output.length)
      console.log('Premier élément:', output[0])
    } else {
      console.log('Format non reconnu')
    }
    
  } catch (error) {
    console.error('❌ Erreur Replicate:', error)
  }
}

testReplicate()