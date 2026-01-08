-- Script de vérification des tables dans Supabase
-- Exécutez ce script dans le SQL Editor de Supabase

-- ============================================
-- 1. LISTE COMPLÈTE DE TOUTES LES TABLES
-- ============================================

SELECT 
    '📋 Toutes les tables' AS section,
    table_name AS nom_table,
    CASE 
        WHEN table_name IN ('users', 'groups', 'user_groups', 'expenses', 'expense_shares') 
        THEN '✅ Table attendue'
        WHEN table_name = 'user_balances'
        THEN '✅ Vue attendue'
        WHEN table_name IN ('restaurants', 'telegram_messages') 
        THEN '⚠️ Table indésirable'
        ELSE '❓ Table non prévue'
    END AS statut
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY 
    CASE 
        WHEN table_name IN ('users', 'groups', 'user_groups', 'expenses', 'expense_shares', 'user_balances') THEN 1
        WHEN table_name IN ('restaurants', 'telegram_messages') THEN 2
        ELSE 3
    END,
    table_name;

-- ============================================
-- 2. VÉRIFICATION DÉTAILLÉE DES TABLES ATTENDUES
-- ============================================

SELECT 
    '🔍 Détail des tables attendues' AS section,
    table_name AS nom_table,
    CASE 
        WHEN table_name = 'users' THEN 'Table des utilisateurs (liée à auth.users)'
        WHEN table_name = 'groups' THEN 'Table des groupes'
        WHEN table_name = 'user_groups' THEN 'Table de liaison utilisateurs-groupes'
        WHEN table_name = 'expenses' THEN 'Table des dépenses'
        WHEN table_name = 'expense_shares' THEN 'Table de répartition des dépenses'
        WHEN table_name = 'user_balances' THEN 'Vue calculant les soldes'
        ELSE 'Autre'
    END AS description,
    CASE 
        WHEN table_name IN ('users', 'groups', 'user_groups', 'expenses', 'expense_shares', 'user_balances')
        THEN '✅ Présente'
        ELSE '❌ Manquante'
    END AS statut
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name IN ('users', 'groups', 'user_groups', 'expenses', 'expense_shares', 'user_balances')
ORDER BY 
    CASE table_name
        WHEN 'users' THEN 1
        WHEN 'groups' THEN 2
        WHEN 'user_groups' THEN 3
        WHEN 'expenses' THEN 4
        WHEN 'expense_shares' THEN 5
        WHEN 'user_balances' THEN 6
    END;

-- ============================================
-- 3. TABLES INDÉSIRABLES À SUPPRIMER
-- ============================================

SELECT 
    '🗑️ Tables indésirables' AS section,
    table_name AS nom_table,
    '⚠️ À supprimer' AS statut
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name IN ('restaurants', 'telegram_messages');

-- ============================================
-- 4. STRUCTURE DE LA TABLE USERS
-- ============================================

SELECT 
    '📊 Structure de la table users' AS section,
    column_name AS colonne,
    data_type AS type,
    is_nullable AS nullable,
    column_default AS valeur_par_defaut
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- ============================================
-- 5. VÉRIFICATION DES CONTRAINTES DE CLÉ ÉTRANGÈRE
-- ============================================

SELECT 
    '🔗 Contraintes de clé étrangère' AS section,
    tc.table_name AS table_source,
    kcu.column_name AS colonne_source,
    ccu.table_name AS table_cible,
    ccu.column_name AS colonne_cible
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- ============================================
-- 6. VÉRIFICATION DES FONCTIONS
-- ============================================

SELECT 
    '⚙️ Fonctions SQL' AS section,
    routine_name AS nom_fonction,
    '✅ Présente' AS statut
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION'
AND routine_name IN ('calculate_expense_shares', 'get_group_summary')
ORDER BY routine_name;

-- ============================================
-- 7. RÉSUMÉ FINAL
-- ============================================

SELECT 
    '📈 Résumé' AS section,
    COUNT(*) FILTER (WHERE table_name IN ('users', 'groups', 'user_groups', 'expenses', 'expense_shares', 'user_balances')) AS tables_attendues,
    COUNT(*) FILTER (WHERE table_name IN ('restaurants', 'telegram_messages')) AS tables_indesirables,
    COUNT(*) FILTER (WHERE table_name NOT IN ('users', 'groups', 'user_groups', 'expenses', 'expense_shares', 'user_balances', 'restaurants', 'telegram_messages')) AS autres_tables
FROM information_schema.tables 
WHERE table_schema = 'public';
