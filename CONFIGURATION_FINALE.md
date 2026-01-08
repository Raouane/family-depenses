# ✅ Configuration finale - Projet Supabase unifié

## 🎯 Objectif

Utiliser **un seul projet Supabase** (`lqdfioptcptinnxqshrj`) pour :
- ✅ Base de données (PostgreSQL)
- ✅ Authentification (Supabase Auth)
- ✅ Frontend et Backend

## 📋 Variables d'environnement requises

### Frontend (fichier `.env` à la racine)

```env
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=https://lqdfioptcptinnxqshrj.supabase.co
VITE_SUPABASE_ANON_KEY=[VOTRE_CLÉ_ANON]
```

### Backend (fichier `backend/.env`)

```env
DATABASE_URL=postgresql://postgres.lqdfioptcptinnxqshrj:[MOT-DE-PASSE]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=https://lqdfioptcptinnxqshrj.supabase.co
SUPABASE_SERVICE_ROLE_KEY=[VOTRE_CLÉ_SERVICE_ROLE]
```

### Render (Web Service → Environment)

```env
# Frontend
VITE_API_URL=https://family-depenses.onrender.com/api
VITE_SUPABASE_URL=https://lqdfioptcptinnxqshrj.supabase.co
VITE_SUPABASE_ANON_KEY=[VOTRE_CLÉ_ANON]

# Backend
DATABASE_URL=postgresql://postgres.lqdfioptcptinnxqshrj:[MOT-DE-PASSE]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://family-depenses.onrender.com
SUPABASE_URL=https://lqdfioptcptinnxqshrj.supabase.co
SUPABASE_SERVICE_ROLE_KEY=[VOTRE_CLÉ_SERVICE_ROLE]
```

## 🔑 Où obtenir les clés

1. **Supabase Dashboard** → Projet `lqdfioptcptinnxqshrj`
2. **Settings** → **API** :
   - Project URL → `VITE_SUPABASE_URL` / `SUPABASE_URL`
   - anon public → `VITE_SUPABASE_ANON_KEY`
   - service_role → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ SECRET
3. **Settings** → **Database** → Connection string → `DATABASE_URL`

## ✅ Vérifications

### Code source
- ✅ Utilise `import.meta.env.VITE_SUPABASE_URL` (pas de hardcoding)
- ✅ Design avec fond gris clair (`bg-gray-50`)
- ✅ Pas de références à l'ancien projet dans le code

### Base de données
- ✅ Tables créées dans Supabase (`database/schema-supabase.sql`)
- ✅ Table `users` liée à `auth.users(id)`

## 🚀 Déploiement

1. **Local** : Modifier `.env` → Redémarrer (`npm run dev`)
2. **Render** : Modifier variables → Redéployer (Manual Deploy)

## 📝 Notes importantes

- ⚠️ Les variables `VITE_*` sont utilisées **pendant le BUILD** sur Render
- ⚠️ Vous **DEVEZ redéployer** après avoir modifié les variables `VITE_*` sur Render
- 🔒 Ne partagez **JAMAIS** la clé `SUPABASE_SERVICE_ROLE_KEY` publiquement
