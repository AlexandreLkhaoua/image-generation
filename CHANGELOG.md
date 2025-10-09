# Changelog

Toutes les modifications notables du projet sont documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

---

## [3.0.0] - 2025-10-09

### 🎨 Changed - Palette Éclair
- Remplacement complet de la palette de couleurs violet/bleu → jaune/orange
- Nouveaux gradients énergiques : `from-yellow-500 to-orange-600`
- Backgrounds ambrés : `from-amber-50 to-orange-50`
- Focus rings jaunes sur tous les inputs
- Thème visuel évoquant la rapidité et l'énergie d'un éclair ⚡

### 📚 Changed - Documentation
- Création d'un README.md unique et organisé
- Consolidation de tous les fichiers .md en sections structurées
- Suppression des fichiers obsolètes (8 fichiers .md)
- Ajout d'un .env.example
- Création du CHANGELOG.md

---

## [2.0.0] - 2025-10-09

### 🔐 Added - Authentification complète
- Système d'authentification Supabase avec email/mot de passe
- AuthContext avec hook `useAuth()` et écoute `onAuthStateChange()`
- Composant AuthForm avec onglets connexion/inscription
- Pages `/login`, `/signup`, `/dashboard` protégée
- Middleware de protection des routes (`/dashboard`, `/api/*`)
- Header dynamique affichant l'email utilisateur et bouton déconnexion
- Landing page avec CTA vers inscription

### 🗄 Changed - Base de données
- Ajout colonne `user_id` dans table `projects`
- Implémentation Row Level Security (RLS) avec 4 policies
- Index sur `user_id` pour optimisation des requêtes
- Policies Storage pour buckets `input-images` et `output-images`

### 🔒 Added - APIs sécurisées
- `/api/generate` : vérification authentification + ajout `user_id`
- `/api/projects/[id]` : DELETE avec vérification ownership
- Suppression automatique des fichiers des buckets lors du DELETE

### 📦 Added - Packages
- `@supabase/auth-helpers-nextjs@latest`
- `@supabase/ssr@latest`
- `zod@latest`

---

## [1.5.0] - 2025-10-08

### 🏗 Changed - Architecture professionnelle
- Refactoring complet avec séparation des responsabilités
- Organisation en dossiers : `ui/`, `sections/`, `layout/`, `generate/`
- Création de custom hooks : `use-file-upload.ts`, `use-image-generation.ts`
- Centralisation des utilitaires dans `lib/utils.ts`
- Types TypeScript dans dossier dédié `types/`

### ✨ Added - Améliorations UX
- Intégration Framer Motion pour animations fluides
- Design moderne avec composants réutilisables
- Header et Footer consistants sur toutes les pages
- Composants UI : Button, Card, Textarea avec variants

### 📊 Added - Analytics
- Vercel Analytics
- Vercel Speed Insights

---

## [1.0.0] - 2025-10-07

### 🎉 Added - MVP initial
- Upload d'images avec drag-and-drop
- Transformation d'images via prompts IA (Replicate)
- Stockage Supabase (PostgreSQL + Storage)
- Interface unique avec workflow complet
- Téléchargement des images générées
- Table `projects` avec colonnes de base

### 🛠 Added - Stack technique
- Next.js 15.5.4 avec App Router
- React 19.1.0
- TypeScript 5 en mode strict
- Tailwind CSS v4
- Supabase 2.74.0 (Database + Storage)
- Replicate avec modèle `google/nano-banana`

### 🧪 Added - Tests
- Configuration Jest + Testing Library
- Tests globaux d'intégration
- Tests des variables d'environnement
- Tests de connexion Supabase et Replicate

---

## Format des versions

Le projet suit le Semantic Versioning :
- **MAJOR** (X.0.0) : Changements incompatibles avec les versions précédentes
- **MINOR** (0.X.0) : Ajout de fonctionnalités rétrocompatibles
- **PATCH** (0.0.X) : Corrections de bugs rétrocompatibles

### Types de changements
- `Added` : Nouvelles fonctionnalités
- `Changed` : Modifications de fonctionnalités existantes
- `Deprecated` : Fonctionnalités bientôt supprimées
- `Removed` : Fonctionnalités supprimées
- `Fixed` : Corrections de bugs
- `Security` : Corrections de vulnérabilités
