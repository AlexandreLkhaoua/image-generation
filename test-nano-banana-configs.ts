/**
 * Test avec différentes configurations de paramètres pour nano-banana
 */

import Replicate from 'replicate'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

async function testWithConfig(configName: string, input: any) {
  console.log(`\n🧪 Test: ${configName}`)
  console.log('📋 Configuration:', JSON.stringify(input, null, 2))
  
  try {
    const output = await replicate.run(
      'google/nano-banana' as any,
      { input }
    )

    console.log('✅ Succès!')
    
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
    return resultUrl
  } catch (error: any) {
    console.log('❌ Erreur:', error.message)
    return null
  }
}

async function main() {
  const testImageUrl = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1'
  
  console.log('🎯 Test de différentes configurations pour nano-banana\n')
  
  // Configuration 1: Format actuel
  await testWithConfig('Configuration actuelle', {
    prompt: 'make the tongue blue',
    image_input: [testImageUrl],
    aspect_ratio: "match_input_image",
    output_format: "jpg"
  })
  
  // Configuration 2: Avec guidance_scale
  await testWithConfig('Avec guidance scale élevé', {
    prompt: 'make the tongue blue',
    image_input: [testImageUrl],
    aspect_ratio: "match_input_image",
    output_format: "jpg",
    guidance_scale: 15
  })
  
  // Configuration 3: Prompt plus détaillé
  await testWithConfig('Prompt détaillé', {
    prompt: 'Edit the image to change the dog tongue color to bright blue, keep everything else unchanged',
    image_input: [testImageUrl],
    aspect_ratio: "match_input_image",
    output_format: "jpg"
  })
  
  // Configuration 4: Avec seed pour reproductibilité
  await testWithConfig('Avec seed', {
    prompt: 'change tongue color to blue',
    image_input: [testImageUrl],
    aspect_ratio: "match_input_image",
    output_format: "jpg",
    seed: 42
  })
  
  console.log('\n✅ Tests terminés!')
}

main().catch(console.error)
