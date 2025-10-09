# ⚡ AI Image Editor# ⚡ AI Image Editor# Éditeur d'Images IA



Éditeur d'images IA moderne avec Next.js 15, Supabase et Replicate.



[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-yellow?style=flat&logo=next.js)](https://nextjs.org/)> Transformez vos images avec l'intelligence artificielle en quelques secondesUn éditeur d'images moderne basé sur l'intelligence artificielle, construit avec Next.js, Supabase, et Replicate.

[![React](https://img.shields.io/badge/React-19.1.0-orange?style=flat&logo=react)](https://reactjs.org/)

[![TypeScript](https://img.shields.io/badge/TypeScript-5-yellow?style=flat&logo=typescript)](https://www.typescriptlang.org/)

[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20Storage-orange?style=flat&logo=supabase)](https://supabase.com/)

[![Replicate](https://img.shields.io/badge/Replicate-AI-yellow?style=flat)](https://replicate.com/)Un éditeur d'images moderne basé sur l'IA, construit avec Next.js 15, Supabase et Replicate. Interface intuitive, authentification sécurisée, et génération d'images en temps réel.## 🚀 Fonctionnalités

[![License](https://img.shields.io/badge/License-MIT-orange?style=flat)](LICENSE)



## ✨ Fonctionnalités

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)](https://nextjs.org/)- **Upload d'une seule image** : Interface drag-and-drop pour charger votre image

- 🎨 **Édition d'images avec IA** : Utilise Replicate (google/nano-banana) pour transformer vos images

- 🔐 **Authentification complète** : Système d'auth email/mot de passe avec Supabase[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)- **Transformation par IA** : Utilisez des prompts en langage naturel pour transformer votre image

- 📸 **Galerie personnelle** : Dashboard avec vos projets et historique

- 🎯 **Interface moderne** : Design épuré avec palette jaune/orange "éclair"[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)- **Stockage cloud** : Images stockées de manière sécurisée avec Supabase

- ⚡ **Temps réel** : Updates instantanés avec Supabase Realtime

- 🔒 **Sécurité** : Row Level Security (RLS) et middleware de protection[![Supabase](https://img.shields.io/badge/Supabase-2.74.0-green)](https://supabase.com/)- **Interface moderne** : Design épuré et responsive avec Tailwind CSS

- 📱 **Responsive** : S'adapte à tous les écrans (max-width: 1600px)

- 🎭 **Animations** : Transitions fluides avec Framer Motion- **Téléchargement** : Sauvegardez votre création directement



## 🛠️ Stack Technique---



### Frontend## 🛠️ Technologies utilisées

- **Framework** : Next.js 15.5.4 (App Router, React 19.1.0)

- **Language** : TypeScript 5 (mode strict)## 📑 Table des matières

- **Styling** : Tailwind CSS v4 (palette jaune/orange)

- **Animations** : Framer Motion 12.23.22- **Frontend** : Next.js 15 + TypeScript + Tailwind CSS

- **Icons** : Lucide React

- **Analytics** : Vercel Analytics + Speed Insights- [Fonctionnalités](#-fonctionnalités)- **Backend** : Next.js API Routes



### Backend & Services- [Stack technique](#-stack-technique)- **Base de données** : Supabase (PostgreSQL)

- **Database** : Supabase PostgreSQL

- **Storage** : Supabase Storage (buckets: input-images, output-images)- [Architecture](#-architecture)- **Stockage** : Supabase Storage

- **Auth** : Supabase Auth (@supabase/ssr, @supabase/auth-helpers-nextjs)

- **IA** : Replicate (modèle google/nano-banana)- [Installation](#-installation)- **IA** : Replicate (modèle google/nano-banana)

- **Validation** : Zod

- [Configuration](#-configuration)

### Infrastructure

- **Hosting** : Vercel (recommandé)- [Authentification](#-authentification)## 📋 Prérequis

- **BDD** : Supabase Cloud

- **Storage** : Supabase Storage (buckets publics)- [Base de données](#-base-de-données)



## 📐 Architecture- [Déploiement](#-déploiement)- Node.js 18+ 



```- [Tests](#-tests)- Compte Supabase configuré

project-images-generation/

├── src/- [Historique des modifications](#-historique-des-modifications)- Compte Replicate avec accès API

│   ├── app/                      # Next.js App Router

│   │   ├── page.tsx             # Page d'accueil

│   │   ├── layout.tsx           # Layout principal

│   │   ├── login/               # Page de connexion---## ⚙️ Configuration

│   │   ├── signup/              # Page d'inscription

│   │   ├── dashboard/           # Dashboard utilisateur (protégé)

│   │   ├── auth/callback/       # Callback OAuth

│   │   └── api/## ✨ Fonctionnalités### 1. Cloner le projet

│   │       ├── generate/        # API de génération d'images

│   │       └── projects/[id]/   # API CRUD projets```bash

│   ├── components/

│   │   ├── auth/### Pour les utilisateursgit clone <votre-repo>

│   │   │   └── auth-form.tsx    # Formulaire login/signup

│   │   ├── layout/- 🎨 **Génération d'images IA** : Transformez vos images via des prompts en langage naturelcd project-images-generation

│   │   │   └── header.tsx       # Header avec auth state

│   │   └── ui/                  # Composants UI réutilisables- 🔐 **Authentification sécurisée** : Inscription/connexion par email et mot de passenpm install

│   ├── contexts/

│   │   └── auth-context.tsx     # Context global d'authentification- 📁 **Galerie personnelle** : Visualisez et gérez tous vos projets```

│   └── lib/

│       ├── supabase-browser.ts  # Client Supabase (browser)- ⚡ **Génération rapide** : Résultats en quelques secondes avec le modèle Google Nano-Banana

│       └── supabase-server.ts   # Client Supabase (server)

├── lib/- 💾 **Téléchargement** : Exportez vos créations en haute qualité### 2. Configuration Supabase

│   └── supabase.ts              # Client Supabase legacy

├── types/- 🗑️ **Gestion des projets** : Supprimez vos projets et images associées

│   └── project.ts               # Types TypeScript

├── middleware.ts                # Protection des routesCréez un projet Supabase et configurez :

├── public/                      # Assets statiques

└── docs/                        # Documentation (voir DOCS.md)### Techniques

```

- 📱 **Responsive design** : S'adapte à tous les écrans**Table `projects` :**

## 🚀 Installation

- 🎭 **Animations fluides** : Framer Motion pour une UX premium```sql

### 1. Cloner le projet

- 🔒 **Row Level Security** : Isolation complète des données utilisateurCREATE TABLE public.projects (

```bash

git clone https://github.com/alexandrelkhaoua/project-images-generation.git- 🚀 **Performance optimale** : Build optimisé, images lazy-loaded  id uuid NOT NULL DEFAULT gen_random_uuid(),

cd project-images-generation

```- 📊 **Analytics intégrés** : Vercel Analytics + Speed Insights  created_at timestamp without time zone DEFAULT now(),



### 2. Installer les dépendances  input_image_url text NOT NULL,



```bash---  output_image_url text,

npm install

```  prompt text NOT NULL,



### 3. Configuration (voir section suivante)## 🛠 Stack technique  status text DEFAULT 'processing'::text,



Créer un fichier `.env.local` avec vos clés API.  CONSTRAINT projects_pkey PRIMARY KEY (id)



### 4. Lancer le projet### Frontend);



```bash- **Framework** : Next.js 15.5.4 (App Router)```

npm run dev

```- **UI Library** : React 19.1.0



Ouvrir [http://localhost:3000](http://localhost:3000)- **Language** : TypeScript 5 (strict mode)**Buckets de stockage :**



## ⚙️ Configuration- **Styling** : Tailwind CSS v4- `input-images` : Pour les images uploadées



### Variables d'environnement- **Animations** : Framer Motion 12.23.22- `output-images` : Pour les images générées



Créer un fichier `.env.local` à la racine du projet :- **Utils** : clsx, tailwind-merge



```env### 3. Variables d'environnement

# Supabase (7 variables requises)

NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co### Backend & Database

NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key

SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key- **API** : Next.js API RoutesCréez un fichier `.env.local` :



# Supabase Storage- **Database** : Supabase PostgreSQL```env

SUPABASE_INPUT_BUCKET=input-images

SUPABASE_OUTPUT_BUCKET=output-images- **Storage** : Supabase Storage (buckets: input-images, output-images)# Supabase Configuration



# Replicate- **Auth** : Supabase Auth (@supabase/ssr, @supabase/auth-helpers-nextjs)NEXT_PUBLIC_SUPABASE_URL=your_supabase_url

REPLICATE_API_TOKEN=r8_votre_token

REPLICATE_MODEL=google/nano-banana- **ORM** : Supabase ClientNEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

```

SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

📝 **Template disponible** : Voir `.env.example` pour un exemple complet.

### AI & Services

### Obtenir les clés API

- **AI Provider** : Replicate# Supabase Buckets

#### Supabase (Database + Auth + Storage)

- **AI Model** : google/nano-banana (image transformation)SUPABASE_INPUT_BUCKET=input-images

1. Créer un compte sur [supabase.com](https://supabase.com/)

2. Créer un nouveau projet- **Analytics** : Vercel Analytics, Vercel Speed InsightsSUPABASE_OUTPUT_BUCKET=output-images

3. Aller dans **Settings** > **API**

4. Copier :

   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`

   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`### Dev Tools# Replicate Configuration

   - `service_role` (⚠️ secret) → `SUPABASE_SERVICE_ROLE_KEY`

- **Testing** : Jest, @testing-library/reactREPLICATE_API_TOKEN=your_replicate_token

#### Replicate (IA)

- **Linting** : ESLint (Next.js config)REPLICATE_MODEL=google/nano-banana

1. Créer un compte sur [replicate.com](https://replicate.com/)

2. Aller dans **Account** > **API Tokens**- **Type Checking** : TypeScript strict```

3. Créer un token → `REPLICATE_API_TOKEN`

- **Package Manager** : npm

## 🔐 Authentification

## 🚀 Lancement

### Système d'authentification

---

Le projet utilise **Supabase Auth** avec :

- ✅ Inscription / Connexion par email/mot de passe```bash

- ✅ Gestion de session SSR-compatible

- ✅ Context React global (`useAuth()` hook)## 🏗 Architecturenpm run dev

- ✅ Protection des routes avec middleware

- ✅ Redirection automatique si non authentifié```



### Utilisation### Structure des dossiers



```tsxOuvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

import { useAuth } from '@/contexts/auth-context';

```

function MyComponent() {

  const { user, signIn, signOut, loading } = useAuth();src/## 📱 Utilisation

  

  if (loading) return <div>Chargement...</div>;├── app/                          # Next.js App Router

  

  if (!user) {│   ├── api/                      # API Routes1. **Uploadez UNE image** : Cliquez sur la zone d'upload ou glissez-déposez votre image unique

    return <button onClick={() => signIn(email, password)}>

      Se connecter│   │   ├── generate/route.ts     # Génération d'images (POST)2. **Décrivez la transformation** : Saisissez un prompt décrivant comment vous souhaitez transformer cette image

    </button>;

  }│   │   └── projects/[id]/route.ts # Suppression (DELETE)3. **Générez** : Cliquez sur "Générer l'image" et attendez le résultat (environ 10-15 secondes)

  

  return <div>Bienvenue {user.email}</div>;│   ├── dashboard/page.tsx        # Dashboard utilisateur (protégé)4. **Téléchargez** : Sauvegardez votre création

}

```│   ├── login/page.tsx            # Page de connexion



### Routes protégées│   ├── signup/page.tsx           # Page d'inscription**Note importante** : L'application traite une seule image à la fois. L'API Replicate nécessite que l'URL de l'image soit passée dans un tableau, mais elle ne traite qu'une seule image par requête.



Le fichier `middleware.ts` protège automatiquement :│   ├── auth/callback/route.ts    # Callback OAuth

- `/dashboard/*` : Nécessite authentification

- `/api/generate/*` : Nécessite authentification│   ├── layout.tsx                # Layout global avec AuthProvider## 🏗️ Structure du projet

- `/api/projects/*` : Nécessite authentification

│   ├── page.tsx                  # Landing page

### Configuration Supabase Auth

│   └── globals.css               # Styles globaux```

Dans le dashboard Supabase :

│src/

**Authentication > URL Configuration** :

```├── components/├── app/

Site URL: http://localhost:3000

Redirect URLs: │   ├── auth/                     # Composants d'authentification│   ├── api/

  - http://localhost:3000/auth/callback

  - https://votre-domaine.vercel.app/auth/callback│   │   └── auth-form.tsx         # Formulaire connexion/inscription│   │   └── generate/

```

│   ├── generate/                 # Composants de génération│   │       └── route.ts          # API pour la génération d'images

**Authentication > Providers** :

- ✅ Email (activé)│   │   ├── image-upload.tsx      # Upload d'images│   ├── globals.css                # Styles globaux

- Optionnel : Google, GitHub, etc.

│   │   ├── prompt-input.tsx      # Saisie du prompt│   ├── layout.tsx                 # Layout principal

## 🗄️ Base de données

│   │   └── result-display.tsx    # Affichage du résultat│   └── page.tsx                   # Page d'accueil

### Schema

│   ├── layout/                   # Composants de layout├── lib/

```sql

-- Table principale│   │   ├── header.tsx            # Header avec auth│   └── supabase.ts               # Configuration Supabase

CREATE TABLE public.projects (

  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),│   │   └── footer.tsx            # Footer└── types/

  user_id uuid REFERENCES auth.users(id) NOT NULL,

  created_at timestamp DEFAULT now(),│   ├── sections/                 # Sections de pages    └── project.ts                # Types TypeScript

  input_image_url text NOT NULL,

  output_image_url text,│   │   └── hero-section.tsx      # Section hero```

  prompt text NOT NULL,

  status text DEFAULT 'processing'│   └── ui/                       # Composants UI réutilisables

);

│       ├── button.tsx            # Bouton personnalisé## 🔧 API Endpoints

-- Index pour performance

CREATE INDEX idx_projects_user_id ON public.projects(user_id);│       ├── card.tsx              # Carte

```

│       └── textarea.tsx          # Zone de texte### POST `/api/generate`

### Row Level Security (RLS)

│

4 politiques actives :

├── contexts/Génère une image transformée à partir d'une **seule** image d'entrée et d'un prompt.

```sql

-- SELECT : Voir uniquement ses projets│   └── auth-context.tsx          # Context d'authentification

CREATE POLICY "Users can read own projects"

ON public.projects FOR SELECT│**Body (FormData):**

USING (auth.uid() = user_id);

├── hooks/- `image`: File - **Une seule image** à transformer

-- INSERT : Créer ses projets

CREATE POLICY "Users can create own projects"│   ├── use-file-upload.ts        # Logique d'upload de fichiers- `prompt`: string - Description de la transformation souhaitée

ON public.projects FOR INSERT

WITH CHECK (auth.uid() = user_id);│   └── use-image-generation.ts   # Logique de génération d'images



-- DELETE : Supprimer ses projets│**Response:**

CREATE POLICY "Users can delete own projects"

ON public.projects FOR DELETE├── lib/```json

USING (auth.uid() = user_id);

│   ├── supabase-browser.ts       # Client Supabase (browser){

-- UPDATE : Modifier ses projets

CREATE POLICY "Users can update own projects"│   ├── supabase-server.ts        # Client Supabase (server)  "success": boolean,

ON public.projects FOR UPDATE

USING (auth.uid() = user_id);│   └── utils.ts                  # Utilitaires (cn, validateImageFile, etc.)  "projectId": string,

```

│  "outputImageUrl": string

### Storage Buckets

└── types/}

Créer 2 buckets **publics** dans Supabase Storage :

    └── project.ts                # Types TypeScript```

1. **input-images** : Images uploadées par les utilisateurs

2. **output-images** : Images générées par l'IA



**Configuration** :middleware.ts                     # Protection des routes**Détails techniques:**

- Public : ✅ (pour accès direct aux URLs)

- File size limit : 50MB (recommandé)```- L'image est uploadée vers Supabase Storage (bucket `input-images`)

- Allowed MIME types : `image/*`

- L'URL publique est générée et passée à Replicate dans un tableau: `image_input: [url]`

## 🎨 Design System

### Flux de données- Replicate traite l'image unique avec le modèle `google/nano-banana`

### Palette de couleurs (v3.0.0)

- L'image résultante est téléchargée et stockée dans le bucket `output-images`

Thème **"éclair"** jaune/orange :

```- Un enregistrement est créé dans la table `projects` avec les deux URLs

```css

/* Couleurs principales */User → Landing Page → Signup/Login

--primary: yellow-500 → orange-600 (gradient)

--primary-hover: yellow-600 → orange-700  ↓## 📄 Licence

--background: amber-50 → white → orange-50

Dashboard (protected)

/* Utilisation */

.button {  ↓MIT License - voir le fichier LICENSE pour plus de détails.

  @apply bg-gradient-to-r from-yellow-500 to-orange-600;

  @apply hover:from-yellow-600 hover:to-orange-700;Upload Image → Select File → Preview

}  ↓

Enter Prompt → "add a hat to the dog"

.focus-ring {  ↓

  @apply focus:ring-2 focus:ring-yellow-500;Generate → API /api/generate

}  ↓

```  1. Verify Auth (middleware)

  2. Upload to Supabase Storage (input-images)

### Composants UI  3. Insert in DB with user_id

  4. Call Replicate API

Tous les composants sont dans `src/components/ui/` :  5. Download generated image

- `button.tsx` : Boutons avec gradients jaune/orange  6. Upload to Supabase Storage (output-images)

- `textarea.tsx` : Textarea avec focus ring jaune  7. Update DB with output URL

- Plus à venir...  ↓

Display Result → Download or Delete

## 📦 Déploiement```



### Vercel (recommandé)---



1. **Connecter le repo GitHub** :## 🚀 Installation

   ```bash

   vercel --prod### Prérequis

   ```- Node.js 18+

- npm ou yarn

2. **Configurer les variables d'environnement** :- Compte Supabase

   - Dashboard Vercel > Project > Settings > Environment Variables- Compte Replicate

   - Copier toutes les variables de `.env.local`

### Étapes

3. **Configurer Supabase** :

   - Ajouter l'URL de production dans les Redirect URLs```bash

   - `https://votre-app.vercel.app/auth/callback`# 1. Cloner le repository

git clone https://github.com/AlexandreLkhaoua/image-generation.git

4. **Déployer** :cd image-generation

   ```bash

   git push origin main# 2. Installer les dépendances

   ```npm install



### Autres plateformes# 3. Configurer les variables d'environnement

cp .env.example .env.local

Le projet est compatible avec tout hébergeur supportant Next.js 15 :# Éditer .env.local avec vos credentials

- Netlify

- Railway# 4. Lancer en mode développement

- Rendernpm run dev

- AWS Amplify

# 5. Ouvrir http://localhost:3000

## 🧪 Tests```



### Lancer le build---



```bash## ⚙️ Configuration

npm run build

```### Variables d'environnement



Résultat attendu :Créer un fichier `.env.local` à la racine :

```

✓ Compiled successfully in ~1342ms```env

✓ Collecting page data# Supabase

✓ Generating static pages (10/10)NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co

✓ Finalizing page optimizationNEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

Route (app)                              Size     First Load JS

┌ ○ /                                    7.89 kB         110 kB# Supabase Storage Buckets

├ ○ /_not-found                          0 B                0 BSUPABASE_INPUT_BUCKET=input-images

├ ○ /api/generate                        0 B                0 BSUPABASE_OUTPUT_BUCKET=output-images

└ ○ /auth/callback                       0 B                0 B

```# Replicate

REPLICATE_API_TOKEN=your_replicate_token

### Vérifier les erreursREPLICATE_MODEL=google/nano-banana

```

```bash

npm run lint### Configuration Supabase

```

1. Créer un projet sur [Supabase](https://supabase.com)

## 📚 Documentation2. Récupérer l'URL et les clés API dans Settings > API

3. Configurer la base de données (voir section suivante)

- **README.md** : Ce fichier (vue d'ensemble et guide)

- **CHANGELOG.md** : Historique des versions### Configuration Replicate

- **CONTRIBUTING.md** : Guide de contribution et standards

- **DEV-NOTES.md** : Notes de développement et backlog1. Créer un compte sur [Replicate](https://replicate.com)

- **DOCS.md** : Meta-documentation (organisation des docs)2. Générer un token API dans Account Settings

- **.env.example** : Template des variables d'environnement3. Le modèle `google/nano-banana` est utilisé par défaut



Pour plus de détails, voir [DOCS.md](DOCS.md).---



## 📝 Historique du projet## 🔐 Authentification



Le projet a évolué en 4 versions majeures :### Système d'authentification Supabase



### v1.0.0 (Initial)L'application utilise Supabase Auth avec email/mot de passe.

- Setup Next.js 15 + TypeScript

- Intégration Replicate (nano-banana)#### Fonctionnalités

- Upload et génération d'images- ✅ Inscription avec confirmation par email

- ✅ Connexion sécurisée

### v1.5.0 (UI Improvements)- ✅ Gestion de session avec cookies

- Header moderne avec stats- ✅ Déconnexion

- Design responsive (max-w-[1600px])- ✅ Protection des routes avec middleware

- Animations Framer Motion

#### Architecture Auth

### v2.0.0 (Authentication)

- Système d'auth Supabase complet```typescript

- Dashboard utilisateur protégé// AuthContext Provider (client-side)

- Row Level Security (RLS)useAuth() → {

- Middleware de protection  user: User | null

  session: Session | null

### v3.0.0 (Design Overhaul)  loading: boolean

- Nouvelle palette jaune/orange "éclair"  signUp(email, password)

- 14 composants redesignés  signIn(email, password)

- Design system cohérent  signOut()

}

Voir [CHANGELOG.md](CHANGELOG.md) pour les détails complets.

// Middleware (server-side)

## 🤝 Contributionmiddleware.ts → Protège /dashboard et /api/*



Les contributions sont bienvenues ! Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour :// Routes protégées

- Standards de code/dashboard      → Redirection vers /login si non auth

- Workflow Git (branches, commits)/api/generate   → 401 si non auth

- Guide de soumission des PRs/api/projects/* → 401 si non auth

- Checklist de test```



## 📄 Licence#### Flux d'inscription



MIT License - voir [LICENSE](LICENSE)1. User saisit email + mot de passe sur `/signup`

2. `signUp()` crée le compte Supabase

## 👤 Auteur3. Email de confirmation envoyé

4. User clique sur le lien → `/auth/callback`

**Alexandre Lkhaoua**5. Redirection vers `/dashboard`

- GitHub : [@alexandrelkhaoua](https://github.com/alexandrelkhaoua)

- Projet : [project-images-generation](https://github.com/alexandrelkhaoua/project-images-generation)#### Flux de connexion



## 🙏 Remerciements1. User saisit credentials sur `/login`

2. `signIn()` authentifie via Supabase

- [Next.js](https://nextjs.org/) - Framework React3. Session créée avec cookies httpOnly

- [Supabase](https://supabase.com/) - Backend-as-a-Service4. Redirection automatique vers `/dashboard`

- [Replicate](https://replicate.com/) - API IA

- [Tailwind CSS](https://tailwindcss.com/) - Styling---

- [Framer Motion](https://www.framer.com/motion/) - Animations

## 🗄 Base de données

---

### Schéma de la table `projects`

⚡ **Fait avec passion et beaucoup de caféine** ☕

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
