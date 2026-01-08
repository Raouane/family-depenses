# ⚙️ Configuration du fichier .env

## ✅ Fichier .env créé

Le fichier `.env` a été créé avec les variables nécessaires.

## 🔑 Étapes pour obtenir vos clés Supabase

### 1. Accéder à Supabase

1. Allez sur **https://supabase.com**
2. Connectez-vous
3. Sélectionnez votre projet

### 2. Obtenir les clés

1. Dans le menu de gauche, cliquez sur **Settings** (Paramètres)
2. Cliquez sur **API** dans le menu Settings
3. Vous verrez deux sections importantes :

#### Project URL
- C'est votre `VITE_SUPABASE_URL`
- Format : `https://xxxxxxxxxxxxx.supabase.co`
- **Copiez cette URL**

#### API Keys
- **anon public** → C'est votre `VITE_SUPABASE_ANON_KEY`
- C'est une longue chaîne qui commence par `eyJ...`
- **Copiez cette clé**

### 3. Mettre à jour le fichier .env

Ouvrez le fichier `.env` à la racine du projet et remplacez :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anon-supabase
```

Par vos vraies valeurs, par exemple :

```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzI5MCwiZXhwIjoxOTU0NTQzMjkwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. Redémarrer le serveur

**IMPORTANT** : Après avoir modifié le fichier `.env`, vous **DEVEZ** redémarrer le serveur :

1. Arrêtez le serveur actuel (Ctrl+C dans le terminal)
2. Relancez : `npm run dev`

## ✅ Vérification

Après avoir :
1. ✅ Rempli le fichier `.env` avec vos vraies clés
2. ✅ Redémarré le serveur (`npm run dev`)

L'erreur devrait disparaître et l'application devrait fonctionner.

## 🔒 Sécurité

Le fichier `.env` est dans `.gitignore`, donc il ne sera **pas** commité dans Git. C'est normal et sécurisé.
