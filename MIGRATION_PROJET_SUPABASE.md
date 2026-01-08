# 🔄 Migration vers le projet Supabase `lqdfioptcptinnxqshrj`

## ✅ État actuel

Votre code est **déjà bien configuré** :
- ✅ Utilise les variables d'environnement (`import.meta.env.VITE_SUPABASE_URL`)
- ✅ Pas de références hardcodées à l'ancien projet dans le code source
- ✅ Design avec fond gris clair (`bg-gray-50`) déjà appliqué

## 📋 Actions à effectuer

### 1. Mettre à jour le fichier `.env` local

À la racine du projet, ouvrez le fichier `.env` et vérifiez/modifiez ces lignes :

```env
# URL de l'API backend (local)
VITE_API_URL=http://localhost:3000/api

# Configuration Supabase - PROJET lqdfioptcptinnxqshrj
VITE_SUPABASE_URL=https://lqdfioptcptinnxqshrj.supabase.co
VITE_SUPABASE_ANON_KEY=[COLLEZ VOTRE CLÉ ANON ICI]

# Configuration Backend (si vous avez un fichier backend/.env)
DATABASE_URL=postgresql://postgres.lqdfioptcptinnxqshrj:[MOT-DE-PASSE]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
SUPABASE_URL=https://lqdfioptcptinnxqshrj.supabase.co
SUPABASE_SERVICE_ROLE_KEY=[COLLEZ VOTRE CLÉ SERVICE_ROLE ICI]
```

### 2. Obtenir les clés depuis Supabase

1. Allez sur https://supabase.com
2. Sélectionnez le projet **`lqdfioptcptinnxqshrj`**
3. **Settings** → **API** :
   - **Project URL** → `https://lqdfioptcptinnxqshrj.supabase.co`
   - **anon public key** → Collez dans `VITE_SUPABASE_ANON_KEY`
   - **service_role key** → Collez dans `SUPABASE_SERVICE_ROLE_KEY` (⚠️ SECRET)
4. **Settings** → **Database** → **Connection string** :
   - Copiez la connection string → Collez dans `DATABASE_URL`

### 3. Redémarrer le serveur local

Après avoir modifié le `.env` :

```bash
# Arrêtez le serveur (Ctrl+C)
# Puis relancez
npm run dev
```

### 4. Mettre à jour Render

Dans Render → Web Service → Environment, mettez à jour :

| Variable | Nouvelle valeur |
|----------|----------------|
| `VITE_SUPABASE_URL` | `https://lqdfioptcptinnxqshrj.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | La clé anon de `lqdfioptcptinnxqshrj` |
| `SUPABASE_URL` | `https://lqdfioptcptinnxqshrj.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | La clé service_role de `lqdfioptcptinnxqshrj` |
| `DATABASE_URL` | La connection string de `lqdfioptcptinnxqshrj` |

Puis **redéployez** : Manual Deploy → Deploy latest commit

## 🔍 Vérification du code

### ✅ Points vérifiés

1. **`src/lib/supabase.js`** : Utilise bien `import.meta.env.VITE_SUPABASE_URL` ✅
2. **Pas de hardcoding** : Aucune référence hardcodée à `dizcnsohvipeqdelmecb` dans le code source ✅
3. **Design** : Fond gris clair (`bg-gray-50`) déjà appliqué dans :
   - `src/index.css` (ligne 35)
   - `src/components/Layout.jsx`
   - `src/pages/Home.jsx`
   - `src/pages/AddExpense.jsx`

### 📝 Fichiers de documentation

Les fichiers `.md` contiennent encore des références à `dizcnsohvipeqdelmecb`, mais c'est normal - ce sont des guides de dépannage. Le code source est propre.

## ✅ Checklist finale

- [ ] Fichier `.env` local mis à jour avec les valeurs de `lqdfioptcptinnxqshrj`
- [ ] Variables Render mises à jour
- [ ] Service Render redéployé
- [ ] Serveur local redémarré (`npm run dev`)
- [ ] Test d'inscription/connexion réussi

## 🎯 Résultat attendu

Après ces modifications :
- ✅ L'application fonctionne en local
- ✅ L'application fonctionne sur Render
- ✅ Plus d'erreur `ERR_NAME_NOT_RESOLVED`
- ✅ Authentification fonctionnelle
