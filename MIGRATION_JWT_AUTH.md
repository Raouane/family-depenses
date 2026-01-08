# 🔄 Migration vers l'authentification JWT (Node.js)

## ✅ Modifications effectuées

### Backend

1. **`backend/src/routes/auth.ts`** :
   - ✅ Route `/register` modifiée pour créer l'utilisateur avec mot de passe hashé
   - ✅ Génère un UUID pour l'utilisateur (plus besoin de Supabase Auth)
   - ✅ Retourne un token JWT après inscription

2. **`backend/src/middleware/auth.ts`** :
   - ✅ Utilise maintenant JWT au lieu de Supabase
   - ✅ Vérifie le token avec `jsonwebtoken`

### Frontend

1. **`src/context/AuthContext.jsx`** :
   - ✅ Utilise l'API backend (`/auth/login`, `/auth/register`)
   - ✅ Stocke le token JWT dans `localStorage`
   - ✅ Plus de dépendance à Supabase

2. **`src/services/api.js`** :
   - ✅ Récupère le token depuis `localStorage` au lieu de Supabase
   - ✅ Plus de dépendance à `@/lib/supabase`

## 📋 Actions à effectuer

### 1. Mettre à jour la base de données

Exécutez le script SQL `database/migration_remove_supabase_auth.sql` dans Supabase :

1. Allez sur https://supabase.com
2. Sélectionnez votre projet
3. **SQL Editor** → **New query**
4. Copiez-collez le contenu de `database/migration_remove_supabase_auth.sql`
5. Cliquez sur **Run**

### 2. Ajouter JWT_SECRET dans les variables d'environnement

#### Backend local (`backend/.env`)
```env
JWT_SECRET=votre-secret-jwt-tres-securise-changez-en-production
```

#### Render (Web Service → Environment)
```env
JWT_SECRET=votre-secret-jwt-tres-securise-changez-en-production
```

⚠️ **Important** : Utilisez un secret fort et différent en production !

### 3. Supprimer les variables Supabase (optionnel)

Vous pouvez supprimer ces variables de Render (elles ne sont plus utilisées) :
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### 4. Mettre à jour les utilisateurs existants

Les utilisateurs existants n'ont pas de mot de passe. Vous avez deux options :

**Option A** : Créer une route de réinitialisation de mot de passe
**Option B** : Supprimer les utilisateurs existants et les faire se réinscrire

### 5. Redémarrer les services

- **Local** : Redémarrez le backend (`npm run dev` dans `backend/`)
- **Render** : Redéployez le service

## 🔒 Sécurité

- ✅ Les mots de passe sont hashés avec bcrypt (10 rounds)
- ✅ Les tokens JWT expirent après 7 jours
- ✅ Le secret JWT doit être fort et unique

## ✅ Vérification

1. Testez l'inscription d'un nouvel utilisateur
2. Testez la connexion
3. Vérifiez que les routes protégées fonctionnent

## 📝 Notes

- Les utilisateurs existants devront se réinscrire ou réinitialiser leur mot de passe
- Le schéma de base de données ne dépend plus de `auth.users` de Supabase
- Vous pouvez maintenant supprimer complètement Supabase Auth de votre projet
