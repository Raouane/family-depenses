# 🔑 Obtenir la clé "anon public" pour le frontend

## ⚠️ Important

Vous avez fourni la clé `SUPABASE_SERVICE_ROLE_KEY`, mais pour le **frontend**, vous avez besoin de la clé **"anon public"** (différente).

## 📋 Étapes pour obtenir la clé "anon public"

### 1. Accéder à Supabase

1. Allez sur **https://supabase.com**
2. Connectez-vous
3. Sélectionnez votre projet

### 2. Obtenir la clé "anon public"

1. Dans le menu de gauche, cliquez sur **Settings** (Paramètres)
2. Cliquez sur **API** dans le menu Settings
3. Dans la section **API Keys**, vous verrez plusieurs clés :

   - **anon public** ← **C'EST CELLE-CI QU'IL VOUS FAUT**
   - service_role (secret) ← Celle-ci est pour le backend (déjà configurée)

4. **Copiez la clé "anon public"**
   - C'est une longue chaîne qui commence généralement par `eyJ...`
   - Format : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ...` (très longue)

### 3. Mettre à jour le fichier .env

Ouvrez le fichier `.env` à la racine du projet et remplacez :

```env
VITE_SUPABASE_ANON_KEY=OBTENEZ_LA_CLE_ANON_PUBLIC_DEPUIS_SUPABASE
```

Par votre vraie clé "anon public", par exemple :

```env
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxZGZpb3B0Y3B0aW5ueHFzaHJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4NzY1MDAsImV4cCI6MjA1MTQ1MjUwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. Redémarrer le serveur

**IMPORTANT** : Après avoir modifié le fichier `.env`, redémarrez le serveur :

1. Arrêtez le serveur (Ctrl+C)
2. Relancez : `npm run dev`

## 🔍 Différence entre les clés

- **anon public** → Pour le frontend (sécurisée pour être exposée au client)
- **service_role** → Pour le backend uniquement (NE JAMAIS exposer au client)

## ✅ Vérification

Après avoir :
1. ✅ Rempli `VITE_SUPABASE_ANON_KEY` avec votre clé "anon public"
2. ✅ Redémarré le serveur

L'erreur devrait disparaître.
