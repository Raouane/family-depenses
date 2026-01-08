# 🔧 Correction des variables d'environnement dans Render

## ⚠️ Problèmes identifiés

D'après votre configuration Render, il manque des variables importantes pour le backend.

## 📋 Variables manquantes

### Variables Backend Supabase (à ajouter)

Ces variables sont **absolument nécessaires** pour que le backend puisse vérifier les tokens Supabase :

| Variable | Valeur à définir |
|----------|----------------|
| `SUPABASE_URL` | `https://dizcnsohvipeqdelmecb.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | La clé **service_role** du projet `dizcnsohvipeqdelmecb` |

**⚠️ Important** : La clé `service_role` est **différente** de la clé `anon public`. Ne les confondez pas !

## 🔍 Incohérence détectée

Votre `DATABASE_URL` pointe vers le projet `lqdfioptcptinnxqshrj`, mais votre frontend utilise `dizcnsohvipeqdelmecb`.

### Option 1 : Utiliser le même projet pour tout (recommandé)

Si vous voulez utiliser `dizcnsohvipeqdelmecb` pour tout :

1. **Dans Supabase**, allez dans le projet `dizcnsohvipeqdelmecb`
2. **Settings** → **Database** → **Connection string**
3. Copiez la **Connection string** (URI)
4. **Dans Render**, mettez à jour `DATABASE_URL` avec cette nouvelle valeur
5. Ajoutez `SUPABASE_URL` = `https://dizcnsohvipeqdelmecb.supabase.co`
6. Ajoutez `SUPABASE_SERVICE_ROLE_KEY` = La clé service_role du projet `dizcnsohvipeqdelmecb`

### Option 2 : Garder deux projets séparés

Si vous voulez garder deux projets différents :
- **Backend** : Utilise `lqdfioptcptinnxqshrj` pour la base de données
- **Frontend** : Utilise `dizcnsohvipeqdelmecb` pour l'authentification

**Mais** : Vous devrez quand même ajouter `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` pour le projet `dizcnsohvipeqdelmecb` car c'est celui utilisé par le frontend.

## ✅ Actions à effectuer

### 1. Ajouter les variables manquantes

Dans Render → Web Service → Environment → Add Environment Variable :

1. **`SUPABASE_URL`**
   - Valeur : `https://dizcnsohvipeqdelmecb.supabase.co`

2. **`SUPABASE_SERVICE_ROLE_KEY`**
   - Allez sur https://supabase.com
   - Sélectionnez le projet **`dizcnsohvipeqdelmecb`**
   - **Settings** → **API**
   - Copiez la clé **"service_role"** (⚠️ PAS la clé "anon public")
   - Collez-la dans Render

### 2. (Optionnel) Corriger DATABASE_URL

Si vous choisissez l'Option 1 (même projet pour tout) :
- Mettez à jour `DATABASE_URL` pour pointer vers `dizcnsohvipeqdelmecb`

### 3. Redéployer

**⚠️ CRITIQUE** : Après avoir ajouté/modifié les variables, redéployez :
- **Manual Deploy** → **Deploy latest commit**

## 📋 Checklist complète

Variables à avoir dans Render :

### Frontend (déjà configurées ✅)
- [x] `VITE_API_URL`
- [x] `VITE_SUPABASE_URL`
- [x] `VITE_SUPABASE_ANON_KEY`

### Backend (à vérifier/ajouter)
- [ ] `DATABASE_URL` (vérifier si elle pointe vers le bon projet)
- [ ] `SUPABASE_URL` ⚠️ **MANQUANTE**
- [ ] `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **MANQUANTE**
- [x] `PORT`
- [x] `NODE_ENV`
- [x] `FRONTEND_URL`

## 🔍 Comment obtenir la clé service_role

1. Allez sur https://supabase.com
2. Sélectionnez le projet **`dizcnsohvipeqdelmecb`**
3. **Settings** → **API**
4. Dans la section **"Project API keys"**, trouvez **"service_role"**
5. Cliquez sur l'icône d'œil pour révéler la clé
6. ⚠️ **ATTENTION** : Cette clé a des permissions complètes. Ne la partagez jamais publiquement.

## ✅ Après correction

1. Redéployez le service
2. Testez l'inscription/connexion
3. Les erreurs d'authentification devraient être résolues
