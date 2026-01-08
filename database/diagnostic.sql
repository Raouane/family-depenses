-- Script de diagnostic - Vérifie l'état actuel de la base de données
-- Exécutez ce script dans le SQL Editor de Supabase

-- ============================================
-- 1. VÉRIFIER SI DES TABLES EXISTENT
-- ============================================

SELECT 
    'Nombre total de tables' AS info,
    COUNT(*) AS valeur
FROM information_schema.tables 
WHERE table_schema = 'public';

-- ============================================
-- 2. LISTER TOUTES LES TABLES (si elles existent)
-- ============================================

SELECT 
    'Toutes les tables' AS info,
    table_name AS nom_table,
    table_type AS type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- ============================================
-- 3. VÉRIFIER LES SCHÉMAS DISPONIBLES
-- ============================================

SELECT 
    'Schémas disponibles' AS info,
    schema_name AS nom_schema
FROM information_schema.schemata
WHERE schema_name NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
ORDER BY schema_name;

-- ============================================
-- 4. VÉRIFIER SI LA TABLE USERS EXISTE
-- ============================================

SELECT 
    'Table users existe?' AS info,
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'users'
        ) THEN '✅ OUI'
        ELSE '❌ NON'
    END AS statut;

-- ============================================
-- 5. VÉRIFIER SI LA TABLE GROUPS EXISTE
-- ============================================

SELECT 
    'Table groups existe?' AS info,
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'groups'
        ) THEN '✅ OUI'
        ELSE '❌ NON'
    END AS statut;

-- ============================================
-- 6. VÉRIFIER LES TABLES INDÉSIRABLES
-- ============================================

SELECT 
    'Table restaurants existe?' AS info,
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'restaurants'
        ) THEN '⚠️ OUI (à supprimer)'
        ELSE '✅ NON'
    END AS statut

UNION ALL

SELECT 
    'Table telegram_messages existe?' AS info,
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'telegram_messages'
        ) THEN '⚠️ OUI (à supprimer)'
        ELSE '✅ NON'
    END AS statut;
