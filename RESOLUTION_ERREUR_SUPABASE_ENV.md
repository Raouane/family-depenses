# 🔧 Résolution : Erreur "Variables d'environnement Supabase manquantes"

## ⚠️ Problème

L'erreur `Variables d'environnement Supabase manquantes` apparaît car :
1. **Le build déployé** contient encore l'ancien code Supabase
2. **Le cache du navigateur** charge l'ancien JavaScript

## ✅ Solution complète

### Étape 1 : Vérifier que le code source est propre

✅ **Déjà fait** : Le code source ne contient plus de références à Supabase.

### Étepe 2 : Commit et push

```bash
git add .
git commit -m "Migration JWT - Suppression complète Supabase"
git push
```

### Étape 3 : Redéployer sur Render

1. Allez sur https://dashboard.render.com
2. Sélectionnez votre **Web Service**
3. Cliquez sur **"Manual Deploy"** → **"Deploy latest commit"**
4. ⚠️ **Attendez 2-5 minutes** que le build se termine

### Étape 4 : Vider le cache du navigateur

**CRITIQUE** : Le navigateur cache l'ancien JavaScript. Vous devez le vider :

#### Option 1 : Rechargement forcé
- Appuyez sur **Ctrl + F5** (Windows) ou **Cmd + Shift + R** (Mac)

#### Option 2 : Vider le cache manuellement
1. Appuyez sur **F12** pour ouvrir les DevTools
2. Clic droit sur le bouton de rechargement
3. Sélectionnez **"Vider le cache et effectuer une actualisation forcée"**

#### Option 3 : Mode navigation privée
- Ouvrez votre site en **navigation privée** (Ctrl+Shift+N) pour tester sans cache

### Étape 5 : Vérifier

Après redéploiement et vidage du cache :
- ✅ Plus d'erreur "Variables d'environnement Supabase manquantes"
- ✅ Les appels API vont vers `/api/auth/login` (pas vers Supabase)
- ✅ L'application fonctionne avec JWT

## 📝 Note importante

**Vous n'avez plus besoin** des variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` car vous utilisez maintenant JWT. Si elles sont encore dans Render, vous pouvez les supprimer (mais ce n'est pas obligatoire).

## 🔍 Si l'erreur persiste

1. Vérifiez que le build sur Render s'est bien terminé
2. Attendez 1-2 minutes supplémentaires (le CDN peut mettre du temps à se mettre à jour)
3. Videz complètement le cache : Ctrl+Shift+Delete → "Tout le temps" → "Images et fichiers en cache"
