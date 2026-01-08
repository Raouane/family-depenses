# Configuration du Backend - Guide Rapide

## Problème d'authentification PostgreSQL

Si vous voyez l'erreur "authentification par mot de passe échouée", c'est que le fichier `.env` n'est pas configuré avec vos vraies informations PostgreSQL.

## Étapes de configuration

### 1. Trouver vos informations PostgreSQL

Vous devez connaître :
- **Utilisateur PostgreSQL** (souvent `postgres` par défaut)
- **Mot de passe PostgreSQL** (celui que vous avez défini lors de l'installation)
- **Port** (généralement `5432` par défaut)
- **Nom de la base de données** (doit être `familysplit`)

### 2. Éditer le fichier `.env`

Ouvrez `backend/.env` et modifiez la ligne `DATABASE_URL` :

```env
DATABASE_URL=postgresql://VOTRE_UTILISATEUR:VOTRE_MOT_DE_PASSE@localhost:5432/familysplit
```

**Exemples :**

Si votre utilisateur est `postgres` et votre mot de passe est `mypassword123` :
```env
DATABASE_URL=postgresql://postgres:mypassword123@localhost:5432/familysplit
```

Si votre utilisateur est `raoua` et votre mot de passe est `secret` :
```env
DATABASE_URL=postgresql://raoua:secret@localhost:5432/familysplit
```

### 3. Vérifier que la base de données existe

Assurez-vous que la base de données `familysplit` existe et que le schéma a été créé :

```bash
# Se connecter à PostgreSQL
psql -U votre_utilisateur -d familysplit

# Vérifier que les tables existent
\dt

# Si les tables n'existent pas, exécuter le script SQL
\i ../database/schema.sql
```

### 4. Redémarrer le backend

Après avoir modifié `.env`, redémarrez le serveur backend :

```bash
cd backend
npm run dev
```

## Test de connexion

Pour tester si la connexion fonctionne, vous pouvez créer un fichier de test :

```bash
cd backend
node -e "require('dotenv').config(); const { Pool } = require('pg'); const pool = new Pool({ connectionString: process.env.DATABASE_URL }); pool.query('SELECT NOW()').then(r => { console.log('✅ Connexion réussie!', r.rows[0]); pool.end(); }).catch(e => { console.error('❌ Erreur:', e.message); process.exit(1); });"
```

## Problèmes courants

### "password authentication failed"
- Vérifiez que le mot de passe dans `.env` est correct
- Vérifiez que l'utilisateur PostgreSQL existe

### "database does not exist"
- Créez la base de données : `CREATE DATABASE familysplit;`
- Exécutez le script SQL : `psql -U votre_utilisateur -d familysplit -f ../database/schema.sql`

### "connection refused"
- Vérifiez que PostgreSQL est démarré
- Vérifiez le port (généralement 5432)
