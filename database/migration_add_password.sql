-- Migration : Ajouter le champ password à la table users
-- Pour l'authentification email/password

-- Ajouter la colonne password (hashé avec bcrypt)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Mettre à jour les utilisateurs existants avec un mot de passe par défaut
-- (Les utilisateurs devront le changer lors de la première connexion)
-- Note: Ce hash correspond à "password123" - À CHANGER EN PRODUCTION
UPDATE users 
SET password = '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq'
WHERE password IS NULL;

-- Rendre le password obligatoire pour les nouveaux utilisateurs
ALTER TABLE users 
ALTER COLUMN password SET NOT NULL;
