-- Migration : Lier la table users à auth.users.id de Supabase
-- À exécuter dans le SQL Editor de Supabase si la table users existe déjà

-- Si la table users existe déjà avec des données, cette migration permet de la modifier
-- pour lier users.id à auth.users.id

-- Étape 1 : Supprimer la contrainte de clé primaire existante (si elle existe)
-- Note: Cette étape peut échouer si la table n'existe pas encore, c'est normal
DO $$ 
BEGIN
    -- Supprimer la contrainte DEFAULT si elle existe
    ALTER TABLE users ALTER COLUMN id DROP DEFAULT;
EXCEPTION
    WHEN undefined_table THEN NULL;
    WHEN undefined_object THEN NULL;
END $$;

-- Étape 2 : Modifier la colonne id pour qu'elle référence auth.users
-- Note: Cette étape nécessite que les utilisateurs existent déjà dans auth.users
ALTER TABLE users 
    ALTER COLUMN id TYPE UUID,
    ADD CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Étape 3 : Créer une fonction trigger pour créer automatiquement un profil utilisateur
-- lorsqu'un utilisateur s'inscrit via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Cette fonction sera appelée par un trigger après l'inscription
    -- Le profil utilisateur sera créé via l'API backend
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: Le trigger sera configuré dans Supabase Dashboard > Database > Triggers
-- ou via l'API backend lors de l'inscription
