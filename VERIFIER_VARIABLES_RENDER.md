# 🔍 Vérifier les variables d'environnement dans Render

## ⚠️ Erreur

```
Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.
```

## 🔍 Causes possibles

1. **La variable contient des espaces ou des guillemets**
2. **Le build n'a pas été refait après avoir changé la variable**
3. **La variable n'est pas correctement définie dans Render**

## ✅ Solution : Vérifier et corriger dans Render

### Étape 1 : Vérifier la variable dans Render

1. Allez sur https://dashboard.render.com
2. Sélectionnez votre **Web Service**
3. Cliquez sur **"Environment"** dans le menu de gauche
4. Vérifiez la variable `VITE_SUPABASE_URL`

### Étape 2 : Corriger la valeur

La valeur doit être **exactement** :
```
https://dizcnsohvipeqdelmecb.supabase.co
```

**⚠️ Important** :
- ❌ **PAS** de guillemets : `"https://..."`
- ❌ **PAS** d'espaces avant/après
- ✅ **Juste** l'URL : `https://dizcnsohvipeqdelmecb.supabase.co`

### Étape 3 : Vérifier toutes les variables

Assurez-vous que ces 3 variables sont définies **sans guillemets ni espaces** :

| Variable | Valeur (exacte) |
|----------|----------------|
| `VITE_API_URL` | `https://family-depenses.onrender.com/api` |
| `VITE_SUPABASE_URL` | `https://dizcnsohvipeqdelmecb.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpemNuc29odmlwZWRlcWxtZWNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MjU2NjMsImV4cCI6MjA4MzIwMTY2M30.YBSiby340upLgxcVNoI-rQXr3TAlJyDMZ59Xtj_WGb8` |

### Étape 4 : Redéployer

**⚠️ CRITIQUE** : Après avoir modifié les variables `VITE_*`, vous **DEVEZ** redéployer :

1. Dans Render, cliquez sur **"Manual Deploy"**
2. Sélectionnez **"Deploy latest commit"**
3. Attendez que le build se termine

## 🔍 Vérification après redéploiement

1. Attendez que le build se termine (peut prendre 2-5 minutes)
2. Rafraîchissez votre site : `https://family-depenses.onrender.com`
3. L'erreur devrait disparaître

## 📝 Note

Les variables `VITE_*` sont utilisées **pendant le BUILD**, pas au runtime. C'est pourquoi vous devez redéployer après chaque modification.
