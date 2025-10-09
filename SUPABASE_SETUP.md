# Configuration Supabase

## Étapes à suivre dans votre tableau de bord Supabase

### 1. Créer la table `projects`

Allez dans l'éditeur SQL de Supabase et exécutez cette requête :

```sql
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  input_image_url TEXT NOT NULL,
  output_image_url TEXT,
  prompt TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed'))
);

-- Activer RLS (Row Level Security) si souhaité
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Créer une politique pour permettre toutes les opérations (pour le développement)
CREATE POLICY "Allow all operations on projects" ON projects FOR ALL USING (true);
```

### 2. Créer les buckets de stockage

1. Allez dans **Storage** dans votre tableau de bord Supabase
2. Créez un nouveau bucket appelé `input-images`
   - Nom : `input-images`
   - Public : ✅ (coché)
3. Créez un second bucket appelé `output-images`
   - Nom : `output-images`
   - Public : ✅ (coché)

### 3. Configuration des politiques de stockage (optionnel)

Si vous voulez plus de sécurité, vous pouvez créer des politiques pour les buckets :

```sql
-- Pour le bucket input-images
INSERT INTO storage.buckets (id, name, public) VALUES ('input-images', 'input-images', true);

-- Politique pour permettre l'upload
CREATE POLICY "Allow uploads to input-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'input-images');

-- Politique pour permettre la lecture
CREATE POLICY "Allow read access to input-images" ON storage.objects FOR SELECT USING (bucket_id = 'input-images');

-- Pour le bucket output-images
INSERT INTO storage.buckets (id, name, public) VALUES ('output-images', 'output-images', true);

-- Politique pour permettre l'upload
CREATE POLICY "Allow uploads to output-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'output-images');

-- Politique pour permettre la lecture
CREATE POLICY "Allow read access to output-images" ON storage.objects FOR SELECT USING (bucket_id = 'output-images');
```

### 4. Vérifier la configuration

Une fois ces étapes terminées, lancez le test de configuration :

```bash
npm run test-config
```

Vous devriez voir tous les ✅ verts !

## URLs importantes

- **Tableau de bord Supabase** : https://supabase.com/dashboard
- **Votre projet** : https://supabase.com/dashboard/project/yfgfjbeexskqlvtabjvt
- **Éditeur SQL** : https://supabase.com/dashboard/project/yfgfjbeexskqlvtabjvt/sql
- **Storage** : https://supabase.com/dashboard/project/yfgfjbeexskqlvtabjvt/storage