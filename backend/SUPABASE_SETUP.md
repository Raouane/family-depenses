# Configuration Supabase

## Étapes pour utiliser Supabase

1. **Obtenir l'URL de connexion depuis votre dashboard Supabase** :
   - Allez sur https://supabase.com
   - Connectez-vous à votre projet
   - Allez dans Settings > Database
   - Copiez la "Connection string" (URI mode)

2. **Format de l'URL Supabase** :
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

3. **Mettre à jour le fichier `.env`** :
   ```env
   DATABASE_URL=postgresql://postgres:[VOTRE-MOT-DE-PASSE]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

4. **Créer les tables dans Supabase** :
   - Allez dans SQL Editor dans votre dashboard Supabase
   - Copiez le contenu de `database/schema.sql`
   - Exécutez le script SQL

5. **Redémarrer le backend** :
   ```bash
   cd backend
   npm run dev
   ```

## Vérification

Si vous voyez l'erreur `ENOTFOUND`, cela signifie :
- Le projet Supabase n'existe plus ou a été supprimé
- L'URL de connexion est incorrecte
- Il y a un problème de connexion internet

Dans ce cas, utilisez l'Option 2 (PostgreSQL local).
