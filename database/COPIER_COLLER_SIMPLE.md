# 🚀 Guide Simple : Créer les Tables (Copier-Coller)

## ⚡ Méthode la plus simple et sûre

### Étape 1 : Ouvrir Supabase
1. Allez sur **https://supabase.com**
2. Connectez-vous
3. Sélectionnez votre projet

### Étape 2 : Ouvrir le SQL Editor
1. Dans le menu de gauche, cliquez sur **"SQL Editor"**
2. Cliquez sur **"New query"** (ou l'icône **+** en haut)

### Étape 3 : Copier le Script
1. Ouvrez le fichier : `database/schema-supabase.sql`
2. **Sélectionnez TOUT** (Ctrl+A ou Cmd+A)
3. **Copiez** (Ctrl+C ou Cmd+C)

### Étape 4 : Coller et Exécuter
1. Dans l'éditeur SQL de Supabase, **collez** (Ctrl+V ou Cmd+V)
2. Vérifiez que tout le script est bien collé
3. Cliquez sur le bouton **"Run"** (ou appuyez sur **Ctrl+Enter**)

### Étape 5 : Vérifier
Vous devriez voir : **"Success. No rows returned"** ou un message de succès.

## ✅ Vérification Rapide

Après l'exécution, créez une nouvelle requête et exécutez :

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
- `user_balances` (vue)
- `user_groups`
- `users`

## 🎯 C'est tout !

Si vous voyez ces 6 tables/vues, tout est correct ! ✅
