# 🎨 Guide d'utilisation - Éditeur d'Images IA

## ✅ Projet créé avec succès !

Votre éditeur d'images IA est maintenant prêt. Voici ce qui a été configuré :

### 📁 Structure du projet
```
project-images-generation/
├── src/
│   ├── app/
│   │   ├── api/generate/route.ts    # API pour générer les images
│   │   ├── page.tsx                 # Interface utilisateur
│   │   └── layout.tsx               # Layout principal
├── lib/supabase.ts                  # Configuration Supabase
├── types/project.ts                 # Types TypeScript
├── .env.local                       # Variables d'environnement
└── test-supabase.ts                 # Script de test de config
```

### 🚀 Prochaines étapes

#### 1. Configurer Supabase
Suivez les instructions dans `SUPABASE_SETUP.md` pour :
- Créer la table `projects`
- Créer les buckets `input-images` et `output-images`

#### 2. Tester la configuration
```bash
npm run test-config
```

#### 3. Démarrer le projet
```bash
npm run dev
```
Le projet sera accessible sur http://localhost:3000

### 🎯 Fonctionnalités disponibles

1. **Upload d'images** - Interface drag-and-drop moderne
2. **Prompts IA** - Décrivez la transformation souhaitée
3. **Génération** - Traitement via Replicate AI
4. **Stockage** - Images sauvegardées dans Supabase
5. **Téléchargement** - Récupération des images générées

### 🔧 Technologies utilisées

- **Frontend** : Next.js 15 + TypeScript + Tailwind CSS
- **Backend** : Next.js API Routes
- **Base de données** : Supabase PostgreSQL
- **Stockage** : Supabase Storage
- **IA** : Replicate (modèle google/nano-banana)

### 🎨 Interface utilisateur

L'interface comprend :
- **Design moderne** avec dégradés et animations
- **Layout responsive** qui s'adapte à tous les écrans
- **États de chargement** avec indicateurs visuels
- **Gestion d'erreurs** avec messages informatifs
- **Preview d'images** en temps réel

### 📝 Commandes utiles

```bash
# Démarrer en développement
npm run dev

# Construire pour la production
npm run build

# Démarrer en production
npm start

# Tester la configuration Supabase
npm run test-config

# Linter le code
npm run lint
```

### 🐛 Dépannage

Si vous rencontrez des problèmes :

1. **Variables d'environnement** - Vérifiez `.env.local`
2. **Base de données** - Consultez `SUPABASE_SETUP.md`
3. **Configuration** - Lancez `npm run test-config`

### 🌟 Prêt à utiliser !

Votre éditeur d'images IA est maintenant configuré et prêt à transformer vos images ! 🎉