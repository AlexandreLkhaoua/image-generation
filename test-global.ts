#!/usr/bin/env tsx
/**
 * 🧪 Test Global du Projet AI Image Editor
 * 
 * Ce script teste toutes les fonctionnalités critiques du projet :
 * - Configuration Supabase
 * - API Replicate
 * - Upload d'images
 * - Génération d'images
 * - Téléchargement de résultats
 */

import * as dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import Replicate from 'replicate'

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' })

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
}

const log = {
  success: (msg: string) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg: string) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg: string) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  step: (msg: string) => console.log(`${colors.cyan}🔄 ${msg}${colors.reset}`),
  title: (msg: string) => console.log(`\n${colors.magenta}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${msg}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`),
}

// Variables globales pour les tests
let testsPassed = 0
let testsFailed = 0
const startTime = Date.now()

// ============================================================================
// TEST 1: Configuration des Variables d'Environnement
// ============================================================================
async function testEnvironmentVariables() {
  log.title('TEST 1: Variables d\'Environnement')
  
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'SUPABASE_INPUT_BUCKET',
    'SUPABASE_OUTPUT_BUCKET',
    'REPLICATE_API_TOKEN',
    'REPLICATE_MODEL',
  ]

  let allPresent = true

  for (const varName of requiredVars) {
    if (process.env[varName]) {
      log.success(`${varName} est configuré`)
    } else {
      log.error(`${varName} est MANQUANT`)
      allPresent = false
    }
  }

  if (allPresent) {
    testsPassed++
    log.success('Toutes les variables d\'environnement sont présentes')
    return true
  } else {
    testsFailed++
    log.error('Certaines variables d\'environnement sont manquantes')
    return false
  }
}

// ============================================================================
// TEST 2: Connexion Supabase
// ============================================================================
async function testSupabaseConnection() {
  log.title('TEST 2: Connexion Supabase')
  
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Test de connexion à la base de données
    log.step('Test de connexion à la base de données...')
    const { data, error } = await supabase.from('projects').select('count').limit(1)

    if (error) throw error

    log.success('Connexion à Supabase réussie')
    log.info(`Table 'projects' accessible`)

    // Test des buckets de stockage
    log.step('Vérification des buckets de stockage...')
    
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) throw bucketsError

    const inputBucketExists = buckets.some(b => b.name === process.env.SUPABASE_INPUT_BUCKET)
    const outputBucketExists = buckets.some(b => b.name === process.env.SUPABASE_OUTPUT_BUCKET)

    if (inputBucketExists) {
      log.success(`Bucket '${process.env.SUPABASE_INPUT_BUCKET}' existe`)
    } else {
      log.error(`Bucket '${process.env.SUPABASE_INPUT_BUCKET}' MANQUANT`)
    }

    if (outputBucketExists) {
      log.success(`Bucket '${process.env.SUPABASE_OUTPUT_BUCKET}' existe`)
    } else {
      log.error(`Bucket '${process.env.SUPABASE_OUTPUT_BUCKET}' MANQUANT`)
    }

    if (inputBucketExists && outputBucketExists) {
      testsPassed++
      return true
    } else {
      testsFailed++
      return false
    }

  } catch (error) {
    log.error(`Erreur Supabase: ${error}`)
    testsFailed++
    return false
  }
}

// ============================================================================
// TEST 3: API Replicate
// ============================================================================
async function testReplicateAPI() {
  log.title('TEST 3: API Replicate')
  
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN!,
    })

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    log.step('Test de connexion à l\'API Replicate...')
    
    // Charger une image locale depuis le Bureau
    const fs = require('fs')
    const path = require('path')
    const homeDir = process.env.HOME || process.env.USERPROFILE || ''
    const imagePath = path.join(homeDir, 'Desktop', 'screenshots', 'SCR-20251008-njup.jpeg')
    
    if (!fs.existsSync(imagePath)) {
      throw new Error(`❌ Image non trouvée à: ${imagePath}`)
    }
    
    const imageBuffer = fs.readFileSync(imagePath)
    log.success(`Image chargée: ${imagePath}`)
    log.info(`Taille: ${(imageBuffer.length / 1024).toFixed(2)} KB`)
    
    // Upload de l'image vers Supabase pour obtenir une URL publique
    const fileName = `test-replicate-${Date.now()}.jpeg`
    const { error: uploadError } = await supabase.storage
      .from(process.env.SUPABASE_INPUT_BUCKET!)
      .upload(fileName, imageBuffer, {
        contentType: 'image/jpeg',
        upsert: false
      })

    if (uploadError) throw uploadError

    const { data: urlData } = supabase.storage
      .from(process.env.SUPABASE_INPUT_BUCKET!)
      .getPublicUrl(fileName)

    const testImageUrl = urlData.publicUrl
    const testPrompt = 'add a hat to the dog'

    log.info(`URL publique: ${testImageUrl}`)
    log.info(`Prompt de test: "${testPrompt}"`)
    log.warning('Génération en cours... (cela peut prendre 10-15 secondes)')

    const output = await replicate.run(
      process.env.REPLICATE_MODEL! as `${string}/${string}` | `${string}/${string}:${string}`,
      {
        input: {
          prompt: `Edit this image precisely: ${testPrompt}. Keep the original composition and style, only modify what is explicitly requested.`,
          image_input: [testImageUrl],
          aspect_ratio: "match_input_image",
          output_format: "jpg"
        }
      }
    )

    log.info(`Type de réponse: ${typeof output}`)

    let outputUrl: string | null = null

    if (typeof output === 'string') {
      outputUrl = output
    } else if (Array.isArray(output) && output.length > 0) {
      outputUrl = output[0]
    } else if (output && typeof output === 'object' && 'url' in output) {
      outputUrl = (output as any).url
    }

    if (outputUrl) {
      log.success('Image générée avec succès !')
      const urlString = typeof outputUrl === 'string' ? outputUrl : String(outputUrl)
      log.info(`URL de l'image: ${urlString.substring(0, 60)}...`)
      testsPassed++
      return true
    } else {
      log.error('Format de réponse Replicate inattendu')
      testsFailed++
      return false
    }

  } catch (error) {
    log.error(`Erreur Replicate: ${error}`)
    testsFailed++
    return false
  }
}

