# Installation PostgreSQL sur Windows

## Option A : Installation via Installer officiel

1. **Télécharger PostgreSQL** :
   - Allez sur https://www.postgresql.org/download/windows/
   - Téléchargez l'installer pour Windows
   - Exécutez l'installer

2. **Pendant l'installation** :
   - Notez le mot de passe que vous définissez pour l'utilisateur `postgres`
   - Le port par défaut est `5432` (gardez-le)
   - Laissez toutes les options par défaut

3. **Après l'installation** :
   - PostgreSQL devrait être démarré automatiquement
   - Vérifiez dans les Services Windows que "postgresql-x64-XX" est en cours d'exécution

4. **Créer la base de données** :
   - Ouvrez "SQL Shell (psql)" depuis le menu Démarrer
   - Entrez le mot de passe que vous avez défini
   - Exécutez :
   ```sql
   CREATE DATABASE familysplit;
   \q
   ```

5. **Créer le schéma** :
   - Ouvrez PowerShell dans le dossier du projet
   - Exécutez :
   ```powershell
   # Trouver le chemin de psql (généralement dans Program Files)
   $psqlPath = "C:\Program Files\PostgreSQL\16\bin\psql.exe"
   # Ajustez le numéro de version (14, 15, 16, etc.)
   
   & $psqlPath -U postgres -d familysplit -f database\schema.sql
   ```

6. **Mettre à jour le `.env`** :
   ```env
   DATABASE_URL=postgresql://postgres:VOTRE_MOT_DE_PASSE@localhost:5432/familysplit
   ```

## Option B : Installation via Chocolatey (si installé)

```powershell
choco install postgresql
```

## Option C : Utiliser Docker (si Docker est installé)

```powershell
docker run --name familysplit-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=familysplit -p 5432:5432 -d postgres
```

Puis dans le `.env` :
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/familysplit
```

## Vérification

Pour vérifier que PostgreSQL fonctionne :
```powershell
# Trouver psql
$psqlPath = "C:\Program Files\PostgreSQL\16\bin\psql.exe"
& $psqlPath -U postgres -c "SELECT version();"
```
