# Guide de vérification des tables

## 🚀 Vérification rapide

Pour une vérification rapide, utilisez `quick-check.sql` :

1. Ouvrez le **SQL Editor** dans Supabase
2. Créez une nouvelle requête
3. Copiez-collez le contenu de `database/quick-check.sql`
4. Exécutez (Run ou Ctrl+Enter)

## 📊 Vérification complète

Pour une vérification détaillée avec toutes les informations, utilisez `check-tables.sql` :

1. Ouvrez le **SQL Editor** dans Supabase
2. Créez une nouvelle requête
3. Copiez-collez le contenu de `database/check-tables.sql`
4. Exécutez le script

Ce script affiche :
- ✅ Liste complète de toutes les tables
- ✅ Détail des tables attendues
- ⚠️ Tables indésirables à supprimer
- 📊 Structure de la table users
- 🔗 Contraintes de clé étrangère
- ⚙️ Fonctions SQL
- 📈 Résumé final

## ✅ Tables attendues

Votre base de données devrait contenir ces tables :

1. **`users`** - Table des utilisateurs (liée à `auth.users.id`)
2. **`groups`** - Table des groupes
3. **`user_groups`** - Table de liaison utilisateurs-groupes
4. **`expenses`** - Table des dépenses
5. **`expense_shares`** - Table de répartition des dépenses
6. **`user_balances`** - Vue calculant les soldes

## ⚠️ Tables indésirables

Ces tables ne devraient **PAS** être présentes :

- ❌ `restaurants`
- ❌ `telegram_messages`

## 🔧 Si des tables sont manquantes ou indésirables

1. Exécutez `database/cleanup-and-fix.sql` pour :
   - Supprimer les tables indésirables
   - Créer les tables manquantes
   - Créer les index, fonctions et vues

2. Vérifiez ensuite avec `database/verification.sql` ou `database/check-tables.sql`

## 📝 Exemple de résultat attendu

Après exécution de `quick-check.sql`, vous devriez voir :

```
Nom de la table        | Statut
-----------------------|------------------
users                  | ✅ Table attendue
groups                 | ✅ Table attendue
user_groups            | ✅ Table attendue
expenses               | ✅ Table attendue
expense_shares         | ✅ Table attendue
user_balances          | ✅ Vue attendue
```

Si vous voyez `restaurants` ou `telegram_messages` avec le statut "⚠️ À supprimer", exécutez `cleanup-and-fix.sql`.
