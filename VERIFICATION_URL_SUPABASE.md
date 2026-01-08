# ✅ Vérification de l'URL Supabase

## URL configurée

```
https://dizcnsohvipeqdelmecb.supabase.co
```

## 📋 Checklist de configuration

### 1. Variables dans Render (Web Service)

Dans Render → Web Service → Environment, vérifiez :

| Variable | Valeur attendue |
|----------|----------------|
| `VITE_SUPABASE_URL` | `https://dizcnsohvipeqdelmecb.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | La clé anon du projet `dizcnsohvipeqdelmecb` |

### 2. Variables Backend dans Render

| Variable | Valeur attendue |
|----------|----------------|
| `SUPABASE_URL` | `https://dizcnsohvipeqdelmecb.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | La clé service_role du projet `dizcnsohvipeqdelmecb` |

### 3. Vérifier dans Supabase

1. Allez sur https://supabase.com
2. Sélectionnez le projet **`dizcnsohvipeqdelmecb`**
3. **Settings** → **API**
4. Vérifiez que :
   - **Project URL** = `https://dizcnsohvipeqdelmecb.supabase.co`
   - **anon public key** = correspond à `VITE_SUPABASE_ANON_KEY`
   - **service_role key** = correspond à `SUPABASE_SERVICE_ROLE_KEY`

## 🔍 Test rapide

Pour tester si l'URL est correcte, vous pouvez :

1. Ouvrir dans votre navigateur : `https://dizcnsohvipeqdelmecb.supabase.co/rest/v1/`
2. Vous devriez voir une réponse JSON (même si c'est une erreur, cela confirme que l'URL est accessible)

## ✅ Après configuration

1. Redéployez le service sur Render
2. Testez l'inscription/connexion
3. L'erreur 401 devrait être résolue
