// Test de l'API Replicate pour vérifier que tout fonctionne
import { config } from 'dotenv'
import { join } from 'path'
import Replicate from 'replicate'

// Charger les variables d'environnement
config({ path: join(process.cwd(), '.env.local') })

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

async function testReplicateWithUploadedImage() {
  console.log('🎨 Test avec une vraie image uploadée...\n')
  
  try {
    // Utilisons une URL d'image publique pour tester
    const testImageUrl = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'
    
    console.log('Image de test:', testImageUrl)
    console.log('Modèle:', process.env.REPLICATE_MODEL)
    console.log('Prompt: "make it a beautiful sunset scene"')
    
    console.log('\n⏳ Génération en cours...')
    
    const output = await replicate.run(
      process.env.REPLICATE_MODEL! as any,
      {
        input: {
          image: testImageUrl,
          prompt: "make it a beautiful sunset scene",
          instruction: "transform this image into a beautiful sunset scene"
        }
      }
    )
    
    console.log('\n✅ Génération réussie!')
    console.log('Type de résultat:', typeof output)
    
    if (output && typeof output === 'object' && 'getReader' in output) {
      console.log('📥 ReadableStream reçu - conversion en cours...')
      
      const stream = output as ReadableStream
      const chunks: Uint8Array[] = []
      const reader = stream.getReader()
      
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          chunks.push(value)
        }
      } finally {
        reader.releaseLock()
      }
      
      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
      console.log(`📊 Image générée: ${totalLength} bytes`)
      console.log('🎉 Test complet réussi!')
      
    } else if (typeof output === 'string') {
      console.log('🔗 URL de l\'image:', output)
      console.log('🎉 Test complet réussi!')
      
    } else {
      console.log('⚠️  Format de sortie inattendu:', output)
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error)
  }
}

testReplicateWithUploadedImage()