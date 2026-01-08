# 🔧 Créer le fichier .env

## ⚠️ Erreur actuelle

Vous avez l'erreur :
```
Variables d'environnement Supabase manquantes. 
Veuillez définir VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans votre fichier .env
```

## ✅ Solution : Créer le fichier .env

### Étape 1 : Créer le fichier

À la **racine du projet** (à côté de `package.json`), créez un fichier nommé `.env`

### Étape 2 : Obtenir les clés Supabase

1. Allez sur **https://supabase.com**
2. Connectez-vous et sélectionnez votre projet
3. Allez dans **Settings** (Paramètres) → **API**
4. Copiez :
   - **Project URL** → C'est votre `VITE_SUPABASE_URL`
   - **anon public** key → C'est votre `VITE_SUPABASE_ANON_KEY`

### Étape 3 : Remplir le fichier .env

Ouvrez le fichier `.env` et ajoutez :

```env
# URL de l'API backend
VITE_API_URL=http://localhost:3000/api

# Configuration Supabase
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anon-supabase
```

**Remplacez** :
- `https://votre-projet.supabase.co` par votre vraie URL Supabase
- `votre-clé-anon-supabase` par votre vraie clé anon

### Exemple

```env
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzI5MCwiZXhwIjoxOTU0NTQzMjkwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Étape 4 : Redémarrer le serveur

**Important** : Après avoir créé/modifié le fichier `.env`, vous devez **redémarrer le serveur de développement** :

1. Arrêtez le serveur (Ctrl+C dans le terminal)
2. Relancez : `npm run dev`

## 📝 Note

Le fichier `.env` est dans `.gitignore`, donc il ne sera pas commité dans Git. C'est normal et sécurisé.

## 🔍 Vérification

Après avoir créé le fichier et redémarré le serveur, l'erreur devrait disparaître.
