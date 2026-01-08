# 🔧 Résolution : Erreur 401 lors de l'inscription Supabase

## ⚠️ Erreur

```
POST https://lqdfioptcptinnxqshrj.supabase.co/auth/v1/signup 401 (Unauthorized)
```

## 🔍 Problème identifié

L'URL Supabase dans votre `.env` est `lqdfioptcptinnxqshrj`, mais la clé anon que vous avez fournie correspond au projet `dizcnsohvipeqdelmecb`.

**Ils ne correspondent pas au même projet !**

## ✅ Solution : Corriger l'URL ou la clé

### Option 1 : Utiliser le projet `dizcnsohvipeqdelmecb` (celui de la clé)

Si vous voulez utiliser le projet correspondant à votre clé anon :

1. **Dans Render**, allez dans votre Web Service → **Environment**
2. Mettez à jour `VITE_SUPABASE_URL` :
   ```
   VITE_SUPABASE_URL=https://dizcnsohvipeqdelmecb.supabase.co
   ```
3. **Redéployez** le service

### Option 2 : Obtenir la clé anon du projet `lqdfioptcptinnxqshrj`

Si vous voulez utiliser le projet `lqdfioptcptinnxqshrj` :

1. Allez sur https://supabase.com
2. Sélectionnez le projet **`lqdfioptcptinnxqshrj`**
3. **Settings** → **API**
4. Copiez la clé **"anon public"**
5. **Dans Render**, mettez à jour `VITE_SUPABASE_ANON_KEY` avec cette clé
6. **Redéployez** le service

## 🔧 Solution supplémentaire : Désactiver la confirmation d'email

Même avec la bonne clé, Supabase peut exiger la confirmation d'email :

1. Allez sur https://supabase.com
2. Sélectionnez votre projet
3. **Authentication** → **Settings** → **Email Auth**
4. Désactivez **"Enable email confirmations"** (pour le développement)
5. Sauvegardez

## 📋 Checklist

- [ ] L'URL Supabase correspond au projet utilisé
- [ ] La clé anon correspond au même projet que l'URL
- [ ] La confirmation d'email est désactivée (pour le développement)
- [ ] Les variables sont configurées dans Render
- [ ] Le service a été redéployé après les modifications

## ✅ Après correction

1. Redéployez le service sur Render
2. Essayez de vous inscrire à nouveau
3. L'erreur 401 devrait disparaître
