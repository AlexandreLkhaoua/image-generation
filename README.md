# Éditeur d'Images IA

Un éditeur d'images moderne basé sur l'intelligence artificielle, construit avec Next.js, Supabase, et Replicate.

## 🚀 Fonctionnalités

- **Upload d'une seule image** : Interface drag-and-drop pour charger votre image
- **Transformation par IA** : Utilisez des prompts en langage naturel pour transformer votre image
- **Stockage cloud** : Images stockées de manière sécurisée avec Supabase
- **Interface moderne** : Design épuré et responsive avec Tailwind CSS
- **Téléchargement** : Sauvegardez votre création directement

## 🛠️ Technologies utilisées

- **Frontend** : Next.js 15 + TypeScript + Tailwind CSS
- **Backend** : Next.js API Routes
- **Base de données** : Supabase (PostgreSQL)
- **Stockage** : Supabase Storage
- **IA** : Replicate (modèle google/nano-banana)

## 📋 Prérequis

- Node.js 18+ 
- Compte Supabase configuré
- Compte Replicate avec accès API

## ⚙️ Configuration

### 1. Cloner le projet
```bash
git clone <votre-repo>
cd project-images-generation
npm install
```

### 2. Configuration Supabase

Créez un projet Supabase et configurez :

**Table `projects` :**
```sql
CREATE TABLE public.projects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp without time zone DEFAULT now(),
  input_image_url text NOT NULL,
  output_image_url text,
  prompt text NOT NULL,
  status text DEFAULT 'processing'::text,
  CONSTRAINT projects_pkey PRIMARY KEY (id)
);
```

**Buckets de stockage :**
- `input-images` : Pour les images uploadées
- `output-images` : Pour les images générées

### 3. Variables d'environnement

Créez un fichier `.env.local` :
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Supabase Buckets
SUPABASE_INPUT_BUCKET=input-images
SUPABASE_OUTPUT_BUCKET=output-images

# Replicate Configuration
REPLICATE_API_TOKEN=your_replicate_token
REPLICATE_MODEL=google/nano-banana
```

## 🚀 Lancement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📱 Utilisation

1. **Uploadez UNE image** : Cliquez sur la zone d'upload ou glissez-déposez votre image unique
2. **Décrivez la transformation** : Saisissez un prompt décrivant comment vous souhaitez transformer cette image
3. **Générez** : Cliquez sur "Générer l'image" et attendez le résultat (environ 10-15 secondes)
4. **Téléchargez** : Sauvegardez votre création

**Note importante** : L'application traite une seule image à la fois. L'API Replicate nécessite que l'URL de l'image soit passée dans un tableau, mais elle ne traite qu'une seule image par requête.

## 🏗️ Structure du projet

```
src/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # API pour la génération d'images
│   ├── globals.css                # Styles globaux
│   ├── layout.tsx                 # Layout principal
│   └── page.tsx                   # Page d'accueil
├── lib/
│   └── supabase.ts               # Configuration Supabase
└── types/
    └── project.ts                # Types TypeScript
```

## 🔧 API Endpoints

### POST `/api/generate`

Génère une image transformée à partir d'une **seule** image d'entrée et d'un prompt.

**Body (FormData):**
- `image`: File - **Une seule image** à transformer
- `prompt`: string - Description de la transformation souhaitée

**Response:**
```json
{
  "success": boolean,
  "projectId": string,
  "outputImageUrl": string
}
```

**Détails techniques:**
- L'image est uploadée vers Supabase Storage (bucket `input-images`)
- L'URL publique est générée et passée à Replicate dans un tableau: `image_input: [url]`
- Replicate traite l'image unique avec le modèle `google/nano-banana`
- L'image résultante est téléchargée et stockée dans le bucket `output-images`
- Un enregistrement est créé dans la table `projects` avec les deux URLs

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails.
