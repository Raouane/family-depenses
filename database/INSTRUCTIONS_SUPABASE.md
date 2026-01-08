# Instructions pour créer les tables dans Supabase

## Étapes détaillées

### 1. Ouvrir le SQL Editor dans Supabase

1. Allez sur https://supabase.com
2. Connectez-vous à votre compte
3. Sélectionnez votre projet
4. Dans le menu de gauche, cliquez sur **SQL Editor**

### 2. Créer une nouvelle requête

1. Cliquez sur le bouton **"New query"** (ou l'icône +)
2. Un nouvel onglet s'ouvre avec un éditeur SQL vide

### 3. Copier le script SQL

1. Ouvrez le fichier `database/schema-supabase.sql` dans votre éditeur de code
2. Sélectionnez **TOUT** le contenu (Ctrl+A)
3. Copiez-le (Ctrl+C)

### 4. Coller et exécuter dans Supabase

1. Dans l'éditeur SQL de Supabase, collez le script (Ctrl+V)
2. Cliquez sur le bouton **"Run"** (ou appuyez sur Ctrl+Enter)
3. Attendez que l'exécution se termine (quelques secondes)

### 5. Vérifier que les tables ont été créées

Dans le SQL Editor, exécutez cette requête pour voir toutes les tables :

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Vous devriez voir :
- `expense_shares`
- `expenses`
- `groups`
- `user_groups`
- `users`

### 6. Vérifier les données d'exemple

Pour vérifier que les données d'exemple ont été insérées :

```sql
-- Vérifier les utilisateurs
SELECT * FROM users;

-- Vérifier le groupe
SELECT * FROM groups;

-- Vérifier les membres du groupe
SELECT u.name, g.name as group_name
FROM user_groups ug
JOIN users u ON ug.user_id = u.id
JOIN groups g ON ug.group_id = g.id;
```

## Problèmes courants

### Erreur "extension uuid-ossp does not exist"
- Supabase a déjà cette extension activée, l'erreur peut être ignorée
- Ou supprimez la ligne `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

### Erreur "relation already exists"
- Les tables existent déjà
- Vous pouvez soit les supprimer d'abord, soit ignorer l'erreur (les `CREATE TABLE IF NOT EXISTS` ne créeront pas de doublons)

### Erreur de permissions
- Assurez-vous d'être connecté avec un compte administrateur du projet Supabase

## Après la création des tables

Une fois les tables créées, vous pouvez :
1. Mettre à jour le fichier `backend/.env` avec votre URL Supabase complète
2. Redémarrer le backend : `cd backend && npm run dev`
3. L'application devrait maintenant fonctionner !
