# Architecture & Spécifications Techniques

## Vue d'ensemble

Ce projet est un éditeur d'images IA qui traite **une seule image à la fois**. Contrairement à certains modèles qui peuvent comparer ou fusionner plusieurs images, notre application se concentre sur la transformation d'une image unique selon un prompt textuel.

## Flux de données

```
1. Utilisateur upload UNE image
   ↓
2. Image stockée dans Supabase (bucket: input-images)
   ↓
3. URL publique générée
   ↓
4. Appel API Replicate avec:
   - prompt (string)
   - image_input ([url]) ← Tableau avec UNE seule URL
   - aspect_ratio: "match_input_image"
   - output_format: "jpg"
   ↓
5. Replicate traite l'image unique
   ↓
6. Image résultante téléchargée
   ↓
7. Stockage dans Supabase (bucket: output-images)
   ↓
8. Enregistrement dans la table projects
   ↓
9. Affichage à l'utilisateur
```

## Base de données

### Table: `projects`

```sql
CREATE TABLE public.projects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp without time zone DEFAULT now(),
  input_image_url text NOT NULL,      -- URL de l'image d'entrée (UNE seule)
  output_image_url text,               -- URL de l'image générée
  prompt text NOT NULL,                -- Prompt de transformation
  status text DEFAULT 'processing'::text,
  CONSTRAINT projects_pkey PRIMARY KEY (id)
);
```

### Buckets Supabase Storage

1. **input-images**: Stocke les images uploadées par l'utilisateur
   - Une seule image par requête
   - Nom de fichier: `{timestamp}-{filename}`

2. **output-images**: Stocke les images générées par l'IA
   - Nom de fichier: `generated-{timestamp}.png`

## Modèle IA: google/nano-banana

### Format d'entrée

```typescript
{
  prompt: string,              // Description de la transformation
  image_input: [string],       // Tableau contenant UNE seule URL d'image
  aspect_ratio: "match_input_image",
  output_format: "jpg"
}
```

**⚠️ Important**: Bien que le paramètre `image_input` soit un tableau, nous ne passons qu'**une seule URL**. Le modèle Replicate nécessite ce format même pour une image unique.

### Format de sortie

Le modèle retourne un `ReadableStream` qui peut être converti en URL via la méthode `.url()`.

## Différences avec d'autres projets

Si vous avez vu d'autres projets utilisant plusieurs images (par exemple pour des comparaisons de chaussures ou des fusions d'images), notez que ce projet est différent:

- ❌ Pas de comparaison entre deux images
- ❌ Pas de fusion d'images multiples
- ✅ Transformation d'UNE seule image selon un prompt
- ✅ Focus sur la qualité de la transformation unique

## Limites actuelles

1. **Une image à la fois**: L'application ne supporte pas le traitement par lot
2. **Taille maximale**: Limitée par Supabase Storage (50 MB par défaut)
3. **Temps de traitement**: ~10-15 secondes par image
4. **Formats supportés**: JPG, PNG, WEBP

## Extension future possible

Si vous souhaitez étendre le projet pour supporter plusieurs images:

1. Modifier l'interface pour accepter plusieurs uploads
2. Adapter l'API pour traiter les images en lot ou en séquence
3. Mettre à jour le schéma de base de données pour lier plusieurs images à un projet
4. Gérer les limites de l'API Replicate (rate limiting, quotas)

Pour l'instant, le focus reste sur la simplicité et la qualité: **une image, une transformation, un résultat optimal**.
