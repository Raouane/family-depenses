# Guide de Déploiement sur Render

Ce guide explique comment déployer l'application FamilySplit sur Render.

## 📋 Prérequis

1. Un compte Render (gratuit) : https://render.com
2. Votre code sur GitHub (déjà fait ✅)
3. Votre base de données Supabase configurée (déjà fait ✅)

## 🚀 Étape 1 : Déployer le Backend

### 1.1 Créer un nouveau Web Service

1. Allez sur https://dashboard.render.com
2. Cliquez sur **"New +"** puis **"Web Service"**
3. Connectez votre compte GitHub si ce n'est pas déjà fait
4. Sélectionnez le dépôt **`family-depenses`**

### 1.2 Configuration du Backend

Remplissez les informations suivantes :

- **Name** : `familysplit-backend` (ou un nom de votre choix)
- **Region** : Choisissez la région la plus proche (ex: Frankfurt, Ireland)
- **Branch** : `main`
- **Root Directory** : `backend`
- **Runtime** : `Node`
- **Build Command** : `npm install && npm run build`
- **Start Command** : `npm start`

### 1.3 Variables d'Environnement

Dans la section **"Environment Variables"**, ajoutez :

```
DATABASE_URL=postgresql://postgres.lqdfioptcptinnxqshrj:[VOTRE-MOT-DE-PASSE]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://votre-frontend.onrender.com
```

**Important** :
- Remplacez `[VOTRE-MOT-DE-PASSE]` par votre vrai mot de passe Supabase
- Remplacez `FRONTEND_URL` par l'URL de votre frontend (vous l'obtiendrez après le déploiement du frontend)

### 1.4 Plan

- Sélectionnez le plan **"Free"** (gratuit)

### 1.5 Créer le Service

Cliquez sur **"Create Web Service"**

Le backend sera déployé en quelques minutes. Notez l'URL (ex: `https://familysplit-backend.onrender.com`)

---

## 🎨 Étape 2 : Déployer le Frontend

### 2.1 Créer un nouveau Static Site

1. Dans le dashboard Render, cliquez sur **"New +"** puis **"Static Site"**
2. Sélectionnez le même dépôt **`family-depenses`**

### 2.2 Configuration du Frontend

Remplissez les informations :

- **Name** : `familysplit-frontend` (ou un nom de votre choix)
- **Branch** : `main`
- **Root Directory** : (laissez vide, c'est la racine)
- **Build Command** : `npm install && npm run build`
- **Publish Directory** : `dist`

### 2.3 Variables d'Environnement

Ajoutez :

```
VITE_API_URL=https://votre-backend.onrender.com/api
```

**Important** : Remplacez `votre-backend.onrender.com` par l'URL réelle de votre backend déployé.

### 2.4 Créer le Site

Cliquez sur **"Create Static Site"**

Le frontend sera déployé en quelques minutes.

---

## ⚙️ Étape 3 : Mettre à jour les URLs

### 3.1 Mettre à jour le Backend

Une fois le frontend déployé, retournez dans les paramètres du backend et mettez à jour :

```
FRONTEND_URL=https://votre-frontend.onrender.com
```

Puis redéployez le backend (bouton "Manual Deploy" > "Deploy latest commit")

### 3.2 Mettre à jour le Frontend

Si nécessaire, mettez à jour la variable d'environnement du frontend avec la bonne URL du backend.

---

## 🔧 Configuration CORS

Le backend est déjà configuré pour accepter les requêtes depuis votre frontend. Si vous avez des problèmes CORS, vérifiez que `FRONTEND_URL` dans le backend correspond exactement à l'URL de votre frontend.

---

## 📝 Notes Importantes

1. **Plan Gratuit** : 
   - Le service se met en veille après 15 minutes d'inactivité
   - Le premier démarrage peut prendre 30-60 secondes
   - Parfait pour le développement et les tests

2. **Base de données** :
   - Utilisez Supabase (déjà configuré)
   - L'URL de connexion doit être celle du pooler (Session mode)

3. **Logs** :
   - Consultez les logs dans le dashboard Render pour déboguer
   - Section "Logs" dans chaque service

4. **Redéploiement automatique** :
   - Render redéploie automatiquement à chaque push sur `main`
   - Vous pouvez aussi déclencher un redéploiement manuel

---

## 🐛 Dépannage

### Erreur : "Cannot find module"
- Vérifiez que `Root Directory` est bien `backend` pour le backend
- Vérifiez que les dépendances sont bien installées

### Erreur CORS
- Vérifiez que `FRONTEND_URL` dans le backend correspond exactement à l'URL du frontend
- Vérifiez que l'URL se termine par `/api` dans `VITE_API_URL`

### Erreur de connexion à la base de données
- Vérifiez que `DATABASE_URL` est correcte
- Utilisez l'URL pooler (Session mode) de Supabase
- Vérifiez que le mot de passe est bien encodé (les `*` doivent être `%2A`)

---

## ✅ Vérification

Une fois déployé, testez :

1. **Backend** : `https://votre-backend.onrender.com/api/groups` (devrait retourner une erreur 400 ou les groupes)
2. **Frontend** : `https://votre-frontend.onrender.com` (devrait afficher l'application)

---

## 🔗 URLs Finales

- **Backend** : `https://familysplit-backend.onrender.com`
- **Frontend** : `https://familysplit-frontend.onrender.com`

Bon déploiement ! 🚀
