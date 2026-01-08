# 🔧 Dépannage : Erreur 401 Unauthorized lors de l'inscription

## ⚠️ Problème

Vous obtenez une erreur `401 (Unauthorized)` lors de l'inscription :
```
POST https://lqdfioptcptinnxqshrj.supabase.co/auth/v1/signup 401 (Unauthorized)
```

## 🔍 Causes possibles

### 1. Clé anon ne correspond pas au projet

La clé `VITE_SUPABASE_ANON_KEY` que vous avez fournie correspond au projet `dizcnsohvipeqdelmecb`, mais l'URL est `lqdfioptcptinnxqshrj`.

**Solution** : Vérifiez que l'URL et la clé correspondent au même projet Supabase.

### 2. Email confirmation désactivée

Supabase peut exiger la confirmation d'email par défaut.

**Solution** : Désactiver la confirmation d'email dans Supabase :
1. Allez sur https://supabase.com
2. Sélectionnez votre projet
3. **Authentication** → **Settings** → **Email Auth**
4. Désactivez **"Enable email confirmations"** (pour le développement)
5. Sauvegardez

### 3. Politiques RLS (Row Level Security)

Les politiques de sécurité peuvent bloquer l'accès.

**Solution** : Vérifiez les politiques dans Supabase :
1. Allez dans **Authentication** → **Policies**
2. Vérifiez que les utilisateurs peuvent s'inscrire

### 4. Clé anon incorrecte

La clé anon peut être incorrecte ou expirée.

**Solution** : Vérifiez la clé :
1. Allez dans **Settings** → **API**
2. Copiez à nouveau la clé **"anon public"**
3. Mettez à jour `VITE_SUPABASE_ANON_KEY` dans Render
4. Redéployez

## ✅ Solution rapide : Vérifier l'URL et la clé

### Étape 1 : Vérifier le projet Supabase

1. Allez sur https://supabase.com
2. Sélectionnez votre projet
3. Allez dans **Settings** → **API**
4. Vérifiez :
   - **Project URL** → doit correspondre à `VITE_SUPABASE_URL`
   - **anon public key** → doit correspondre à `VITE_SUPABASE_ANON_KEY`

### Étape 2 : Corriger si nécessaire

Si l'URL et la clé ne correspondent pas :

1. **Dans Render**, allez dans votre Web Service → **Environment**
2. Mettez à jour :
   - `VITE_SUPABASE_URL` avec la bonne URL
   - `VITE_SUPABASE_ANON_KEY` avec la bonne clé anon
3. **Redéployez** le service

### Étape 3 : Désactiver la confirmation d'email (développement)

1. Dans Supabase : **Authentication** → **Settings** → **Email Auth**
2. Désactivez **"Enable email confirmations"**
3. Sauvegardez

## 🔍 Vérification

Après avoir corrigé :
1. Redéployez le service sur Render
2. Essayez de vous inscrire à nouveau
3. L'erreur 401 devrait disparaître

## 📝 Note importante

Pour la production, vous devrez réactiver la confirmation d'email et configurer les emails de confirmation.
