-- Script de nettoyage et correction pour Supabase
-- Supprime les tables indésirables et crée les tables manquantes

-- ============================================
-- ÉTAPE 1 : Supprimer les tables indésirables
-- ============================================

-- Supprimer la table restaurants (si elle existe)
DROP TABLE IF EXISTS restaurants CASCADE;

-- Supprimer la table telegram_messages (si elle existe)
DROP TABLE IF EXISTS telegram_messages CASCADE;

-- ============================================
-- ÉTAPE 2 : Créer les tables manquantes
-- ============================================

-- Table des groupes (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des dépenses (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    date DATE NOT NULL,
    paid_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    category VARCHAR(50),
    receipt_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table de répartition des dépenses (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS expense_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    share_amount DECIMAL(10, 2) NOT NULL CHECK (share_amount >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(expense_id, user_id)
);

-- ============================================
-- ÉTAPE 3 : Créer les index manquants
-- ============================================

CREATE INDEX IF NOT EXISTS idx_expenses_group_id ON expenses(group_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_paid_by ON expenses(paid_by_user_id);
CREATE INDEX IF NOT EXISTS idx_expense_shares_expense_id ON expense_shares(expense_id);
CREATE INDEX IF NOT EXISTS idx_expense_shares_user_id ON expense_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_user_groups_user_id ON user_groups(user_id);
CREATE INDEX IF NOT EXISTS idx_user_groups_group_id ON user_groups(group_id);

-- ============================================
-- ÉTAPE 4 : Créer les fonctions manquantes
-- ============================================

-- Fonction pour calculer automatiquement les parts lors de la création d'une dépense
CREATE OR REPLACE FUNCTION calculate_expense_shares(
    p_expense_id UUID,
    p_total_amount DECIMAL,
    p_participant_ids UUID[]
) RETURNS VOID AS $$
DECLARE
    share_amount DECIMAL;
    participant_id UUID;
BEGIN
    -- Calculer le montant par personne
    share_amount := p_total_amount / array_length(p_participant_ids, 1);
    
    -- Insérer les parts pour chaque participant
    FOREACH participant_id IN ARRAY p_participant_ids
    LOOP
        INSERT INTO expense_shares (expense_id, user_id, share_amount)
        VALUES (p_expense_id, participant_id, share_amount)
        ON CONFLICT (expense_id, user_id) DO UPDATE
        SET share_amount = EXCLUDED.share_amount;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir le résumé d'un groupe
CREATE OR REPLACE FUNCTION get_group_summary(p_group_id UUID)
RETURNS TABLE (
    total_balance DECIMAL,
    user_id UUID,
    user_name VARCHAR,
    user_initial CHAR,
    balance DECIMAL,
    status TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        SUM(ub.balance) OVER () AS total_balance,
        ub.user_id,
        ub.user_name,
        ub.initial,
        ub.balance,
        CASE 
            WHEN ub.balance > 0 THEN 'receive'
            WHEN ub.balance < 0 THEN 'pay'
            ELSE 'settled'
        END AS status
    FROM user_balances ub
    WHERE ub.group_id = p_group_id
    ORDER BY ub.balance DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ÉTAPE 5 : Recréer la vue user_balances (si nécessaire)
-- ============================================

CREATE OR REPLACE VIEW user_balances AS
SELECT 
    ug.group_id,
    u.id AS user_id,
    u.name AS user_name,
    u.initial,
    COALESCE(paid.total_paid, 0) AS total_paid,
    COALESCE(owed.total_owed, 0) AS total_owed,
    COALESCE(paid.total_paid, 0) - COALESCE(owed.total_owed, 0) AS balance
FROM user_groups ug
JOIN users u ON ug.user_id = u.id
LEFT JOIN (
    SELECT 
        e.group_id,
        e.paid_by_user_id AS user_id,
        SUM(e.amount) AS total_paid
    FROM expenses e
    GROUP BY e.group_id, e.paid_by_user_id
) paid ON ug.group_id = paid.group_id AND ug.user_id = paid.user_id
LEFT JOIN (
    SELECT 
        e.group_id,
        es.user_id,
        SUM(es.share_amount) AS total_owed
    FROM expense_shares es
    JOIN expenses e ON es.expense_id = e.id
    GROUP BY e.group_id, es.user_id
) owed ON ug.group_id = owed.group_id AND ug.user_id = owed.user_id;
