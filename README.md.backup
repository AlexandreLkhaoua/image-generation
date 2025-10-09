# ⚡ AI Image Editor# Éditeur d'Images IA



> Transformez vos images avec l'intelligence artificielle en quelques secondesUn éditeur d'images moderne basé sur l'intelligence artificielle, construit avec Next.js, Supabase, et Replicate.



Un éditeur d'images moderne basé sur l'IA, construit avec Next.js 15, Supabase et Replicate. Interface intuitive, authentification sécurisée, et génération d'images en temps réel.## 🚀 Fonctionnalités



[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)](https://nextjs.org/)- **Upload d'une seule image** : Interface drag-and-drop pour charger votre image

[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)- **Transformation par IA** : Utilisez des prompts en langage naturel pour transformer votre image

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)- **Stockage cloud** : Images stockées de manière sécurisée avec Supabase

[![Supabase](https://img.shields.io/badge/Supabase-2.74.0-green)](https://supabase.com/)- **Interface moderne** : Design épuré et responsive avec Tailwind CSS

- **Téléchargement** : Sauvegardez votre création directement

---

## 🛠️ Technologies utilisées

## 📑 Table des matières

- **Frontend** : Next.js 15 + TypeScript + Tailwind CSS

- [Fonctionnalités](#-fonctionnalités)- **Backend** : Next.js API Routes

- [Stack technique](#-stack-technique)- **Base de données** : Supabase (PostgreSQL)

- [Architecture](#-architecture)- **Stockage** : Supabase Storage

- [Installation](#-installation)- **IA** : Replicate (modèle google/nano-banana)

- [Configuration](#-configuration)

- [Authentification](#-authentification)## 📋 Prérequis

- [Base de données](#-base-de-données)

- [Déploiement](#-déploiement)- Node.js 18+ 

- [Tests](#-tests)- Compte Supabase configuré

- [Historique des modifications](#-historique-des-modifications)- Compte Replicate avec accès API



---## ⚙️ Configuration



## ✨ Fonctionnalités### 1. Cloner le projet

```bash

### Pour les utilisateursgit clone <votre-repo>

- 🎨 **Génération d'images IA** : Transformez vos images via des prompts en langage naturelcd project-images-generation

- 🔐 **Authentification sécurisée** : Inscription/connexion par email et mot de passenpm install

- 📁 **Galerie personnelle** : Visualisez et gérez tous vos projets```

- ⚡ **Génération rapide** : Résultats en quelques secondes avec le modèle Google Nano-Banana

- 💾 **Téléchargement** : Exportez vos créations en haute qualité### 2. Configuration Supabase

- 🗑️ **Gestion des projets** : Supprimez vos projets et images associées

Créez un projet Supabase et configurez :

### Techniques

- 📱 **Responsive design** : S'adapte à tous les écrans**Table `projects` :**

- 🎭 **Animations fluides** : Framer Motion pour une UX premium```sql

- 🔒 **Row Level Security** : Isolation complète des données utilisateurCREATE TABLE public.projects (

- 🚀 **Performance optimale** : Build optimisé, images lazy-loaded  id uuid NOT NULL DEFAULT gen_random_uuid(),

- 📊 **Analytics intégrés** : Vercel Analytics + Speed Insights  created_at timestamp without time zone DEFAULT now(),

  input_image_url text NOT NULL,

---  output_image_url text,

  prompt text NOT NULL,

## 🛠 Stack technique  status text DEFAULT 'processing'::text,

  CONSTRAINT projects_pkey PRIMARY KEY (id)

### Frontend);

- **Framework** : Next.js 15.5.4 (App Router)```

- **UI Library** : React 19.1.0

- **Language** : TypeScript 5 (strict mode)**Buckets de stockage :**

- **Styling** : Tailwind CSS v4- `input-images` : Pour les images uploadées

- **Animations** : Framer Motion 12.23.22- `output-images` : Pour les images générées

- **Utils** : clsx, tailwind-merge

### 3. Variables d'environnement

### Backend & Database

- **API** : Next.js API RoutesCréez un fichier `.env.local` :

- **Database** : Supabase PostgreSQL```env

- **Storage** : Supabase Storage (buckets: input-images, output-images)# Supabase Configuration

- **Auth** : Supabase Auth (@supabase/ssr, @supabase/auth-helpers-nextjs)NEXT_PUBLIC_SUPABASE_URL=your_supabase_url

- **ORM** : Supabase ClientNEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

### AI & Services

- **AI Provider** : Replicate# Supabase Buckets

- **AI Model** : google/nano-banana (image transformation)SUPABASE_INPUT_BUCKET=input-images

- **Analytics** : Vercel Analytics, Vercel Speed InsightsSUPABASE_OUTPUT_BUCKET=output-images



### Dev Tools# Replicate Configuration

- **Testing** : Jest, @testing-library/reactREPLICATE_API_TOKEN=your_replicate_token

- **Linting** : ESLint (Next.js config)REPLICATE_MODEL=google/nano-banana

- **Type Checking** : TypeScript strict```

- **Package Manager** : npm

## 🚀 Lancement

---

```bash

## 🏗 Architecturenpm run dev

```

### Structure des dossiers

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

```

src/## 📱 Utilisation

├── app/                          # Next.js App Router

│   ├── api/                      # API Routes1. **Uploadez UNE image** : Cliquez sur la zone d'upload ou glissez-déposez votre image unique

│   │   ├── generate/route.ts     # Génération d'images (POST)2. **Décrivez la transformation** : Saisissez un prompt décrivant comment vous souhaitez transformer cette image

│   │   └── projects/[id]/route.ts # Suppression (DELETE)3. **Générez** : Cliquez sur "Générer l'image" et attendez le résultat (environ 10-15 secondes)

│   ├── dashboard/page.tsx        # Dashboard utilisateur (protégé)4. **Téléchargez** : Sauvegardez votre création

│   ├── login/page.tsx            # Page de connexion

│   ├── signup/page.tsx           # Page d'inscription**Note importante** : L'application traite une seule image à la fois. L'API Replicate nécessite que l'URL de l'image soit passée dans un tableau, mais elle ne traite qu'une seule image par requête.

│   ├── auth/callback/route.ts    # Callback OAuth

│   ├── layout.tsx                # Layout global avec AuthProvider## 🏗️ Structure du projet

│   ├── page.tsx                  # Landing page

│   └── globals.css               # Styles globaux```

│src/

├── components/├── app/

│   ├── auth/                     # Composants d'authentification│   ├── api/

│   │   └── auth-form.tsx         # Formulaire connexion/inscription│   │   └── generate/

│   ├── generate/                 # Composants de génération│   │       └── route.ts          # API pour la génération d'images

│   │   ├── image-upload.tsx      # Upload d'images│   ├── globals.css                # Styles globaux

│   │   ├── prompt-input.tsx      # Saisie du prompt│   ├── layout.tsx                 # Layout principal

│   │   └── result-display.tsx    # Affichage du résultat│   └── page.tsx                   # Page d'accueil

│   ├── layout/                   # Composants de layout├── lib/

│   │   ├── header.tsx            # Header avec auth│   └── supabase.ts               # Configuration Supabase

│   │   └── footer.tsx            # Footer└── types/

│   ├── sections/                 # Sections de pages    └── project.ts                # Types TypeScript

│   │   └── hero-section.tsx      # Section hero```

│   └── ui/                       # Composants UI réutilisables

│       ├── button.tsx            # Bouton personnalisé## 🔧 API Endpoints

│       ├── card.tsx              # Carte

│       └── textarea.tsx          # Zone de texte### POST `/api/generate`

│

├── contexts/Génère une image transformée à partir d'une **seule** image d'entrée et d'un prompt.

│   └── auth-context.tsx          # Context d'authentification

│**Body (FormData):**

├── hooks/- `image`: File - **Une seule image** à transformer

│   ├── use-file-upload.ts        # Logique d'upload de fichiers- `prompt`: string - Description de la transformation souhaitée

│   └── use-image-generation.ts   # Logique de génération d'images

│**Response:**

├── lib/```json

│   ├── supabase-browser.ts       # Client Supabase (browser){

│   ├── supabase-server.ts        # Client Supabase (server)  "success": boolean,

│   └── utils.ts                  # Utilitaires (cn, validateImageFile, etc.)  "projectId": string,

│  "outputImageUrl": string

└── types/}

    └── project.ts                # Types TypeScript```



middleware.ts                     # Protection des routes**Détails techniques:**

```- L'image est uploadée vers Supabase Storage (bucket `input-images`)

- L'URL publique est générée et passée à Replicate dans un tableau: `image_input: [url]`

### Flux de données- Replicate traite l'image unique avec le modèle `google/nano-banana`

- L'image résultante est téléchargée et stockée dans le bucket `output-images`

```- Un enregistrement est créé dans la table `projects` avec les deux URLs

User → Landing Page → Signup/Login

  ↓## 📄 Licence

Dashboard (protected)

  ↓MIT License - voir le fichier LICENSE pour plus de détails.

Upload Image → Select File → Preview
  ↓
Enter Prompt → "add a hat to the dog"
  ↓
Generate → API /api/generate
  ↓
  1. Verify Auth (middleware)
  2. Upload to Supabase Storage (input-images)
  3. Insert in DB with user_id
  4. Call Replicate API
  5. Download generated image
  6. Upload to Supabase Storage (output-images)
  7. Update DB with output URL
  ↓
Display Result → Download or Delete
```

---

## 🚀 Installation

### Prérequis
- Node.js 18+
- npm ou yarn
- Compte Supabase
- Compte Replicate

### Étapes

```bash
# 1. Cloner le repository
git clone https://github.com/AlexandreLkhaoua/image-generation.git
cd image-generation

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos credentials

# 4. Lancer en mode développement
npm run dev

# 5. Ouvrir http://localhost:3000
```

---

## ⚙️ Configuration

### Variables d'environnement

Créer un fichier `.env.local` à la racine :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Supabase Storage Buckets
SUPABASE_INPUT_BUCKET=input-images
SUPABASE_OUTPUT_BUCKET=output-images

# Replicate
REPLICATE_API_TOKEN=your_replicate_token
REPLICATE_MODEL=google/nano-banana
```

### Configuration Supabase

1. Créer un projet sur [Supabase](https://supabase.com)
2. Récupérer l'URL et les clés API dans Settings > API
3. Configurer la base de données (voir section suivante)

### Configuration Replicate

1. Créer un compte sur [Replicate](https://replicate.com)
2. Générer un token API dans Account Settings
3. Le modèle `google/nano-banana` est utilisé par défaut

---

## 🔐 Authentification

### Système d'authentification Supabase

L'application utilise Supabase Auth avec email/mot de passe.

#### Fonctionnalités
- ✅ Inscription avec confirmation par email
- ✅ Connexion sécurisée
- ✅ Gestion de session avec cookies
- ✅ Déconnexion
- ✅ Protection des routes avec middleware

#### Architecture Auth

```typescript
// AuthContext Provider (client-side)
useAuth() → {
  user: User | null
  session: Session | null
  loading: boolean
  signUp(email, password)
  signIn(email, password)
  signOut()
}

// Middleware (server-side)
middleware.ts → Protège /dashboard et /api/*

// Routes protégées
/dashboard      → Redirection vers /login si non auth
/api/generate   → 401 si non auth
/api/projects/* → 401 si non auth
```

#### Flux d'inscription

1. User saisit email + mot de passe sur `/signup`
2. `signUp()` crée le compte Supabase
3. Email de confirmation envoyé
4. User clique sur le lien → `/auth/callback`
5. Redirection vers `/dashboard`

#### Flux de connexion

1. User saisit credentials sur `/login`
2. `signIn()` authentifie via Supabase
3. Session créée avec cookies httpOnly
4. Redirection automatique vers `/dashboard`

---

## 🗄 Base de données

### Schéma de la table `projects`

```sql
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamp DEFAULT now(),
  input_image_url text NOT NULL,
  output_image_url text,
  prompt text NOT NULL,
  status text DEFAULT 'processing'
);

-- Index pour performance
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_status ON public.projects(status);
```

### Row Level Security (RLS)

Les policies RLS assurent l'isolation des données :

```sql
-- Activer RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Policy: Read own projects
CREATE POLICY "Users can read own projects"
ON public.projects FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Create own projects
CREATE POLICY "Users can create own projects"
ON public.projects FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Delete own projects
CREATE POLICY "Users can delete own projects"
ON public.projects FOR DELETE
USING (auth.uid() = user_id);

-- Policy: Update own projects
CREATE POLICY "Users can update own projects"
ON public.projects FOR UPDATE
USING (auth.uid() = user_id);
```

### Storage Buckets

Deux buckets Supabase Storage :

1. **input-images** : Images uploadées par les users
2. **output-images** : Images générées par l'IA

```sql
-- Policies pour input-images
CREATE POLICY "Users can upload to input-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'input-images');

-- Policies pour output-images
CREATE POLICY "Users can read from output-images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'output-images');
```

---

## 🚢 Déploiement

### Déploiement sur Vercel

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Se connecter
vercel login

# 3. Déployer
vercel

# 4. Configurer les variables d'environnement sur Vercel
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add SUPABASE_INPUT_BUCKET
vercel env add SUPABASE_OUTPUT_BUCKET
vercel env add REPLICATE_API_TOKEN
vercel env add REPLICATE_MODEL
```

### Configuration Supabase pour production

Dans Supabase Dashboard :
1. **Authentication** > URL Configuration
   - Site URL : `https://your-domain.vercel.app`
   - Redirect URLs : `https://your-domain.vercel.app/auth/callback`

2. **Storage** > Buckets
   - Créer `input-images` et `output-images` si pas déjà fait
   - Configurer les policies RLS

### Build et optimisation

```bash
# Build production locale
npm run build

# Analyse du bundle
npm run build -- --analyze

# Lancer en production
npm start
```

---

## 🧪 Tests

### Configuration Jest

Tests configurés avec Jest + Testing Library :

```bash
# Lancer tous les tests
npm test

# Mode watch
npm run test:watch

# Coverage
npm run test:coverage

# Tests globaux (incluant tests d'intégration)
npm run test:global
```

### Tests implémentés

1. **Tests unitaires** (Jest)
   - Composants UI
   - Hooks personnalisés
   - Utilitaires

2. **Tests d'intégration** (test-global.ts)
   - Vérification des variables d'environnement
   - Connexion Supabase
   - API Replicate
   - Workflow complet de génération

### Exemple de résultats

```
✓ Environment variables (4/4 passed)
✓ Supabase connection
✓ Replicate API
✓ Full workflow: upload → generate → download
```

---

## 📊 Historique des modifications

> **Note :** Historique complet disponible dans [CHANGELOG.md](./CHANGELOG.md)

### Version 3.0.0 - Palette Éclair ⚡ (09/10/2025)
**Changements visuels majeurs**
- Remplacement de la palette violet/bleu par jaune/orange énergique
- Nouveaux gradients : `from-yellow-500 to-orange-600`
- Backgrounds ambrés : `from-amber-50 via-white to-orange-50`
- Focus rings et spinners jaunes
- Thème évoquant la rapidité et l'énergie d'un éclair

**Fichiers impactés :**
- Tous les composants UI (button, textarea, card)
- Toutes les pages (landing, dashboard, auth)
- Header et footer

---

### Version 2.0.0 - Authentification complète 🔐 (09/10/2025)
**Système d'authentification Supabase**
- AuthContext avec hook `useAuth()` et `onAuthStateChange()`
- Composant AuthForm avec onglets connexion/inscription
- Pages `/login`, `/signup`, `/dashboard` (protégée)
- Middleware de protection des routes
- Row Level Security (RLS) sur tous les projets
- Header affichant l'email et bouton déconnexion

**APIs sécurisées :**
- `/api/generate` : vérification auth + ajout user_id
- `/api/projects/[id]` : DELETE avec vérification ownership

**Base de données :**
- Ajout colonne `user_id` dans table `projects`
- 4 policies RLS (SELECT, INSERT, UPDATE, DELETE)
- Policies Storage pour les buckets

**Packages ajoutés :**
- `@supabase/auth-helpers-nextjs`
- `@supabase/ssr`
- `zod`

---

### Version 1.5.0 - Architecture professionnelle 🏗 (08/10/2025)
**Refactoring complet de l'architecture**
- Organisation en dossiers : ui/, sections/, layout/, generate/
- Séparation des responsabilités (components, hooks, lib)
- Custom hooks : `use-file-upload.ts`, `use-image-generation.ts`
- Utilitaires centralisés dans `lib/utils.ts`
- Types TypeScript dans dossier dédié

**Améliorations UX :**
- Animations Framer Motion
- Design moderne avec Tailwind CSS v4
- Composants réutilisables (Button, Card, Textarea)
- Header/Footer consistants

---

### Version 1.0.0 - MVP initial 🎉 (07/10/2025)
**Fonctionnalités core**
- Upload et transformation d'images via Replicate
- Stockage Supabase (PostgreSQL + Storage)
- Interface drag-and-drop
- Téléchargement des résultats
- Page unique avec workflow complet

**Stack initial :**
- Next.js 15 + React 19 + TypeScript
- Supabase (DB + Storage)
- Replicate (google/nano-banana)
- Tailwind CSS

---

## 📝 Conventions de développement

### Commits
- Format : `type(scope): message`
- Types : `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Exemple : `feat(auth): add login page`

### Code Style
- TypeScript strict mode
- ESLint + Prettier
- Composants fonctionnels avec hooks
- Interfaces pour les props

### Branches
- `main` : production
- `dev` : développement
- `feature/*` : nouvelles fonctionnalités
- `fix/*` : corrections de bugs

---

## 🤝 Contribution

Les contributions sont les bienvenues ! 

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'feat: add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT.

---

## 🔗 Liens utiles

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Replicate](https://replicate.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 👨‍💻 Auteur

**Alexandre Lkhaoua**
- GitHub: [@AlexandreLkhaoua](https://github.com/AlexandreLkhaoua)

---

⚡ Propulsé par l'IA • Next.js 15 • React 19 • Supabase • Replicate
