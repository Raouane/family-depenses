# Solution : Aucune table trouvée

## 🔍 Diagnostic

Si vous obtenez "Success. No rows returned" après avoir exécuté le script de vérification, cela signifie que **aucune table n'existe encore** dans votre base de données Supabase.

## ✅ Solution : Créer les tables

Vous devez exécuter le script de création des tables. Voici les étapes :

### Option 1 : Script complet (Recommandé)

1. **Ouvrez le SQL Editor** dans Supabase
2. **Créez une nouvelle requête**
3. **Copiez-collez** le contenu de `database/schema-supabase.sql`
4. **Exécutez** le script (Run ou Ctrl+Enter)

Ce script va créer :
- ✅ Toutes les tables nécessaires
- ✅ Les index pour les performances
- ✅ Les fonctions SQL
- ✅ La vue `user_balances`

### Option 2 : Script de nettoyage et création

Si vous avez des tables indésirables ou des tables partiellement créées :

1. **Ouvrez le SQL Editor** dans Supabase
2. **Créez une nouvelle requête**
3. **Copiez-collez** le contenu de `database/cleanup-and-fix.sql`
4. **Exécutez** le script

Ce script va :
- 🗑️ Supprimer les tables indésirables (`restaurants`, `telegram_messages`)
- ✅ Créer les tables manquantes
- ✅ Créer les index, fonctions et vues

## 📋 Vérification après création

Après avoir exécuté le script de création, exécutez `database/diagnostic.sql` pour vérifier que tout est correct :

1. **Ouvrez le SQL Editor**
2. **Créez une nouvelle requête**
3. **Copiez-collez** le contenu de `database/diagnostic.sql`
4. **Exécutez** le script

Vous devriez voir :
- ✅ Nombre total de tables : 5 ou 6
- ✅ Liste des tables avec leurs noms
- ✅ Table users existe? : ✅ OUI
- ✅ Table groups existe? : ✅ OUI
- ✅ Tables indésirables : ✅ NON

## 🎯 Ordre d'exécution recommandé

1. **Première fois** : Exécutez `schema-supabase.sql`
2. **Vérification** : Exécutez `diagnostic.sql`
3. **Si problèmes** : Exécutez `cleanup-and-fix.sql`
4. **Vérification finale** : Exécutez `check-tables.sql`

## ⚠️ Note importante

Si vous avez déjà des données dans certaines tables, faites attention :
- Le script `schema-supabase.sql` utilise `CREATE TABLE IF NOT EXISTS`, donc il ne supprimera pas les données existantes
- Le script `cleanup-and-fix.sql` supprime les tables indésirables avec `DROP TABLE IF EXISTS CASCADE`
