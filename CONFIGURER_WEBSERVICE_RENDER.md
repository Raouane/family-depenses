# 🔧 Configurer les variables d'environnement dans le Web Service Render

## ⚠️ Problème

Votre backend est déployé sur Render en Web Service, mais le frontend a toujours l'erreur :
```
Variables d'environnement Supabase manquantes
```

**Cause** : Les variables d'environnement `VITE_*` doivent être disponibles **pendant le BUILD** du frontend, pas seulement au runtime.

## ✅ Solution : Ajouter les variables dans le Web Service

### Étapes

1. **Allez sur https://dashboard.render.com**
2. **Sélectionnez votre Web Service** (celui qui sert le backend et le frontend)
3. Dans le menu de gauche, cliquez sur **"Environment"**
4. Cliquez sur **"Add Environment Variable"**

5. **Ajoutez ces variables** (en plus de celles déjà présentes) :

   | Variable | Valeur |
   |----------|--------|
   | `VITE_API_URL` | `https://family-depenses.onrender.com/api` |
   | `VITE_SUPABASE_URL` | `https://lqdfioptcptinnxqshrj.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpemNuc29odmlwZWRlcWxtZWNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MjU2NjMsImV4cCI6MjA4MzIwMTY2M30.YBSiby340upLgxcVNoI-rQXr3TAlJyDMZ59Xtj_WGb8` |

6. **Redéployez le service** :
   - Cliquez sur **"Manual Deploy"** → **"Deploy latest commit"**
   - ⚠️ **Important** : Le redéploiement est nécessaire car Vite utilise ces variables pendant le BUILD

## 📋 Variables complètes pour le Web Service

### Variables Backend (déjà configurées normalement)

```env
DATABASE_URL=postgresql://postgres.lqdfioptcptinnxqshrj:[MOT-DE-PASSE]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://family-depenses.onrender.com
SUPABASE_URL=https://lqdfioptcptinnxqshrj.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb_publishable_SVOkmGcIU9EkNqLqCeMBzg_7IN4ZEpl
```

### Variables Frontend (à ajouter)

```env
VITE_API_URL=https://family-depenses.onrender.com/api
VITE_SUPABASE_URL=https://lqdfioptcptinnxqshrj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpemNuc29odmlwZWRlcWxtZWNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MjU2NjMsImV4cCI6MjA4MzIwMTY2M30.YBSiby340upLgxcVNoI-rQXr3TAlJyDMZ59Xtj_WGb8
```

## 🔍 Comment ça fonctionne

1. **Build** : Render exécute `npm run build:all`
   - Vite construit le frontend en utilisant les variables `VITE_*`
   - Les variables sont **injectées dans le code** pendant le build
   - Le résultat est dans `dist/`

2. **Start** : Le backend démarre et sert :
   - Les fichiers statiques depuis `dist/`
   - Les routes API sur `/api/*`

## ⚠️ Important

- Les variables `VITE_*` sont utilisées **pendant le BUILD**, pas au runtime
- Vous **DEVEZ redéployer** après avoir ajouté/modifié ces variables
- Le redéploiement reconstruira le frontend avec les nouvelles variables

## 🔍 Vérification

Après avoir :
1. ✅ Ajouté les 3 variables `VITE_*`
2. ✅ Redéployé le service

Attendez que le build se termine, puis :
- Rafraîchissez votre site : `https://family-depenses.onrender.com`
- L'erreur devrait disparaître

## 📝 Note

Si vous modifiez les variables `VITE_*` plus tard, vous devrez **toujours redéployer** pour que les changements soient pris en compte.
