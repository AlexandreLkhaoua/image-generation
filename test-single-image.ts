/**
 * Test pour vérifier que l'API fonctionne correctement avec une seule image
 */

import Replicate from 'replicate'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

async function testSingleImage() {
  console.log('🧪 Test de génération avec une seule image...\n')

  try {
    const imageUrl = 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0'
    const prompt = 'Transform this landscape into a watercolor painting style'

    console.log('📸 URL de l\'image:', imageUrl)
    console.log('✍️  Prompt:', prompt)
    console.log('\n🔄 Appel de Replicate...\n')

    const output = await replicate.run(
      process.env.REPLICATE_MODEL! as any,
      {
        input: {
          prompt: prompt,
          image_input: [imageUrl], // L'API attend un tableau même pour une seule image
          aspect_ratio: "match_input_image",
          output_format: "jpg"
        }
      }
    )

    console.log('✅ Réponse reçue!')
    console.log('📊 Type de sortie:', typeof output)
    console.log('📦 Sortie:', output)

    // Gérer différents formats de réponse
    let outputImageUrl: string
    if (typeof output === 'string') {
      outputImageUrl = output
    } else if (output && typeof output === 'object' && 'url' in output && typeof (output as any).url === 'function') {
      outputImageUrl = (output as any).url()
    } else if (output && typeof output === 'object' && 'url' in output) {
      outputImageUrl = (output as any).url
    } else if (Array.isArray(output) && output.length > 0) {
      outputImageUrl = output[0]
    } else {
      throw new Error('Format de réponse non supporté')
    }

    console.log('\n✨ URL de l\'image générée:', outputImageUrl)
    console.log('\n✅ Test réussi! L\'API accepte bien une seule image.')

  } catch (error) {
    console.error('❌ Erreur lors du test:', error)
    process.exit(1)
  }
}

testSingleImage()
