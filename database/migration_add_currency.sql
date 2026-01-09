-- Migration pour ajouter la gestion multi-devises (EUR et TND)
-- À exécuter dans le SQL Editor de Supabase

-- Créer la table settings pour stocker le taux de conversion
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(50) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insérer le taux de conversion par défaut (1€ = 3.45 TND)
INSERT INTO settings (key, value, description)
VALUES ('EUR_TO_TND', '3.45', 'Taux de conversion de l''euro vers le dinar tunisien')
ON CONFLICT (key) DO NOTHING;

-- Créer un index sur la clé pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
