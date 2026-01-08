# ⚡ Configuration rapide - Copier-coller

## 📋 Fichier `.env` (à la racine du projet)

Créez/modifiez le fichier `.env` à la racine avec ce contenu :

```env
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=https://lqdfioptcptinnxqshrj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxZGZpb3B0Y3B0aW5ueHFzaHJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MTgwMjgsImV4cCI6MjA4MzM5NDAyOH0.SfMxrn6f3cj3XSSwM_EjU1VKP9PDWt1Ur31kwMIUFuA
```

## 📋 Fichier `backend/.env`

Créez/modifiez le fichier `backend/.env` avec ce contenu (remplacez `[MOT_DE_PASSE]` par votre mot de passe de base de données) :

```env
DATABASE_URL=postgresql://postgres.lqdfioptcptinnxqshrj:[MOT_DE_PASSE]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=https://lqdfioptcptinnxqshrj.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxZGZpb3B0Y3B0aW5ueHFzaHJqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzgxODAyOCwiZXhwIjoyMDgzMzk0MDI4fQ.66x4iNocWcP8WUn6Cl3jIXaC0DrCUqt5nrqb9Qr4dZs
```

## 🚀 Render - Variables d'environnement

Dans Render → Web Service → Environment, ajoutez/modifiez :

### Frontend
- `VITE_API_URL` = `https://family-depenses.onrender.com/api`
- `VITE_SUPABASE_URL` = `https://lqdfioptcptinnxqshrj.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxZGZpb3B0Y3B0aW5ueHFzaHJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MTgwMjgsImV4cCI6MjA4MzM5NDAyOH0.SfMxrn6f3cj3XSSwM_EjU1VKP9PDWt1Ur31kwMIUFuA`

### Backend
- `SUPABASE_URL` = `https://lqdfioptcptinnxqshrj.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxZGZpb3B0Y3B0aW5ueHFzaHJqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzgxODAyOCwiZXhwIjoyMDgzMzk0MDI4fQ.66x4iNocWcP8WUn6Cl3jIXaC0DrCUqt5nrqb9Qr4dZs`
- `DATABASE_URL` = (votre connection string existante)

## ✅ Après configuration

1. **Local** : Redémarrez le serveur (`npm run dev`)
2. **Render** : Redéployez (Manual Deploy → Deploy latest commit)

## 🎯 Résultat

Votre application devrait maintenant fonctionner sans erreur ! ✅
