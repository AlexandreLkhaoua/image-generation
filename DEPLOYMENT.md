# Déploiement sur Vercel

## Variables d'environnement à configurer sur Vercel

Allez dans **Settings > Environment Variables** de votre projet Vercel et ajoutez :

### Supabase
```
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
```

### Buckets Supabase
```
SUPABASE_INPUT_BUCKET=input-images
SUPABASE_OUTPUT_BUCKET=output-images
```

### Replicate
```
REPLICATE_API_TOKEN=votre_token_replicate
REPLICATE_MODEL=nom_du_modele
```

### Node Environment
```
NODE_ENV=production
```

## Déploiement simplifié - Aucune configuration d'URL requise ! 🎉

**L'application est 100% portable** : elle fonctionne automatiquement sur n'importe quel domaine sans configuration.

### Actions requises :

1. **Déployez sur Vercel** avec les variables d'environnement ci-dessus
2. **C'est tout !** ✨

### Pas besoin de configurer dans Supabase :

- ❌ Pas de Redirect URLs à configurer
- ❌ Pas de Site URL à mettre à jour
- ✅ L'authentification utilise le flow PKCE qui fonctionne sur n'importe quel domaine
- ✅ Changez d'URL quand vous voulez (domain personnalisé, preview deployments...)
- ✅ Fonctionne en local, staging et production sans modification

## Vérification des cookies

Les modifications apportées garantissent que :
- Les cookies sont correctement configurés avec `sameSite: 'lax'`
- HTTPS est activé en production avec `secure: true`
- Le flow PKCE est utilisé pour plus de sécurité
- Les credentials sont envoyés avec les requêtes fetch

## Test de déploiement

Après le déploiement :
1. Testez la connexion/déconnexion
2. Testez la génération d'images
3. Testez la suppression de projets
4. Vérifiez que les cookies persistent après refresh

## Problèmes courants

### Erreur "Non authentifié" en production
- Vérifiez que les cookies sont acceptés par le navigateur
- Assurez-vous que le site est en HTTPS (obligatoire pour les cookies sécurisés)
- Vérifiez que toutes les variables d'environnement sont bien configurées dans Vercel

### Session perdue après refresh
- Vérifiez que le domaine est en HTTPS
- Vérifiez les paramètres de cookies du navigateur (bloquer les cookies tiers peut causer des problèmes)
- Videz le cache et les cookies du navigateur et réessayez
