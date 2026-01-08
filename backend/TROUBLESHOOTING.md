# Dépannage - Erreur ENOTFOUND Supabase

## Problème
L'erreur `getaddrinfo ENOTFOUND db.lqdfioptcptinnxqshrj.supabase.co` signifie que le DNS ne peut pas résoudre le nom d'hôte Supabase.

## Solutions

### Solution 1 : Utiliser l'URL Pooler (Recommandé)

Au lieu de "Direct connection", utilisez "Session mode" ou "Transaction mode" :

1. Dans Supabase : **Settings > Database > Connection string**
2. Sélectionnez **"Session mode"** ou **"Transaction mode"**
3. L'URL ressemblera à :
   ```
   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
4. Copiez cette URL et mettez-la dans `backend/.env`

### Solution 2 : Vérifier l'état du projet

1. Allez sur https://supabase.com
2. Vérifiez que votre projet est **ACTIF** (pas suspendu)
3. Si suspendu, réactivez-le ou créez un nouveau projet

### Solution 3 : Vérifier la connexion internet

```powershell
# Tester la résolution DNS
nslookup db.lqdfioptcptinnxqshrj.supabase.co

# Tester la connexion
Test-NetConnection -ComputerName db.lqdfioptcptinnxqshrj.supabase.co -Port 5432
```

### Solution 4 : Créer un nouveau projet Supabase

Si le projet n'existe plus :

1. Allez sur https://supabase.com
2. Cliquez sur **"New Project"**
3. Remplissez les informations
4. Attendez 2-3 minutes pour la création
5. Copiez la nouvelle URL de connexion
6. Mettez à jour `backend/.env`

### Solution 5 : Encoder les caractères spéciaux dans le mot de passe

Si votre mot de passe contient des caractères spéciaux (`*`, `@`, `#`, etc.), encodez-les en URL :

- `*` devient `%2A`
- `@` devient `%40`
- `#` devient `%23`
- etc.

Exemple :
```
postgresql://postgres:Papa1930%2AMaman1951%2A@db.lqdfioptcptinnxqshrj.supabase.co:5432/postgres
```

## Après avoir corrigé l'URL

Exécutez la migration :
```bash
cd backend
npm run migrate
```
