# ⚡ AI Image Editor

Application web moderne de transformation d'images par IA, utilisant des prompts textuels pour modifier vos photos. Développée avec Next.js 15, React 19, Supabase et l'API Replicate.


## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+ et npm
- Compte Supabase (gratuit)
- Clé API Replicate (gratuit)

### Installation

```bash
# Cloner le repository
git clone https://github.com/AlexandreLkhaoua/image-generation.git
cd image-generation

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Compléter .env.local avec vos credentials

# Lancer en développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## ✨ Fonctionnalités

### 🎨 Produit principal - Génération d'images IA
- **Transformation par prompt** : Modifiez vos images avec des descriptions textuelles
- **Upload intuitif** : Interface drag-and-drop avec prévisualisation en temps réel
- **Résultats instantanés** : Génération d'images via Replicate API
- **Téléchargement facile** : Récupération des images générées en haute qualité
- **Animations fluides** : Interface avec Framer Motion et Lottie
- **Support multi-formats** : PNG, JPG, WEBP

### 🔐 Authentification & Gestion utilisateur
- **Inscription/Connexion** : Système complet avec Supabase Auth
- **Email/Password** : Authentification traditionnelle sécurisée
- **Sessions persistantes** : Cookies httpOnly pour la sécurité
- **Protection des routes** : Middleware Next.js pour les pages protégées
- **Profil utilisateur** : Dashboard personnel avec historique

### 💳 Système de paiement (Stripe)
- **Packs de crédits** : 4 options (Starter, Standard, Pro, Premium)
  - **Starter** : 5 crédits - 10€
  - **Standard** : 10 crédits - 15€ ⭐ (Populaire)
  - **Pro** : 25 crédits - 30€
  - **Premium** : 50 crédits - 50€
- **Checkout sécurisé** : Intégration Stripe Checkout
- **Codes promo** : Système de réduction avec API dédiée
- **Webhooks** : Gestion automatique des paiements réussis/échoués
- **Facturation** : Page dédiée avec historique des achats
- **Notifications email** : Confirmation d'achat, échecs de paiement

### 💾 Base de données (Supabase PostgreSQL)
- **Table `users`** : Gestion des utilisateurs (via Supabase Auth)
- **Table `projects`** : 
  - Stockage des projets (image input + output)
  - Prompts utilisés
  - Timestamps et métadonnées
- **Table `credits`** :
  - Suivi des crédits par utilisateur
  - Crédits restants et total
  - Historique des transactions
- **Row Level Security (RLS)** :
  - Isolation des données par utilisateur
  - Policies de lecture/écriture/suppression
  - Protection contre les accès non autorisés
- **Supabase Storage** :
  - Bucket `project-images` pour les uploads
  - Bucket `generated-images` pour les résultats
  - URLs publiques avec signatures

### 📱 Design & Expérience utilisateur
- **Mobile-first** : Interface optimisée pour tous les écrans
- **Responsive** : Adaptation automatique mobile, tablette, desktop
- **Thème cohérent** : Palette jaune/orange (éclair ⚡)
- **Composants UI** : Bibliothèque Shadcn/ui avec Radix
- **Accessibilité** : Composants ARIA-compliant
- **Loading states** : Skeletons et indicateurs de progression

### 🔔 Notifications & Communication
- **Toasts** : Notifications en temps réel avec Sonner
- **Emails transactionnels** : Confirmation d'achat, échecs
- **Feedback utilisateur** : Messages de succès/erreur clairs

---

## 🛠 Stack technique

### Frontend
[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

- **Next.js 15** - App Router, Server Components, API Routes
- **React 19** - Composants modernes avec hooks
- **TypeScript** - Typage strict pour la robustesse du code
- **Tailwind CSS v4** - Design system responsive et personnalisé
- **Framer Motion** - Animations fluides et transitions
- **Radix UI** - Composants accessibles (Dialog, Dropdown, Tabs, etc.)
- **Shadcn/ui** - Bibliothèque de composants UI réutilisables
- **Lucide React** - Icônes modernes et cohérentes
- **Sonner** - Notifications toast élégantes

### Backend & Base de données
[![Supabase](https://img.shields.io/badge/Supabase-2.74.0-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)

- **Supabase** - Backend as a Service
  - **PostgreSQL** - Base de données relationnelle
  - **Row Level Security (RLS)** - Sécurité au niveau des lignes
  - **Storage** - Stockage des images (input/output)
  - **Auth** - Authentification email/password
  - **Realtime** - Mises à jour en temps réel (si nécessaire)

### Paiements
[![Stripe](https://img.shields.io/badge/Stripe-19.1.0-635BFF?logo=stripe&logoColor=white)](https://stripe.com/)

- **Stripe** - Plateforme de paiement complète
  - Checkout Sessions pour l'achat de crédits
  - Webhooks pour les événements de paiement
  - Gestion des codes promo
  - Support de plusieurs devises

### IA & Génération d'images
[![Replicate](https://img.shields.io/badge/Replicate-Latest-FF6F61)](https://replicate.com/)

- **Replicate API** - Modèles IA pour la transformation d'images
  - Génération basée sur des prompts textuels
  - Support de multiples modèles IA
  - Traitement asynchrone des images

### Tests & Qualité
[![Jest](https://img.shields.io/badge/Jest-Latest-C21325?logo=jest&logoColor=white)](https://jestjs.io/)

- **Jest** - Framework de tests unitaires
- **Testing Library** - Tests de composants React
- **ESLint** - Linting du code
- **TypeScript** - Vérification de types

### Monitoring & Analytics
- **Vercel Analytics** - Analyse du trafic
- **Vercel Speed Insights** - Performance monitoring

---

## 📁 Structure du projet

```
project-images-generation/
├── src/
│   ├── app/                    # Routes Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── auth/              # Pages auth (callback)
│   │   ├── dashboard/         # Dashboard protégé
│   │   ├── login/             # Page connexion
│   │   └── signup/            # Page inscription
│   ├── components/            # Composants React
│   │   ├── auth/             # Composants authentification
│   │   ├── generate/         # Composants génération IA
│   │   ├── layout/           # Header, Footer
│   │   ├── sections/         # Sections de pages
│   │   └── ui/               # Composants UI réutilisables
│   ├── contexts/             # React Contexts (Auth)
│   ├── hooks/                # Custom hooks
│   └── lib/                  # Utilitaires et clients API
├── types/                    # Types TypeScript
├── __tests__/               # Tests unitaires et intégration
└── middleware.ts            # Protection des routes
```

---

## 🔐 Sécurité

- ✅ Row Level Security (RLS) activé sur toutes les tables Supabase
- ✅ Middleware de protection des routes (`/dashboard`, `/api/*`)
- ✅ Validation des inputs utilisateur avec Zod
- ✅ Service role key uniquement côté serveur
- ✅ Cookies httpOnly pour les sessions

---

## 🧪 Tests

```bash
# Tests unitaires avec Jest
npm test
npm run test:watch
npm run test:coverage

# Test global d'intégration
npm run test:global
```

### Tests unitaires (Jest)
- ✅ Composants UI (Button)
- ✅ Custom hooks (useFileUpload)

### Tests d'intégration (test-global.ts)
- ✅ Variables d'environnement
- ✅ Connexion Supabase (database + storage)
- ✅ API Replicate avec génération d'image
- ✅ Workflow complet (Upload → Generate → Download)

---

## 📊 Base de données

### Architecture Supabase

#### Table `users` (Supabase Auth)
Gérée automatiquement par Supabase Auth.

#### Table `projects`

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Clé primaire (auto-générée) |
| `user_id` | UUID | Référence à `auth.users` |
| `input_image_url` | TEXT | URL de l'image originale dans Supabase Storage |
| `output_image_url` | TEXT | URL de l'image générée (nullable) |
| `prompt` | TEXT | Prompt textuel utilisé pour la génération |
| `status` | TEXT | Statut : `pending`, `processing`, `completed`, `failed` |
| `created_at` | TIMESTAMP | Date de création (auto) |
| `updated_at` | TIMESTAMP | Dernière modification (auto) |

#### Table `credits`

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Clé primaire |
| `user_id` | UUID | Référence à `auth.users` (UNIQUE) |
| `credits_remaining` | INTEGER | Crédits disponibles |
| `credits_total` | INTEGER | Total de crédits achetés (cumulatif) |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Dernière mise à jour |

#### Table `transactions` (optionnelle)

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Clé primaire |
| `user_id` | UUID | Référence à `auth.users` |
| `stripe_payment_id` | TEXT | ID du paiement Stripe |
| `amount` | INTEGER | Montant en centimes |
| `credits_purchased` | INTEGER | Nombre de crédits achetés |
| `status` | TEXT | `succeeded`, `failed`, `refunded` |
| `created_at` | TIMESTAMP | Date de la transaction |

### Row Level Security (RLS) Policies

**Table `projects`** :
```sql
-- Lecture : L'utilisateur ne peut voir que ses propres projets
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

-- Création : L'utilisateur peut créer ses projets
CREATE POLICY "Users can create own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Suppression : L'utilisateur peut supprimer ses projets
CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);
```

**Table `credits`** :
```sql
-- Lecture : L'utilisateur ne peut voir que ses propres crédits
CREATE POLICY "Users can view own credits"
  ON credits FOR SELECT
  USING (auth.uid() = user_id);

-- Mise à jour : Seuls les admins ou l'API peuvent mettre à jour
-- (via Service Role Key côté serveur)
```

### Supabase Storage

**Buckets** :
- `project-images` : Images uploadées par les utilisateurs
- `generated-images` : Images générées par l'IA

**Policies Storage** :
- Upload : Utilisateurs authentifiés uniquement
- Lecture : URLs publiques avec signatures temporaires

---

## 🎨 Design

### Palette de couleurs

```css
Primary:    yellow-500 (#EAB308) → orange-600 (#EA580C)
Background: amber-50 (#FFFBEB) → orange-50 (#FFF7ED)
Success:    green-500
Error:      red-600
```

Thème inspiré par l'éclair ⚡ pour évoquer rapidité et énergie.

---

## 🚀 Déploiement

### Vercel (recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Variables d'environnement à configurer :
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - REPLICATE_API_TOKEN
```

---

## 📚 Documentation complète

- [CHANGELOG.md](./CHANGELOG.md) - Historique des versions
- [DEV-NOTES.md](./DEV-NOTES.md) - Notes de développement et roadmap
- [EMAIL_SETUP.md](./EMAIL_SETUP.md) - Configuration des emails et webhooks

---

**Version actuelle :** 3.0.0 (Palette Éclair ⚡)

Pour toute question, ouvrez une [issue](https://github.com/AlexandreLkhaoua/image-generation/issues) ou une [discussion](https://github.com/AlexandreLkhaoua/image-generation/discussions).
