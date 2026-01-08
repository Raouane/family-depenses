# 🚀 Déploiement Rapide sur Render

## ⚡ Déploiement en 5 minutes

### 1️⃣ Backend (Web Service)

1. **Aller sur** : https://dashboard.render.com
2. **Cliquer** : "New +" → "Web Service"
3. **Connecter** votre compte GitHub
4. **Sélectionner** le repo : `family-depenses`

**Configuration :**
```
Name: familysplit-backend
Region: Frankfurt (ou plus proche)
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install && npm run build
Start Command: npm start
```

**Variables d'environnement :**
```
DATABASE_URL=postgresql://postgres.lqdfioptcptinnxqshrj:[MOT-DE-PASSE]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://familysplit-frontend.onrender.com
```

**⚠️ Important** : Remplacez `[MOT-DE-PASSE]` par votre mot de passe Supabase (avec `%2A` pour les `*`)

---

### 2️⃣ Frontend (Static Site)

1. **Dans Render**, cliquer : "New +" → "Static Site"
2. **Sélectionner** le même repo : `family-depenses`

**Configuration :**
```
Name: familysplit-frontend
Branch: main
Root Directory: (laisser vide)
Build Command: npm install && npm run build
Publish Directory: dist
```

**Variables d'environnement :**
```
VITE_API_URL=https://familysplit-backend.onrender.com/api
```

**⚠️ Important** : Remplacez `familysplit-backend` par le nom réel de votre backend

---

### 3️⃣ Mettre à jour les URLs

Une fois les deux services déployés :

1. **Retourner dans le backend**
2. **Mettre à jour** `FRONTEND_URL` avec l'URL réelle du frontend
3. **Redéployer** le backend (Manual Deploy)

---

## ✅ Vérification

- **Backend** : `https://votre-backend.onrender.com/health` → doit retourner `{"status":"ok"}`
- **Frontend** : `https://votre-frontend.onrender.com` → doit afficher l'app

---

## 📝 Notes

- **Gratuit** : Les services se mettent en veille après 15 min d'inactivité
- **Premier démarrage** : Peut prendre 30-60 secondes
- **Redéploiement auto** : À chaque push sur `main`

---

## 🐛 Problèmes courants

**Erreur CORS** : Vérifiez que `FRONTEND_URL` dans le backend correspond exactement à l'URL du frontend

**Erreur DB** : Vérifiez que `DATABASE_URL` utilise l'URL pooler de Supabase (Session mode)

**Build échoue** : Vérifiez les logs dans Render pour voir l'erreur exacte

---

Bon déploiement ! 🎉
