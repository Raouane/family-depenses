# Guide d'exécution du script SQL dans Supabase

## 📋 Étapes pour exécuter `schema-supabase.sql`

### 1. Accéder au SQL Editor de Supabase

1. Allez sur **https://supabase.com**
2. Connectez-vous à votre compte
3. Sélectionnez votre projet
4. Dans le menu de gauche, cliquez sur **SQL Editor** (ou **SQL Editor** dans la section Database)

### 2. Créer une nouvelle requête

1. Cliquez sur le bouton **"New query"** (ou l'icône **+** en haut à gauche)
2. Un nouvel onglet s'ouvre avec un éditeur SQL vide

### 3. Copier le script SQL

1. Ouvrez le fichier `database/schema-supabase.sql` dans votre éditeur de code
2. Sélectionnez **TOUT** le contenu (Ctrl+A ou Cmd+A)
3. Copiez-le (Ctrl+C ou Cmd+C)

### 4. Coller et exécuter dans Supabase

1. Dans l'éditeur SQL de Supabase, collez le script (Ctrl+V ou Cmd+V)
2. Vérifiez que tout le script est bien collé
3. Cliquez sur le bouton **"Run"** (ou appuyez sur **Ctrl+Enter** / **Cmd+Enter**)
4. Attendez que l'exécution se termine (quelques secondes)

### 5. Vérifier que les tables ont été créées

Dans le SQL Editor, exécutez cette requête pour voir toutes les tables :

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Vous devriez voir ces tables :
- ✅ `expense_shares`
- ✅ `expenses`
- ✅ `groups`
- ✅ `user_groups`
- ✅ `users`

### 6. Vérifier les fonctions et vues

Pour vérifier que les fonctions ont été créées :

```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION';
```

Vous devriez voir :
- ✅ `calculate_expense_shares`
- ✅ `get_group_summary`

Pour vérifier les vues :

```sql
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public';
```

Vous devriez voir :
- ✅ `user_balances`

## ⚠️ Problèmes courants

### Erreur "extension uuid-ossp does not exist"

- **Solution** : Cette extension est déjà activée par défaut sur Supabase. Vous pouvez ignorer cette erreur ou supprimer la ligne `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

### Erreur "relation already exists"

- **Cause** : Les tables existent déjà
- **Solution** : 
  - Soit supprimez les tables existantes d'abord
  - Soit ignorez l'erreur (les `CREATE TABLE IF NOT EXISTS` ne créeront pas de doublons)

### Erreur "foreign key constraint"

- **Cause** : La table `users` référence `auth.users(id)` qui n'existe peut-être pas encore
- **Solution** : C'est normal, `auth.users` est géré par Supabase Auth. L'erreur ne devrait pas se produire si vous utilisez `CREATE TABLE IF NOT EXISTS`

### Erreur de permissions

- **Cause** : Vous n'êtes pas connecté avec un compte administrateur
- **Solution** : Assurez-vous d'être connecté avec le compte propriétaire du projet Supabase

## ✅ Vérification finale

Pour vérifier que tout fonctionne, testez la fonction `get_group_summary` :

```sql
-- Cette requête devrait fonctionner même sans données
SELECT * FROM get_group_summary('00000000-0000-0000-0000-000000000000'::UUID);
```

Si vous obtenez un résultat vide (pas d'erreur), c'est que tout est correctement configuré ! 🎉

## 📝 Prochaines étapes

Une fois le schéma créé :

1. **Configurer les variables d'environnement** (voir `SUPABASE_AUTH_SETUP.md`)
2. **Créer votre premier utilisateur** via l'interface d'inscription de l'application
3. **Tester l'application** en créant un groupe et des dépenses
