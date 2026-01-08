# Configuration Supabase pour FamilySplit

## Étape 1 : Obtenir l'URL de connexion

1. Allez sur https://supabase.com et connectez-vous
2. Sélectionnez votre projet (ou créez-en un nouveau)
3. Allez dans **Settings** (Paramètres) > **Database**
4. Dans la section **Connection string**, sélectionnez **URI**
5. Copiez l'URL qui ressemble à :
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
   
   **OU** (mode direct) :
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

## Étape 2 : Mettre à jour le fichier .env

Ouvrez `backend/.env` et remplacez la ligne `DATABASE_URL` par votre URL Supabase :

```env
DATABASE_URL=postgresql://postgres:[VOTRE-MOT-DE-PASSE]@db.[PROJECT-REF].supabase.co:5432/postgres
```

**Important** : Remplacez `[VOTRE-MOT-DE-PASSE]` et `[PROJECT-REF]` par vos vraies valeurs.

## Étape 3 : Créer les tables dans Supabase

1. Dans votre dashboard Supabase, allez dans **SQL Editor**
2. Cliquez sur **New query**
3. Copiez tout le contenu du fichier `database/schema.sql`
4. Collez-le dans l'éditeur SQL
5. Cliquez sur **Run** (ou appuyez sur Ctrl+Enter)

## Étape 4 : Vérifier les tables

Dans le SQL Editor, exécutez :
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

Vous devriez voir :
- users
- groups
- user_groups
- expenses
- expense_shares

## Étape 5 : Redémarrer le backend

```bash
cd backend
npm run dev
```

## Problèmes courants

### Erreur ENOTFOUND
- Vérifiez que l'URL de connexion est correcte
- Vérifiez que votre projet Supabase est actif (pas suspendu)
- Vérifiez votre connexion internet

### Erreur d'authentification
- Vérifiez que le mot de passe dans l'URL est correct
- Le mot de passe peut contenir des caractères spéciaux qui doivent être encodés en URL (%40 pour @, etc.)

### Extension uuid-ossp non disponible
Supabase a déjà l'extension activée, mais si vous avez une erreur, exécutez :
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```
