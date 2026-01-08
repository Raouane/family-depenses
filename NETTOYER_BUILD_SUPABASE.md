# 🧹 Nettoyer le build Supabase

## ⚠️ Problème

L'erreur `ERR_NAME_NOT_RESOLVED` pour `dizcnsohvipeqdelmecb.supabase.co` indique que votre application déployée utilise encore l'**ancien build** avec Supabase.

## ✅ Solution : Rebuild et redéployer

### 1. Nettoyer le build local

```bash
# Supprimer les anciens builds
rm -rf dist
rm -rf node_modules
rm package-lock.json
```

Ou en PowerShell :
```powershell
Remove-Item -Recurse -Force dist, node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
```

### 2. Réinstaller les dépendances

```bash
npm install
```

### 3. Rebuild le frontend

```bash
npm run build
```

### 4. Vérifier que le build ne contient pas Supabase

Dans le dossier `dist/`, cherchez les références à Supabase :

```bash
# PowerShell
Select-String -Path "dist/**/*.js" -Pattern "supabase" -CaseSensitive:$false
```

Si vous trouvez des références, c'est qu'il y a encore du code Supabase quelque part.

### 5. Redéployer sur Render

1. **Commit et push** vos changements :
   ```bash
   git add .
   git commit -m "Migration vers JWT Auth - Suppression Supabase"
   git push
   ```

2. **Dans Render** :
   - Allez dans votre Web Service
   - Cliquez sur **"Manual Deploy"** → **"Deploy latest commit"**
   - Attendez que le build se termine

## 🔍 Vérification

Après redéploiement, vérifiez dans la console du navigateur :
- ❌ Plus d'erreur `ERR_NAME_NOT_RESOLVED`
- ❌ Plus de tentatives de connexion à `dizcnsohvipeqdelmecb.supabase.co`
- ✅ Les appels API vont vers `/api/auth/login` et `/api/auth/register`

## 📝 Note importante

Le problème vient du fait que Render utilise un **ancien build** qui contient encore le code Supabase. Un nouveau build et un redéploiement résoudront le problème.
