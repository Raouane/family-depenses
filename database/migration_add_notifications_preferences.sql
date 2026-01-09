-- Migration: Ajout des préférences de notifications
-- À exécuter dans Supabase SQL Editor
-- 
-- ⚠️ IMPORTANT: Les notifications sont ACTIVÉES par défaut pour tous les utilisateurs

-- Ajouter la colonne notifications_enabled à la table users
-- Par défaut, les notifications sont ACTIVÉES (TRUE)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS notifications_enabled BOOLEAN DEFAULT TRUE;

-- Mettre à jour tous les utilisateurs existants pour activer les notifications par défaut
-- Cela garantit que même les utilisateurs créés avant cette migration ont les notifications activées
UPDATE users 
SET notifications_enabled = TRUE 
WHERE notifications_enabled IS NULL;

-- Mettre à jour la fonction create_group_notification pour respecter les préférences
CREATE OR REPLACE FUNCTION create_group_notification(
    p_group_id UUID,
    p_author_user_id UUID,
    p_type VARCHAR,
    p_title VARCHAR,
    p_message TEXT,
    p_related_expense_id UUID DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    INSERT INTO notifications (user_id, group_id, type, title, message, related_expense_id)
    SELECT 
        ug.user_id,
        p_group_id,
        p_type,
        p_title,
        p_message,
        p_related_expense_id
    FROM user_groups ug
    JOIN users u ON ug.user_id = u.id
    WHERE ug.group_id = p_group_id
    AND ug.user_id != p_author_user_id -- Ne pas notifier l'auteur de l'action
    AND COALESCE(u.notifications_enabled, TRUE) = TRUE; -- Respecter les préférences utilisateur
END;
$$ LANGUAGE plpgsql;
