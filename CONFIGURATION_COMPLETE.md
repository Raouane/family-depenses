# ✅ Configuration complète - Toutes les clés

## 🔑 Clés Supabase pour le projet `lqdfioptcptinnxqshrj`

Voici toutes les clés que vous avez fournies :

### Variables Frontend (fichier `.env` à la racine)

```env
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=https://lqdfioptcptinnxqshrj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxZGZpb3B0Y3B0aW5ueHFzaHJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MTgwMjgsImV4cCI6MjA4MzM5NDAyOH0.SfMxrn6f3cj3XSSwM_EjU1VKP9PDWt1Ur31kwMIUFuA
```

### Variables Backend (fichier `backend/.env`)

```env
DATABASE_URL=postgresql://postgres.lqdfioptcptinnxqshrj:[VOTRE_MOT_DE_PASSE]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=https://lqdfioptcptinnxqshrj.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxZGZpb3B0Y3B0aW5ueHFzaHJqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzgxODAyOCwiZXhwIjoyMDgzMzk0MDI4fQ.66x4iNocWcP8WUn6Cl3jIXaC0DrCUqt5nrqb9Qr4dZs
```

### Variables Render (Web Service → Environment)

#### Frontend
```env
VITE_API_URL=https://family-depenses.onrender.com/api
VITE_SUPABASE_URL=https://lqdfioptcptinnxqshrj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxZGZpb3B0Y3B0aW5ueHFzaHJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MTgwMjgsImV4cCI6MjA4MzM5NDAyOH0.SfMxrn6f3cj3XSSwM_EjU1VKP9PDWt1Ur31kwMIUFuA
```

#### Backend
```env
DATABASE_URL=postgresql://postgres.lqdfioptcptinnxqshrj:[VOTRE_MOT_DE_PASSE]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://family-depenses.onrender.com
SUPABASE_URL=https://lqdfioptcptinnxqshrj.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxZGZpb3B0Y3B0aW5ueHFzaHJqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzgxODAyOCwiZXhwIjoyMDgzMzk0MDI4fQ.66x4iNocWcP8WUn6Cl3jIXaC0DrCUqt5nrqb9Qr4dZs
```

## 📝 Note sur la clé publishable

La clé `sb_publishable_SVOkmGcIU9EkNqLqCeMBzg_7IN4ZEpl` est un ancien format. Utilisez plutôt la clé JWT anon fournie ci-dessus.

## ✅ Actions à effectuer

### 1. Mettre à jour le fichier `.env` local

À la racine du projet, créez/modifiez le fichier `.env` avec les valeurs Frontend ci-dessus.

### 2. Mettre à jour `backend/.env`

Dans le dossier `backend`, créez/modifiez le fichier `.env` avec les valeurs Backend ci-dessus (n'oubliez pas de remplacer `[VOTRE_MOT_DE_PASSE]` par votre vrai mot de passe de base de données).

### 3. Mettre à jour Render

Dans Render → Web Service → Environment, ajoutez/modifiez toutes les variables listées ci-dessus.

### 4. Redémarrer et redéployer

- **Local** : Redémarrez le serveur (`npm run dev`)
- **Render** : Redéployez le service (Manual Deploy → Deploy latest commit)

## 🔒 Sécurité

⚠️ **IMPORTANT** : 
- Ne commitez **JAMAIS** les fichiers `.env` dans Git
- Ne partagez **JAMAIS** la clé `SUPABASE_SERVICE_ROLE_KEY` publiquement
- Ces clés sont déjà dans `.gitignore` pour votre sécurité

## ✅ Vérification

Après configuration :
1. Testez l'inscription/connexion en local
2. Vérifiez que l'application fonctionne sur Render
3. Plus d'erreur `ERR_NAME_NOT_RESOLVED` ✅