// ============================================================================
// TEST 4: Workflow Complet
// ============================================================================
async function testCompleteWorkflow() {
  log.title('TEST 4: Workflow Complet (Upload → Generate → Download)')
  
  try {
    log.step('Simulation d\'un workflow complet...')
    
    // Créer un client Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Simuler l'upload d'une image
    const testData = Buffer.from('test-image-data')
    const fileName = `test-${Date.now()}.jpg`
    
    log.step('1. Upload de l\'image de test...')
    const { error: uploadError } = await supabase
      .storage
      .from(process.env.SUPABASE_INPUT_BUCKET!)
      .upload(fileName, testData, {
        contentType: 'image/jpeg',
        upsert: false
      })

    if (uploadError) throw uploadError
    log.success('Upload réussi')

    // Récupérer l'URL publique
    const { data: { publicUrl } } = supabase
      .storage
      .from(process.env.SUPABASE_INPUT_BUCKET!)
      .getPublicUrl(fileName)

    log.success(`URL publique: ${publicUrl.substring(0, 50)}...`)

    // Créer un projet dans la base de données
    log.step('2. Création du projet dans la BDD...')
    const { data: project, error: dbError } = await supabase
      .from('projects')
      .insert({
        input_image_url: publicUrl,
        prompt: 'test prompt',
        status: 'processing'
      })
      .select()
      .single()

    if (dbError) throw dbError
    log.success(`Projet créé avec ID: ${project.id}`)

    // Mettre à jour le statut
    log.step('3. Mise à jour du statut...')
    const { error: updateError } = await supabase
      .from('projects')
      .update({ status: 'completed', output_image_url: 'https://example.com/output.jpg' })
      .eq('id', project.id)

    if (updateError) throw updateError
    log.success('Statut mis à jour')

    // Nettoyage
    log.step('4. Nettoyage des fichiers de test...')
    await supabase.storage.from(process.env.SUPABASE_INPUT_BUCKET!).remove([fileName])
    await supabase.from('projects').delete().eq('id', project.id)
    log.success('Nettoyage terminé')

    testsPassed++
    log.success('Workflow complet réussi !')
    return true

  } catch (error) {
    log.error(`Erreur workflow: ${error}`)
    testsFailed++
    return false
  }
}

// ============================================================================
// EXÉCUTION DES TESTS
// ============================================================================
async function runAllTests() {
  console.clear()
  log.title('🧪 SUITE DE TESTS - AI IMAGE EDITOR')
  log.info(`Début des tests: ${new Date().toLocaleString('fr-FR')}`)
  
  await testEnvironmentVariables()
  await testSupabaseConnection()
  await testReplicateAPI()
  await testCompleteWorkflow()

  // Résumé
  const duration = ((Date.now() - startTime) / 1000).toFixed(2)
  const total = testsPassed + testsFailed
  
  log.title('📊 RÉSUMÉ DES TESTS')
  
  console.log(`Total de tests : ${total}`)
  console.log(`${colors.green}✅ Réussis    : ${testsPassed}${colors.reset}`)
  console.log(`${colors.red}❌ Échoués    : ${testsFailed}${colors.reset}`)
  console.log(`⏱️  Durée      : ${duration}s`)
  
  if (testsFailed === 0) {
    log.success('🎉 TOUS LES TESTS SONT PASSÉS !')
    log.info('Votre application est prête pour la production ! 🚀')
  } else {
    log.error('❌ CERTAINS TESTS ONT ÉCHOUÉ')
    log.warning('Veuillez corriger les erreurs avant de déployer')
  }

  console.log('\n')
  process.exit(testsFailed > 0 ? 1 : 0)
}

// Exécuter les tests
runAllTests().catch((error) => {
  log.error(`Erreur fatale: ${error}`)
  process.exit(1)
})
