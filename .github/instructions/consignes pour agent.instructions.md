---
applyTo: '**'
---
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

## Règles générales
- Ne jamais créer de fichiers .md sauf si explicitement demandé

## Base de données Supabase
- Ne jamais créer de fichiers .sql
- Fournir directement le code SQL à exécuter dans l'éditeur Supabase
- Format : bloc de code SQL avec commentaire explicatif

## Structure du projet
- Next.js 15 avec App Router
- Supabase pour l'authentification et la base de données
- Stripe pour les paiements
- Replicate pour la génération d'images

## Conventions de code
- Utiliser 'use client' uniquement quand nécessaire
- Préférer les hooks personnalisés pour la logique réutilisable
- Mobile-first design (le site doit fonctionner parfaitement sur mobile et desktop)