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

- 🎨 **Transformation IA** : Modifiez vos images avec des prompts textuels
- 🔐 **Authentification** : Système complet avec Supabase (email/password)
- 📸 **Upload intuitif** : Drag-and-drop avec prévisualisation
- 💾 **Stockage cloud** : Images sauvegardées dans Supabase Storage
- 🖼️ **Dashboard personnel** : Galerie de tous vos projets
- 📱 **Responsive** : Interface adaptée mobile, tablette et desktop
- ⚡ **Animations fluides** : Transitions Framer Motion
- 💳 **Paiements Stripe** : Système de paiement sécurisé intégré
- 📧 **Notifications email** : Envoi automatique d'emails (échecs de paiement, annulations)
- 🔔 **Webhooks Stripe** : Gestion des événements de paiement en temps réel

---

## 🛠 Stack technique

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.74.0-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Replicate](https://img.shields.io/badge/Replicate-Latest-FF6F61)](https://replicate.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-Latest-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Jest](https://img.shields.io/badge/Jest-Latest-C21325?logo=jest&logoColor=white)](https://jestjs.io/)

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

### Table `projects`

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Clé primaire |
| `user_id` | UUID | Référence à auth.users |
| `input_image_url` | TEXT | URL image originale |
| `output_image_url` | TEXT | URL image générée |
| `prompt` | TEXT | Prompt utilisé |
| `created_at` | TIMESTAMP | Date de création |

### Policies RLS

- Lecture : Utilisateur peut voir ses propres projets
- Création : Utilisateur peut créer ses projets
- Suppression : Utilisateur peut supprimer ses projets

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
