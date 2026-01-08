# Configuration Supabase Auth

Ce guide explique comment configurer l'authentification Supabase pour l'application FamilySplit.

## Prérequis

1. Un compte Supabase : https://supabase.com
2. Un projet Supabase créé

## Configuration Frontend

### 1. Obtenir les clés Supabase

1. Allez sur https://supabase.com
2. Sélectionnez votre projet
3. Allez dans **Settings** > **API**
4. Copiez :
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

### 2. Créer le fichier .env

À la racine du projet (à côté de `package.json`), créez un fichier `.env` :

```env
# URL de l'API backend
VITE_API_URL=http://localhost:3000/api

# Configuration Supabase
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anon-supabase
```

### 3. Redémarrer le serveur de développement

```bash
npm run dev
```

## Configuration Backend

### 1. Obtenir la Service Role Key

1. Dans votre dashboard Supabase, allez dans **Settings** > **API**
2. Copiez la **service_role** key (⚠️ Ne la partagez jamais publiquement)

### 2. Mettre à jour backend/.env

Ajoutez ces variables dans `backend/.env` :

```env
# Configuration Supabase
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key
```

## Configuration Base de Données

### 1. Mettre à jour le schéma

Exécutez le script SQL `database/schema-supabase.sql` dans le SQL Editor de Supabase.

Ce script crée la table `users` avec une référence à `auth.users.id` :

```sql
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    initial CHAR(1) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Migration (si la table existe déjà)

Si vous avez déjà une table `users`, exécutez `database/migration_supabase_auth.sql` pour la migrer.

## Fonctionnement

### Inscription

1. L'utilisateur s'inscrit via Supabase Auth (frontend)
2. Supabase crée l'utilisateur dans `auth.users`
3. Le frontend appelle `/api/auth/register` avec `userId`, `name`, `email`, `initial`
4. Le backend crée le profil dans la table `users` avec l'ID de Supabase

### Connexion

1. L'utilisateur se connecte via Supabase Auth (frontend)
2. Supabase retourne un token d'accès
3. Le frontend envoie ce token dans le header `Authorization: Bearer <token>`
4. Le backend vérifie le token avec Supabase et extrait l'`userId`

### Sécurité

- Les tokens Supabase sont vérifiés côté backend
- L'ID utilisateur vient directement de Supabase Auth
- Pas de gestion de mots de passe côté backend

## Vérification

1. **Frontend** : Ouvrez http://localhost:5173
2. **Inscription** : Créez un compte avec email/mot de passe
3. **Connexion** : Connectez-vous avec vos identifiants
4. **Dashboard** : Vous devriez voir votre nom affiché

## Dépannage

### Erreur "Variables d'environnement Supabase manquantes"

Vérifiez que votre fichier `.env` contient bien `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`.

### Erreur "Token invalide"

Vérifiez que `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` sont bien configurés dans `backend/.env`.

### Erreur "L'utilisateur doit d'abord être créé dans Supabase Auth"

L'utilisateur doit s'inscrire via Supabase Auth avant que le profil ne soit créé dans la base de données.
