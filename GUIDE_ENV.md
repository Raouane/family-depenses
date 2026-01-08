# 🔧 Guide : Créer le fichier .env

## ⚠️ Erreur

```
Variables d'environnement Supabase manquantes. 
Veuillez définir VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans votre fichier .env
```

## ✅ Solution rapide

### 1. Créer le fichier .env

À la **racine du projet** (même niveau que `package.json`), créez un fichier nommé `.env`

### 2. Obtenir vos clés Supabase

1. Allez sur **https://supabase.com**
2. Sélectionnez votre projet
3. **Settings** → **API**
4. Copiez :
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

### 3. Contenu du fichier .env

```env
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anon-supabase
```

**Remplacez** les valeurs par les vôtres.

### 4. Redémarrer le serveur

**IMPORTANT** : Après avoir créé/modifié `.env`, redémarrez :

```bash
# Arrêter (Ctrl+C)
# Puis relancer
npm run dev
```

## 📍 Emplacement

Le fichier `.env` doit être ici :
```
family-depenses/
  ├── .env          ← ICI (à créer)
  ├── package.json
  ├── src/
  └── ...
```

## ✅ Vérification

Après redémarrage, l'erreur devrait disparaître.
