-- Migration : Retirer Supabase Auth et ajouter l'authentification JWT
-- À exécuter dans le SQL Editor de Supabase

-- 1. Ajouter la colonne password si elle n'existe pas
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- 2. Supprimer la contrainte de clé étrangère vers auth.users si elle existe
-- (Cette commande peut échouer si la contrainte n'existe pas, c'est normal)
DO $$ 
BEGIN
    ALTER TABLE users DROP CONSTRAINT IF EXISTS users_id_fkey;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

-- 3. Modifier la colonne id pour qu'elle génère automatiquement un UUID
-- (Si elle ne le fait pas déjà)
ALTER TABLE users 
ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- 4. Note : Les utilisateurs existants devront réinitialiser leur mot de passe
-- Vous pouvez créer un script pour leur permettre de le faire via l'interface
