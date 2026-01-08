# 🚀 Déploiement Frontend + Backend Ensemble sur Render

Ce guide explique comment déployer le frontend et le backend ensemble dans une seule Web App sur Render.

## ⚙️ Configuration sur Render

### 1. Créer un Web Service

1. Allez sur https://dashboard.render.com
2. Cliquez sur **"New +"** → **"Web Service"**
3. Connectez votre compte GitHub
4. Sélectionnez le repo : `family-depenses`

### 2. Configuration

Remplissez les champs suivants :

**Name** :
```
familysplit
```

**Root Directory** :
```
(laisser vide - racine du projet)
```

**Build Command** :
```bash
npm install --include=dev && npm run build:all
```

**OU** (alternative si la première ne fonctionne pas) :
```bash
NPM_CONFIG_PRODUCTION=false npm install && npm run build:all
```

**Start Command** :
```bash
cd backend && npm start
```

**Instance Type** :
- Sélectionnez **Free** (pour commencer)

### 3. Variables d'Environnement

Ajoutez ces variables :

1. **DATABASE_URL** :
   ```
   postgresql://postgres.lqdfioptcptinnxqshrj:[VOTRE-MOT-DE-PASSE]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
   ```
   ⚠️ Remplacez `[VOTRE-MOT-DE-PASSE]` par votre mot de passe Supabase (avec `%2A` pour les `*`)

2. **PORT** :
   ```
   3000
   ```

3. **NODE_ENV** :
   ```
   production
   ```

4. **FRONTEND_URL** :
   ```
   https://votre-app.onrender.com
   ```
   ⚠️ Remplacez par l'URL réelle de votre app (vous la verrez après le déploiement)

### 4. Déployer

Cliquez sur **"Deploy Web Service"**

---

## 📝 Comment ça fonctionne

1. **Build** : Le script `build:all` construit d'abord le frontend (dans `dist/`), puis le backend (dans `backend/dist/`)
2. **Start** : Le backend démarre et sert :
   - Les routes API sur `/api/*`
   - Les fichiers statiques du frontend sur toutes les autres routes
3. **SPA Routing** : Toutes les routes non-API servent `index.html` pour le routing React

---

## ✅ Vérification

Une fois déployé :

- **API** : `https://votre-app.onrender.com/api/health` → doit retourner `{"status":"ok"}`
- **Frontend** : `https://votre-app.onrender.com` → doit afficher l'application
- **Routes React** : Toutes les routes (ex: `/groups`, `/profile`) doivent fonctionner

---

## 🐛 Dépannage

### Erreur "Cannot find module"
- Vérifiez que le build s'est bien terminé
- Consultez les logs dans Render

### Frontend ne s'affiche pas
- Vérifiez que le dossier `dist/` existe après le build
- Vérifiez les logs pour voir si les fichiers statiques sont servis

### Erreur CORS
- En production, CORS n'est plus nécessaire car tout est servi depuis le même domaine
- Si vous avez des erreurs, vérifiez que `NODE_ENV=production`

---

## 🎉 Avantages

- ✅ Un seul service à gérer
- ✅ Pas de problème CORS
- ✅ URL unique pour tout
- ✅ Plus simple à déployer

Bon déploiement ! 🚀
