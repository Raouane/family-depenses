# 📋 Configuration finale de l'environnement Render

## ✅ Variables à GARDER

Ces variables sont nécessaires et doivent rester :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `DATABASE_URL` | `postgresql://postgres.lqdfioptcptinnxqshrj:...` | Connection string PostgreSQL |
| `FRONTEND_URL` | `https://family-depenses.onrender.com` | URL du frontend |
| `NODE_ENV` | `production` | Environnement Node.js |
| `PORT` | `3000` | Port du serveur backend |
| `VITE_API_URL` | `https://family-depenses.onrender.com/api` | URL de l'API pour le frontend |

## ❌ Variables à SUPPRIMER

Ces variables Supabase ne sont **plus utilisées** et peuvent être supprimées :

- ❌ `SUPABASE_SERVICE_ROLE_KEY`
- ❌ `SUPABASE_URL`
- ❌ `VITE_SUPABASE_ANON_KEY`
- ❌ `VITE_SUPABASE_URL`

## ➕ Variable à AJOUTER

Cette variable est **essentielle** pour l'authentification JWT :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `JWT_SECRET` | `7b819a976f3a8d8d5fafe14d251152408f40b316ef4165f1a56bbb68deca6bb3b6f9b73528e0301021f2a20cbed22b5dd580aceed258622f4d16dbdec37b6bbd` | Secret pour signer/vérifier les tokens JWT |

## 📋 Configuration finale complète

Votre environnement Render devrait contenir **exactement** ces 6 variables :

```env
DATABASE_URL=postgresql://postgres.lqdfioptcptinnxqshrj:[MOT_DE_PASSE]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
FRONTEND_URL=https://family-depenses.onrender.com
NODE_ENV=production
PORT=3000
VITE_API_URL=https://family-depenses.onrender.com/api
JWT_SECRET=7b819a976f3a8d8d5fafe14d251152408f40b316ef4165f1a56bbb68deca6bb3b6f9b73528e0301021f2a20cbed22b5dd580aceed258622f4d16dbdec37b6bbd
```

## 🔧 Actions à effectuer dans Render

### 1. Ajouter JWT_SECRET

1. Cliquez sur **"Add Environment Variable"**
2. **Key** : `JWT_SECRET`
3. **Value** : `7b819a976f3a8d8d5fafe14d251152408f40b316ef4165f1a56bbb68deca6bb3b6f9b73528e0301021f2a20cbed22b5dd580aceed258622f4d16dbdec37b6bbd`
4. Cliquez sur **"Save Changes"**

### 2. Supprimer les variables Supabase (optionnel mais recommandé)

Pour chaque variable Supabase, cliquez sur l'icône de suppression :
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_URL`

⚠️ **Note** : Vous pouvez les laisser si vous préférez, elles ne seront simplement pas utilisées.

### 3. Redéployer

Après avoir ajouté `JWT_SECRET` :
- Cliquez sur **"Manual Deploy"** → **"Deploy latest commit"**
- Attendez que le build se termine

## ✅ Vérification

Après redéploiement, votre environnement devrait contenir :
- ✅ 6 variables (5 existantes + 1 nouvelle `JWT_SECRET`)
- ✅ Plus de dépendance à Supabase Auth
- ✅ Authentification JWT fonctionnelle

## 📝 Résumé

**Avant** : 9 variables (dont 4 Supabase inutiles)
**Après** : 6 variables (toutes nécessaires)

Votre application est maintenant complètement indépendante de Supabase Auth ! 🎉
