-- Script SQL pour FamilySplit
-- Base de données PostgreSQL

-- Extension pour les UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des utilisateurs
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    initial CHAR(1) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des groupes
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table de liaison utilisateurs-groupes (many-to-many)
CREATE TABLE user_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, group_id)
);

-- Table des dépenses
CREATE TABLE expenses (
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

-- Table de répartition des dépenses (qui participe à quelle dépense)
CREATE TABLE expense_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    share_amount DECIMAL(10, 2) NOT NULL CHECK (share_amount >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(expense_id, user_id)
);

-- Index pour améliorer les performances
CREATE INDEX idx_expenses_group_id ON expenses(group_id);
CREATE INDEX idx_expenses_date ON expenses(date DESC);
CREATE INDEX idx_expenses_paid_by ON expenses(paid_by_user_id);
CREATE INDEX idx_expense_shares_expense_id ON expense_shares(expense_id);
CREATE INDEX idx_expense_shares_user_id ON expense_shares(user_id);
CREATE INDEX idx_user_groups_user_id ON user_groups(user_id);
CREATE INDEX idx_user_groups_group_id ON user_groups(group_id);

-- Fonction pour calculer automatiquement les parts lors de la création d'une dépense
-- Cette fonction peut être appelée depuis l'application ou via un trigger
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

-- Vue pour calculer les soldes par utilisateur dans un groupe
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

-- Données d'exemple (optionnel - pour les tests)
-- Insérer des utilisateurs
INSERT INTO users (id, name, email, initial) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'Mohamed', 'mohamed@example.com', 'M'),
    ('550e8400-e29b-41d4-a716-446655440001', 'Lassad', 'lassad@example.com', 'L'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Youssef', 'youssef@example.com', 'Y')
ON CONFLICT (email) DO NOTHING;

-- Insérer un groupe
INSERT INTO groups (id, name, description) VALUES
    ('660e8400-e29b-41d4-a716-446655440000', 'Famille', 'Groupe familial pour partager les dépenses')
ON CONFLICT DO NOTHING;

-- Ajouter les utilisateurs au groupe
INSERT INTO user_groups (user_id, group_id) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000'),
    ('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000'),
    ('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440000')
ON CONFLICT DO NOTHING;

-- Commentaires pour la documentation
COMMENT ON TABLE users IS 'Table des utilisateurs de l''application';
COMMENT ON TABLE groups IS 'Table des groupes de partage de frais';
COMMENT ON TABLE expenses IS 'Table des dépenses enregistrées';
COMMENT ON TABLE expense_shares IS 'Table de répartition des dépenses entre les utilisateurs';
COMMENT ON VIEW user_balances IS 'Vue calculant les soldes de chaque utilisateur par groupe';
COMMENT ON FUNCTION get_group_summary(UUID) IS 'Fonction retournant le résumé financier d''un groupe';
