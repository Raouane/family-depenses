-- Vérification rapide des tables - Version simple
-- Copiez-collez ce script dans le SQL Editor de Supabase

-- Liste toutes les tables avec leur statut
SELECT 
    table_name AS "Nom de la table",
    CASE 
        WHEN table_name IN ('users', 'groups', 'user_groups', 'expenses', 'expense_shares') 
        THEN '✅ Table attendue'
        WHEN table_name = 'user_balances'
        THEN '✅ Vue attendue'
        WHEN table_name IN ('restaurants', 'telegram_messages') 
        THEN '⚠️ À supprimer'
        ELSE '❓ Table non prévue'
    END AS "Statut"
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY 
    CASE 
        WHEN table_name IN ('users', 'groups', 'user_groups', 'expenses', 'expense_shares', 'user_balances') THEN 1
        WHEN table_name IN ('restaurants', 'telegram_messages') THEN 2
        ELSE 3
    END,
    table_name;
