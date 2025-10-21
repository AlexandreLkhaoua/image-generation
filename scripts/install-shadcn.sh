#!/bin/bash

# 🎨 Script d'installation des composants shadcn/ui
# Ce script installe les composants shadcn/ui recommandés pour votre projet

echo "📦 Installation des composants shadcn/ui..."
echo ""

# Composants de base pour l'UI
echo "1️⃣ Installation des composants de base..."
npx shadcn@latest add dialog
npx shadcn@latest add toast
npx shadcn@latest add alert
npx shadcn@latest add badge
npx shadcn@latest add separator
npx shadcn@latest add skeleton
npx shadcn@latest add tabs
npx shadcn@latest add input
npx shadcn@latest add label

# Composants pour la génération d'images
echo ""
echo "2️⃣ Installation des composants pour la génération d'images..."
npx shadcn@latest add progress
npx shadcn@latest add tooltip
npx shadcn@latest add avatar

# Composants pour le système de paiement
echo ""
echo "3️⃣ Installation des composants pour le billing..."
npx shadcn@latest add dropdown-menu
npx shadcn@latest add sheet

# Composants optionnels mais utiles
echo ""
echo "4️⃣ Installation des composants optionnels..."
npx shadcn@latest add popover
npx shadcn@latest add command
npx shadcn@latest add scroll-area

echo ""
echo "✅ Installation terminée !"
echo ""
echo "📚 Prochaines étapes :"
echo "   1. Lire ARCHITECTURE.md pour la réorganisation"
echo "   2. Utiliser CreditPackCard dans votre page de billing"
echo "   3. Ajouter le système de Toast pour les notifications"
echo ""
