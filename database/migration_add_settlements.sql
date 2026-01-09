-- Migration : Ajout du système de règlements (settlements)
-- ⚠️ IMPORTANT : Exécutez ce script dans Supabase SQL Editor

-- Table des règlements (paiements entre utilisateurs)
CREATE TABLE IF NOT EXISTS settlements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    payment_method VARCHAR(50) DEFAULT 'cash',
    notes TEXT,
    created_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (from_user_id != to_user_id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_settlements_group_id ON settlements(group_id);
CREATE INDEX IF NOT EXISTS idx_settlements_from_user ON settlements(from_user_id);
CREATE INDEX IF NOT EXISTS idx_settlements_to_user ON settlements(to_user_id);

-- Supprimer temporairement la fonction qui dépend de la vue
DROP FUNCTION IF EXISTS get_group_summary(UUID);

-- Supprimer l'ancienne vue user_balances
DROP VIEW IF EXISTS user_balances;

-- Recréer la vue user_balances avec les règlements
CREATE VIEW user_balances AS
SELECT 
    ug.group_id,
    u.id AS user_id,
    u.name AS user_name,
    u.initial,
    COALESCE(paid.total_paid, 0) AS total_paid,
    COALESCE(owed.total_owed, 0) AS total_owed,
    COALESCE(received_settlements.amount, 0) AS settlements_received,
    COALESCE(paid_settlements.amount, 0) AS settlements_paid,
    (COALESCE(paid.total_paid, 0) - COALESCE(owed.total_owed, 0)) + 
    (COALESCE(paid_settlements.amount, 0) - COALESCE(received_settlements.amount, 0)) AS balance
FROM user_groups ug
JOIN users u ON ug.user_id = u.id
LEFT JOIN (
    SELECT group_id, paid_by_user_id AS user_id, SUM(amount) AS total_paid
    FROM expenses GROUP BY group_id, paid_by_user_id
) paid ON ug.group_id = paid.group_id AND ug.user_id = paid.user_id
LEFT JOIN (
    SELECT e.group_id, es.user_id, SUM(es.share_amount) AS total_owed
    FROM expense_shares es JOIN expenses e ON es.expense_id = e.id
    GROUP BY e.group_id, es.user_id
) owed ON ug.group_id = owed.group_id AND ug.user_id = owed.user_id
LEFT JOIN (
    SELECT group_id, to_user_id AS user_id, SUM(amount) AS amount
    FROM settlements GROUP BY group_id, to_user_id
) received_settlements ON ug.group_id = received_settlements.group_id AND ug.user_id = received_settlements.user_id
LEFT JOIN (
    SELECT group_id, from_user_id AS user_id, SUM(amount) AS amount
    FROM settlements GROUP BY group_id, from_user_id
) paid_settlements ON ug.group_id = paid_settlements.group_id AND ug.user_id = paid_settlements.user_id;

-- Recréer la fonction get_group_summary
CREATE OR REPLACE FUNCTION get_group_summary(p_group_id UUID)
RETURNS TABLE (
    total_balance DECIMAL,
    user_id UUID,
    user_name VARCHAR,
    user_email VARCHAR,
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
        u.email AS user_email,
        ub.initial,
        ub.balance,
        CASE 
            WHEN ub.balance > 0 THEN 'receive'
            WHEN ub.balance < 0 THEN 'pay'
            ELSE 'settled'
        END AS status
    FROM user_balances ub
    JOIN users u ON ub.user_id = u.id
    WHERE ub.group_id = p_group_id
    ORDER BY ub.balance DESC;
END;
$$ LANGUAGE plpgsql;
