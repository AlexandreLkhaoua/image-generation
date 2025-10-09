# 📝 Notes de développement

Ce fichier sert de journal de développement rapide. Pour l'historique complet, voir CHANGELOG.md.

---

## 🎯 Prochaines fonctionnalités à implémenter

### Priorité Haute
- [ ] Réinitialisation de mot de passe
- [ ] Pagination de la galerie (limite actuelle : tous les projets)
- [ ] Upload multiple d'images
- [ ] Preview en temps réel du prompt

### Priorité Moyenne
- [ ] OAuth (Google, GitHub)
- [ ] Profil utilisateur avec avatar
- [ ] Historique des prompts utilisés
- [ ] Favoris et collections

### Priorité Basse
- [ ] Partage de projets (public/privé)
- [ ] Commentaires sur les projets
- [ ] API rate limiting
- [ ] Mode sombre

---

## 🐛 Bugs connus

Aucun bug critique actuellement.

---

## 🔧 Améliorations techniques planifiées

- [ ] Optimisation du bundle size
- [ ] Mise en cache des images générées
- [ ] Compression des images avant upload
- [ ] Skeleton loaders pour meilleure UX
- [ ] Error boundaries React
- [ ] Logging centralisé (Sentry ?)

---

## 📊 Métriques à suivre

- Temps moyen de génération d'image
- Taux de succès de l'API Replicate
- Taux de conversion (visiteurs → inscriptions)
- Nombre de projets générés par utilisateur

---

## 💡 Idées en vrac

- Templates de prompts populaires
- Galerie publique des meilleures créations
- Export en différents formats (PNG, JPG, WebP)
- Intégration avec d'autres modèles IA
- API publique pour développeurs tiers

---

## 🎨 Design System

### Palette de couleurs actuelle (v3.0.0)
```
Primary: yellow-500 (#EAB308) → orange-600 (#EA580C)
Background: amber-50 (#FFFBEB) → orange-50 (#FFF7ED)
Success: green-500
Error: red-600
Warning: yellow-400
Info: blue-500
```

### Typography
- Headings: font-bold
- Body: font-normal
- Code: font-mono

### Spacing
- Container: max-w-[1600px]
- Padding: px-6 py-8
- Gap: gap-4 / gap-6

---

## 🔐 Sécurité

### Checklist de sécurité
- [x] RLS activé sur toutes les tables
- [x] Service role key uniquement côté serveur
- [x] Validation des inputs utilisateur
- [x] Protection CSRF (cookies httpOnly)
- [x] Rate limiting sur les APIs sensibles (à améliorer)
- [ ] Audit de sécurité complet
- [ ] Scan des dépendances (npm audit)

---

## 📦 Dépendances à surveiller

### Mises à jour importantes à prévoir
- Next.js : surveiller v16 (stable)
- React : surveiller v20
- Supabase : suivre les breaking changes
- Tailwind CSS : v4 est en beta, surveiller la stable

---

## 🚀 Optimisations de performance

### Déjà implémenté
- [x] Build optimisé avec Next.js
- [x] Images lazy-loaded
- [x] Vercel Analytics
- [x] Code splitting automatique

### À implémenter
- [ ] Image optimization avec next/image partout
- [ ] Prefetching des routes
- [ ] Service Worker pour PWA
- [ ] Compression Gzip/Brotli

---

## 📱 Support multi-plateforme

### Actuellement supporté
- [x] Desktop (tous navigateurs modernes)
- [x] Mobile responsive
- [x] Tablette responsive

### À explorer
- [ ] Progressive Web App (PWA)
- [ ] Application mobile native (React Native ?)
- [ ] Extension de navigateur

---

## 🧪 Tests à ajouter

### Tests unitaires manquants
- [ ] Tests pour tous les hooks
- [ ] Tests pour les utilitaires
- [ ] Tests des composants UI avec toutes les variants

### Tests d'intégration manquants
- [ ] Test du workflow d'authentification complet
- [ ] Test du workflow de génération avec erreurs
- [ ] Test de la suppression de projets

### Tests E2E à créer
- [ ] Configuration Playwright ou Cypress
- [ ] Tests des parcours utilisateur principaux

---

## 📖 Documentation à compléter

### Guides utilisateur
- [ ] Guide de démarrage rapide
- [ ] FAQ
- [ ] Exemples de prompts efficaces
- [ ] Troubleshooting commun

### Documentation technique
- [ ] Architecture détaillée avec diagrammes
- [ ] API documentation (Swagger ?)
- [ ] Guide de contribution détaillé
- [ ] Guide de déploiement

---

## 🎓 Ressources utiles

### Documentation officielle
- [Next.js App Router](https://nextjs.org/docs/app)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Replicate API](https://replicate.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Articles et tutoriels
- [Next.js + Supabase Auth](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

---

**Dernière mise à jour :** 09/10/2025
