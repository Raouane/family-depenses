# 🔧 Configurer les variables d'environnement sur Render (Frontend)

## ⚠️ Problème

Votre backend est déployé sur Render, mais le frontend a toujours l'erreur :
```
Variables d'environnement Supabase manquantes
```

**Cause** : Les variables d'environnement ne sont pas configurées dans Render pour le service frontend.

## ✅ Solution : Configurer les variables dans Render

### Si le frontend est déployé sur Render (Static Site)

1. **Allez sur https://dashboard.render.com**
2. **Sélectionnez votre service frontend** (Static Site)
3. Dans le menu de gauche, cliquez sur **"Environment"**
4. Cliquez sur **"Add Environment Variable"**

5. **Ajoutez ces variables** :

   | Variable | Valeur |
   |----------|--------|
   | `VITE_API_URL` | `https://family-depenses.onrender.com/api` |
   | `VITE_SUPABASE_URL` | `https://lqdfioptcptinnxqshrj.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpemNuc29odmlwZWRlcWxtZWNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MjU2NjMsImV4cCI6MjA4MzIwMTY2M30.YBSiby340upLgxcVNoI-rQXr3TAlJyDMZ59Xtj_WGb8` |

6. **Redéployez le service** :
   - Cliquez sur **"Manual Deploy"** → **"Deploy latest commit"**
   - Ou attendez le prochain déploiement automatique

### Si le frontend est en local

Assurez-vous que :
1. Le fichier `.env` est bien à la racine du projet
2. Le serveur a été **redémarré** après la modification du `.env`
3. Les variables sont bien présentes dans le fichier `.env`

## 📋 Variables à configurer

### Pour le Frontend (Static Site sur Render)

```env
VITE_API_URL=https://family-depenses.onrender.com/api
VITE_SUPABASE_URL=https://lqdfioptcptinnxqshrj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpemNuc29odmlwZWRlcWxtZWNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MjU2NjMsImV4cCI6MjA4MzIwMTY2M30.YBSiby340upLgxcVNoI-rQXr3TAlJyDMZ59Xtj_WGb8
```

### Pour le Backend (Web Service sur Render)

Ces variables devraient déjà être configurées :
- `DATABASE_URL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `FRONTEND_URL`

## 🔍 Vérification

Après avoir configuré les variables et redéployé :
1. Attendez que le déploiement se termine
2. Rafraîchissez votre site frontend
3. L'erreur devrait disparaître

## ⚠️ Note importante

Les variables d'environnement dans Render sont **différentes** du fichier `.env` local. Vous devez les configurer séparément dans le dashboard Render.
