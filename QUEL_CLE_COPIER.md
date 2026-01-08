# 🔑 Quelle clé copier depuis Supabase ?

## ✅ Pour le FRONTEND (fichier .env à la racine)

Dans la section **API KEYS** de Supabase, cliquez sur :

**"Copy anonymous API key"** 
- Marqué : **PUBLIC** et **LEGACY**
- C'est celle-ci qu'il faut pour `VITE_SUPABASE_ANON_KEY`

## 🔒 Pour le BACKEND (fichier backend/.env)

**"Copy service API key"**
- Marqué : **SECRET** et **LEGACY**
- C'est celle-ci qu'il faut pour `SUPABASE_SERVICE_ROLE_KEY`
- ⚠️ Déjà configurée dans votre .env

## 📋 Résumé

| Clé à copier | Variable .env | Usage |
|--------------|---------------|-------|
| **Copy anonymous API key** (PUBLIC) | `VITE_SUPABASE_ANON_KEY` | Frontend |
| **Copy service API key** (SECRET) | `SUPABASE_SERVICE_ROLE_KEY` | Backend |

## 🎯 Action immédiate

1. Cliquez sur **"Copy anonymous API key"** dans Supabase
2. Ouvrez le fichier `.env` à la racine du projet
3. Remplacez `VITE_SUPABASE_ANON_KEY=OBTENEZ_LA_CLE_ANON_PUBLIC_DEPUIS_SUPABASE`
4. Collez la clé que vous venez de copier
5. Redémarrez le serveur : `npm run dev`

## ✅ Après cela

L'erreur devrait disparaître ! 🎉
