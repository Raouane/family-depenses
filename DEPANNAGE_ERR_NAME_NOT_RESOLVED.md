# 🔧 Dépannage : ERR_NAME_NOT_RESOLVED

## ⚠️ Erreur

```
Failed to load resource: net::ERR_NAME_NOT_RESOLVED
dizcnsohvipeqdelmecb.supabase.co/auth/v1/token?grant_type=password
```

## 🔍 Causes possibles

### 1. Le projet Supabase n'existe pas ou a été supprimé

Le projet `dizcnsohvipeqdelmecb` peut ne plus exister dans Supabase.

**Solution** : Vérifier dans Supabase :
1. Allez sur https://supabase.com
2. Vérifiez si le projet `dizcnsohvipeqdelmecb` existe dans votre liste de projets
3. Si le projet n'existe pas, vous devez :
   - Soit créer un nouveau projet
   - Soit utiliser un projet existant

### 2. Le projet est suspendu

Le projet peut être suspendu (paiement, inactivité, etc.).

**Solution** :
1. Dans Supabase, vérifiez l'état du projet
2. Si suspendu, réactivez-le ou créez un nouveau projet

### 3. URL incorrecte dans la configuration

L'URL peut être mal configurée (manque `https://`).

**Solution** : Vérifier dans Render que `VITE_SUPABASE_URL` est exactement :
```
https://dizcnsohvipeqdelmecb.supabase.co
```

## ✅ Solutions

### Solution 1 : Vérifier que le projet existe

1. Allez sur https://supabase.com
2. Connectez-vous
3. Vérifiez si le projet `dizcnsohvipeqdelmecb` apparaît dans votre liste
4. Si oui, cliquez dessus et vérifiez qu'il est **ACTIF**

### Solution 2 : Utiliser un projet existant

Si le projet `dizcnsohvipeqdelmecb` n'existe pas, utilisez un projet existant :

1. Dans Supabase, sélectionnez un projet existant (par exemple `lqdfioptcptinnxqshrj`)
2. **Settings** → **API**
3. Copiez :
   - **Project URL** → mettez à jour `VITE_SUPABASE_URL` dans Render
   - **anon public key** → mettez à jour `VITE_SUPABASE_ANON_KEY` dans Render
   - **service_role key** → mettez à jour `SUPABASE_SERVICE_ROLE_KEY` dans Render
4. **Settings** → **Database** → **Connection string** → mettez à jour `DATABASE_URL` dans Render
5. **Redéployez** le service

### Solution 3 : Créer un nouveau projet Supabase

Si aucun projet n'existe :

1. Allez sur https://supabase.com
2. Cliquez sur **"New Project"**
3. Remplissez les informations :
   - **Name** : Family Depenses (ou autre)
   - **Database Password** : Choisissez un mot de passe fort
   - **Region** : Choisissez la région la plus proche
4. Attendez 2-3 minutes que le projet soit créé
5. Une fois créé :
   - **Settings** → **API** → Copiez l'URL et les clés
   - **Settings** → **Database** → Copiez la Connection string
6. Mettez à jour toutes les variables dans Render :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL`
7. **Redéployez** le service

### Solution 4 : Vérifier l'URL dans le code

Si l'URL semble correcte mais ne fonctionne toujours pas, testez manuellement :

1. Ouvrez votre navigateur
2. Allez sur : `https://dizcnsohvipeqdelmecb.supabase.co/rest/v1/`
3. Si vous voyez une erreur JSON (même une erreur), l'URL est accessible
4. Si vous voyez "This site can't be reached" ou "ERR_NAME_NOT_RESOLVED", le projet n'existe pas

## 🔍 Test rapide

Pour tester si le projet existe :

```bash
# Dans PowerShell
Test-NetConnection -ComputerName dizcnsohvipeqdelmecb.supabase.co -Port 443
```

Si cela échoue, le projet n'existe probablement pas.

## 📋 Checklist

- [ ] Le projet `dizcnsohvipeqdelmecb` existe dans Supabase
- [ ] Le projet est **ACTIF** (pas suspendu)
- [ ] L'URL dans Render commence par `https://`
- [ ] Toutes les variables sont configurées pour le même projet
- [ ] Le service a été redéployé après les modifications

## ✅ Recommandation

**Utilisez le projet `lqdfioptcptinnxqshrj`** qui semble être votre projet principal (celui utilisé dans `DATABASE_URL`).

1. Dans Render, mettez à jour toutes les variables pour utiliser `lqdfioptcptinnxqshrj` :
   - `VITE_SUPABASE_URL` = `https://lqdfioptcptinnxqshrj.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = La clé anon de `lqdfioptcptinnxqshrj`
   - `SUPABASE_URL` = `https://lqdfioptcptinnxqshrj.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = La clé service_role de `lqdfioptcptinnxqshrj`
2. **Redéployez** le service

Cela simplifiera votre configuration en utilisant un seul projet pour tout.
