# 🤝 Guide de contribution

Merci de votre intérêt pour contribuer à AI Image Editor ! Ce document vous guidera à travers le processus de contribution.

---

## 📋 Table des matières

- [Code de conduite](#code-de-conduite)
- [Comment contribuer](#comment-contribuer)
- [Configuration de développement](#configuration-de-développement)
- [Standards de code](#standards-de-code)
- [Workflow Git](#workflow-git)
- [Tests](#tests)
- [Documentation](#documentation)

---

## Code de conduite

En participant à ce projet, vous acceptez de respecter notre code de conduite :
- Soyez respectueux et inclusif
- Acceptez les critiques constructives
- Concentrez-vous sur ce qui est meilleur pour la communauté
- Montrez de l'empathie envers les autres membres

---

## Comment contribuer

### Types de contributions acceptées

- 🐛 **Bug fixes** : Corrections de bugs
- ✨ **Features** : Nouvelles fonctionnalités
- 📝 **Documentation** : Améliorations de la doc
- 🎨 **Design** : Améliorations UI/UX
- 🧪 **Tests** : Ajout ou amélioration des tests
- ♻️ **Refactoring** : Amélioration du code existant

### Avant de commencer

1. **Cherchez d'abord** : Vérifiez si une issue existe déjà
2. **Créez une issue** : Décrivez ce que vous voulez faire
3. **Attendez validation** : Attendez qu'un mainteneur valide votre idée
4. **Fork & Branch** : Créez votre branche de travail
5. **Codez** : Implémentez votre solution
6. **Testez** : Assurez-vous que tout fonctionne
7. **Pull Request** : Soumettez votre contribution

---

## Configuration de développement

### Installation

```bash
# 1. Fork le repo sur GitHub

# 2. Clone votre fork
git clone https://github.com/VOTRE-USERNAME/image-generation.git
cd image-generation

# 3. Ajouter le repo original comme upstream
git remote add upstream https://github.com/AlexandreLkhaoua/image-generation.git

# 4. Installer les dépendances
npm install

# 5. Copier .env.example vers .env.local
cp .env.example .env.local

# 6. Configurer vos credentials dans .env.local

# 7. Lancer le serveur de dev
npm run dev
```

### Structure du projet

Consultez la section Architecture du README.md pour comprendre l'organisation du code.

---

## Standards de code

### TypeScript

- Utiliser TypeScript strict mode
- Typer toutes les fonctions et variables
- Éviter `any`, préférer `unknown` si nécessaire
- Créer des interfaces pour les props de composants

```typescript
// ✅ Bon
interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
  variant?: 'default' | 'outline'
}

// ❌ Mauvais
function Button(props: any) { ... }
```

### React

- Utiliser des composants fonctionnels avec hooks
- Nommer les composants en PascalCase
- Nommer les hooks en camelCase avec préfixe `use`
- Extraire la logique complexe dans des custom hooks

```typescript
// ✅ Bon
export function ImageUpload({ onUpload }: ImageUploadProps) {
  const { file, handleDrop } = useFileUpload()
  return <div onDrop={handleDrop}>...</div>
}

// ❌ Mauvais
export default function imageUpload(props) { ... }
```

### Styling

- Utiliser Tailwind CSS uniquement
- Pas de CSS inline sauf pour les styles dynamiques
- Utiliser la fonction `cn()` pour combiner les classes

```typescript
// ✅ Bon
<button className={cn(
  'px-4 py-2 rounded-lg',
  isActive && 'bg-yellow-500',
  className
)}>

// ❌ Mauvais
<button style={{ padding: '8px 16px' }}>
```

### Nommage des fichiers

- Composants : `kebab-case.tsx` (ex: `auth-form.tsx`)
- Hooks : `use-kebab-case.ts` (ex: `use-file-upload.ts`)
- Utils : `kebab-case.ts` (ex: `utils.ts`)
- Types : `kebab-case.ts` (ex: `project.ts`)

---

## Workflow Git

### Branches

```bash
# Créer une nouvelle branche depuis main
git checkout main
git pull upstream main
git checkout -b type/description

# Types de branches
feature/nom-feature    # Nouvelle fonctionnalité
fix/nom-bug           # Correction de bug
docs/description      # Documentation
refactor/description  # Refactoring
test/description      # Tests
style/description     # Changements visuels
```

### Commits

Format : `type(scope): message`

**Types :**
- `feat` : Nouvelle fonctionnalité
- `fix` : Correction de bug
- `docs` : Documentation
- `style` : Formatage, pas de changement de code
- `refactor` : Refactoring du code
- `test` : Ajout ou modification de tests
- `chore` : Tâches de maintenance

**Exemples :**
```bash
feat(auth): add password reset functionality
fix(upload): resolve file size validation issue
docs(readme): update installation instructions
style(button): adjust hover colors
refactor(hooks): simplify useImageGeneration logic
test(api): add tests for generate endpoint
```

### Pull Request

1. **Titre clair** : Décrivez votre changement en une ligne
2. **Description détaillée** :
   - Quel problème résolvez-vous ?
   - Comment l'avez-vous résolu ?
   - Y a-t-il des points d'attention ?
3. **Screenshots** : Si changement visuel
4. **Checklist** :
   - [ ] Tests passent (`npm test`)
   - [ ] Build réussit (`npm run build`)
   - [ ] Code linté (`npm run lint`)
   - [ ] Documentation mise à jour
   - [ ] CHANGELOG.md mis à jour

**Template de PR :**

```markdown
## Description
Brève description du changement

## Type de changement
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Motivation
Pourquoi ce changement est-il nécessaire ?

## Solution
Comment avez-vous résolu le problème ?

## Tests
Comment avez-vous testé vos changements ?

## Screenshots
(Si applicable)

## Checklist
- [ ] Tests passent
- [ ] Build réussit
- [ ] Documentation mise à jour
- [ ] CHANGELOG mis à jour
```

---

## Tests

### Lancer les tests

```bash
# Tous les tests
npm test

# Mode watch
npm run test:watch

# Avec coverage
npm run test:coverage

# Tests globaux
npm run test:global
```

### Écrire des tests

Chaque nouvelle fonctionnalité doit avoir des tests :

```typescript
// component.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    screen.getByText('Click').click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

---

## Documentation

### Mettre à jour le README

Si votre changement affecte l'utilisation du projet :
1. Mettez à jour la section appropriée du README.md
2. Gardez le format et le style existants
3. Utilisez des emoji avec parcimonie (comme dans le reste du doc)

### Mettre à jour le CHANGELOG

Pour chaque PR, ajoutez une entrée dans CHANGELOG.md :

```markdown
## [Unreleased]

### Added
- Nouvelle fonctionnalité X dans le dashboard (#123)

### Fixed
- Correction du bug Y dans l'upload (#124)

### Changed
- Amélioration de Z dans l'API (#125)
```

### Commenter le code

- Commentez le **pourquoi**, pas le **quoi**
- Utilisez des commentaires JSDoc pour les fonctions complexes
- Expliquez les décisions techniques non-évidentes

```typescript
/**
 * Uploads an image to Supabase Storage and returns the public URL.
 * Handles retries in case of network errors.
 * 
 * @param file - The image file to upload
 * @param bucket - The storage bucket name
 * @returns The public URL of the uploaded image
 * @throws {Error} If upload fails after 3 retries
 */
async function uploadImage(file: File, bucket: string): Promise<string> {
  // ... implementation
}
```

---

## Questions ?

- 💬 Ouvrez une [Discussion](https://github.com/AlexandreLkhaoua/image-generation/discussions)
- 🐛 Signalez un [Bug](https://github.com/AlexandreLkhaoua/image-generation/issues/new?template=bug_report.md)
- 💡 Proposez une [Feature](https://github.com/AlexandreLkhaoua/image-generation/issues/new?template=feature_request.md)

---

Merci de contribuer à AI Image Editor ! 🙏
