-- Script de vérification - À exécuter après cleanup-and-fix.sql
-- Vérifie que toutes les tables nécessaires sont présentes et que les indésirables sont supprimées

-- ============================================
-- VÉRIFICATION 1 : Tables attendues
-- ============================================

SELECT 
    'Tables attendues' AS verification_type,
    table_name,
    CASE 
        WHEN table_name IN ('users', 'groups', 'user_groups', 'expenses', 'expense_shares') 
        THEN '✅ Présente'
        ELSE '❌ Manquante'
    END AS status
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name IN ('users', 'groups', 'user_groups', 'expenses', 'expense_shares')
ORDER BY table_name;

-- ============================================
-- VÉRIFICATION 2 : Tables indésirables
-- ============================================

SELECT 
    'Tables indésirables' AS verification_type,
    table_name,
    CASE 
        WHEN table_name IN ('restaurants', 'telegram_messages') 
        THEN '⚠️ À supprimer'
        ELSE '✅ OK'
    END AS status
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name IN ('restaurants', 'telegram_messages');

-- ============================================
-- VÉRIFICATION 3 : Vues attendues
-- ============================================

SELECT 
    'Vues attendues' AS verification_type,
    table_name AS view_name,
    CASE 
        WHEN table_name = 'user_balances' 
        THEN '✅ Présente'
        ELSE '❌ Manquante'
    END AS status
FROM information_schema.views 
WHERE table_schema = 'public'
AND table_name = 'user_balances';

-- ============================================
-- VÉRIFICATION 4 : Fonctions attendues
-- ============================================

SELECT 
    'Fonctions attendues' AS verification_type,
    routine_name AS function_name,
    CASE 
        WHEN routine_name IN ('calculate_expense_shares', 'get_group_summary') 
        THEN '✅ Présente'
        ELSE '❌ Manquante'
    END AS status
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION'
AND routine_name IN ('calculate_expense_shares', 'get_group_summary')
ORDER BY routine_name;

-- ============================================
-- RÉSUMÉ : Liste complète des tables
-- ============================================

SELECT 
    'Résumé complet' AS verification_type,
    table_name,
    CASE 
        WHEN table_name IN ('users', 'groups', 'user_groups', 'expenses', 'expense_shares', 'user_balances') 
        THEN '✅ Table/Vue attendue'
        WHEN table_name IN ('restaurants', 'telegram_messages') 
        THEN '⚠️ Table indésirable'
        ELSE '❓ Table non prévue'
    END AS status
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY 
    CASE 
        WHEN table_name IN ('users', 'groups', 'user_groups', 'expenses', 'expense_shares', 'user_balances') THEN 1
        WHEN table_name IN ('restaurants', 'telegram_messages') THEN 2
        ELSE 3
    END,
    table_name;
