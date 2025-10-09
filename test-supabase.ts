// Script pour tester la configuration Supabase
// Pour l'exécuter : npm run test-config

import { config } from 'dotenv'
import { join } from 'path'
import { createClient } from '@supabase/supabase-js'

// Charger les variables d'environnement
config({ path: join(process.cwd(), '.env.local') })

async function testSupabaseConnection() {
  console.log('🔧 Test de la connexion Supabase...\n')

  try {
    // Test 1: Variables d'environnement
    console.log('1. Vérification des variables d\'environnement...')
    
    const requiredVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'SUPABASE_INPUT_BUCKET',
      'SUPABASE_OUTPUT_BUCKET',
      'REPLICATE_API_TOKEN',
      'REPLICATE_MODEL'
    ]

    let allVarsPresent = true
    for (const varName of requiredVars) {
      if (process.env[varName]) {
        console.log(`✅ ${varName}: OK`)
      } else {
        console.log(`❌ ${varName}: MANQUANT`)
        allVarsPresent = false
      }
    }

    if (!allVarsPresent) {
      console.log('\n⚠️  Des variables d\'environnement sont manquantes. Vérifiez votre fichier .env.local')
      return
    }

    // Créer le client Supabase avec les variables chargées
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Test 2: Connexion à la base de données
    console.log('\n2. Test de connexion à la base de données...')
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .limit(1)

    if (error) {
      console.error('❌ Erreur de connexion à la base:', error.message)
      console.log('\n💡 Assurez-vous que la table "projects" existe dans votre base Supabase')
      console.log('SQL pour créer la table:')
      console.log(`
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  input_image_url TEXT NOT NULL,
  output_image_url TEXT,
  prompt TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed'))
);`)
      return
    }
    console.log('✅ Connexion à la base de données réussie')

    // Test 3: Buckets de stockage
    console.log('\n3. Test des buckets de stockage...')
    
    const { data: inputBucket, error: inputError } = await supabaseAdmin.storage
      .from(process.env.SUPABASE_INPUT_BUCKET!)
      .list('', { limit: 1 })

    if (inputError) {
      console.error('❌ Erreur bucket input-images:', inputError.message)
      console.log('💡 Créez le bucket "input-images" dans Supabase Storage')
    } else {
      console.log('✅ Bucket input-images accessible')
    }

    const { data: outputBucket, error: outputError } = await supabaseAdmin.storage
      .from(process.env.SUPABASE_OUTPUT_BUCKET!)
      .list('', { limit: 1 })

    if (outputError) {
      console.error('❌ Erreur bucket output-images:', outputError.message)
      console.log('💡 Créez le bucket "output-images" dans Supabase Storage')
    } else {
      console.log('✅ Bucket output-images accessible')
    }

    if (!inputError && !outputError) {
      console.log('\n🎉 Configuration complète ! Votre projet est prêt à être utilisé.')
    } else {
      console.log('\n⚠️  Veuillez créer les buckets manquants dans Supabase Storage')
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error)
  }
}

testSupabaseConnection()