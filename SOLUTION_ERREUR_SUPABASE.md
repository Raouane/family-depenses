# 🔧 Solution : Erreur Supabase dans le build déployé

## ⚠️ Problème

L'erreur `ERR_NAME_NOT_RESOLVED` pour `dizcnsohvipeqdelmecb.supabase.co` indique que votre application **déployée sur Render** utilise encore l'ancien build avec Supabase.

## ✅ Solution : Rebuild et redéployer

### 1. Vérifier que le code source est propre

Le code source est maintenant propre (pas de références à Supabase). Le problème vient du **build déployé**.

### 2. Commit et push les changements

```bash
git add .
git commit -m "Migration vers JWT Auth - Suppression complète de Supabase"
git push
```

### 3. Redéployer sur Render

1. Allez sur https://dashboard.render.com
2. Sélectionnez votre Web Service
3. Cliquez sur **"Manual Deploy"** → **"Deploy latest commit"**
4. ⚠️ **Important** : Attendez que le build se termine complètement (2-5 minutes)

### 4. Vider le cache du navigateur

Après le redéploiement, videz le cache de votre navigateur :
- **Chrome/Edge** : Ctrl+Shift+Delete → Cochez "Images et fichiers en cache" → Effacer
- Ou utilisez **Ctrl+F5** pour forcer le rechargement

## 🔍 Vérification

Après redéploiement et vidage du cache :

1. Ouvrez la console du navigateur (F12)
2. Allez sur votre site
3. Vérifiez qu'il n'y a **plus** d'erreurs `ERR_NAME_NOT_RESOLVED`
4. Vérifiez que les appels API vont vers `/api/auth/login` (pas vers Supabase)

## 📝 Note

Le build local a été nettoyé. Il faut maintenant que Render reconstruise l'application avec le nouveau code sans Supabase.
