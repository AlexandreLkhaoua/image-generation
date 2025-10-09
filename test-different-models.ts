/**
 * Test de différents modèles Replicate pour l'édition d'images
 */

import Replicate from 'replicate'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

async function testModel(modelName: string, prompt: string, imageUrl: string) {
  console.log(`\n🧪 Test du modèle: ${modelName}`)
  console.log(`📝 Prompt: ${prompt}`)
  
  try {
    const output = await replicate.run(
      modelName as any,
      {
        input: {
          prompt: prompt,
          image_input: [imageUrl],
          aspect_ratio: "match_input_image",
          output_format: "jpg"
        }
      }
    )

    console.log('✅ Succès!')
    console.log('📦 Type:', typeof output)
    
    // Extraire l'URL
    let resultUrl: string
    if (typeof output === 'string') {
      resultUrl = output
    } else if (output && typeof output === 'object' && 'url' in output) {
      resultUrl = typeof (output as any).url === 'function' 
        ? (output as any).url() 
        : (output as any).url
    } else if (Array.isArray(output) && output.length > 0) {
      resultUrl = output[0]
    } else {
      resultUrl = 'Format non reconnu'
    }
    
    console.log('🖼️  URL:', resultUrl)
    return true
  } catch (error: any) {
    console.log('❌ Erreur:', error.message)
    return false
  }
}

async function main() {
  const testImageUrl = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1' // Image de chien
  const prompt = 'make the tongue blue'
  
  console.log('🎯 Test de différents modèles pour l\'édition d\'images\n')
  console.log('='.repeat(60))
  
  // Modèles à tester
  const models = [
    'google/nano-banana',
    'stability-ai/stable-diffusion-img2img',
    'timothybrooks/instruct-pix2pix',
  ]
  
  for (const model of models) {
    await testModel(model, prompt, testImageUrl)
    console.log('-'.repeat(60))
  }
  
  console.log('\n✅ Tests terminés!')
}

main().catch(console.error)
