# Script PowerShell pour configurer le fichier .env
# Usage: .\configure-env.ps1

Write-Host "=== Configuration du fichier .env ===" -ForegroundColor Cyan
Write-Host ""

# Demander les informations PostgreSQL
$dbUser = Read-Host "Nom d'utilisateur PostgreSQL (par défaut: postgres)"
if ([string]::IsNullOrWhiteSpace($dbUser)) {
    $dbUser = "postgres"
}

$dbPassword = Read-Host "Mot de passe PostgreSQL" -AsSecureString
$dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword)
)

$dbPort = Read-Host "Port PostgreSQL (par défaut: 5432)"
if ([string]::IsNullOrWhiteSpace($dbPort)) {
    $dbPort = "5432"
}

$dbName = Read-Host "Nom de la base de données (par défaut: familysplit)"
if ([string]::IsNullOrWhiteSpace($dbName)) {
    $dbName = "familysplit"
}

# Construire la DATABASE_URL
$databaseUrl = "postgresql://${dbUser}:${dbPasswordPlain}@localhost:${dbPort}/${dbName}"

# Créer le contenu du fichier .env
$envContent = @"
# Database Configuration
DATABASE_URL=$databaseUrl

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173
"@

# Écrire le fichier .env
$envContent | Out-File -FilePath ".env" -Encoding utf8 -NoNewline

Write-Host ""
Write-Host "✅ Fichier .env créé avec succès!" -ForegroundColor Green
Write-Host ""
Write-Host "Vérifiez que la base de données '$dbName' existe et que le schéma a été créé." -ForegroundColor Yellow
Write-Host "Pour créer la base de données et le schéma, exécutez:" -ForegroundColor Yellow
Write-Host "  psql -U $dbUser -d $dbName -f ../database/schema.sql" -ForegroundColor Cyan
Write-Host ""
