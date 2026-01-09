# Script PowerShell pour arrêter le processus utilisant le port 3000
# Usage: .\kill-port-3000.ps1

Write-Host "Recherche du processus utilisant le port 3000..." -ForegroundColor Yellow

$connections = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue

if ($connections) {
    foreach ($connection in $connections) {
        $processId = $connection.OwningProcess
        $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
        
        if ($process -and $process.Name -eq "node") {
            Write-Host "Processus Node.js trouve:" -ForegroundColor Cyan
            Write-Host "   PID: $processId" -ForegroundColor White
            Write-Host "   Nom: $($process.Name)" -ForegroundColor White
            Write-Host "   Chemin: $($process.Path)" -ForegroundColor Gray
            
            Write-Host ""
            Write-Host "Arret du processus..." -ForegroundColor Yellow
            try {
                Stop-Process -Id $processId -Force
                Write-Host "Processus arrete avec succes!" -ForegroundColor Green
            } catch {
                Write-Host "Erreur lors de l'arret: $_" -ForegroundColor Red
            }
        } else {
            Write-Host "Processus trouve (PID: $processId) mais ce n'est pas Node.js" -ForegroundColor Yellow
            Write-Host "   Nom: $($process.Name)" -ForegroundColor Gray
        }
    }
    Write-Host ""
    Write-Host "Le port 3000 devrait maintenant etre libre." -ForegroundColor Green
} else {
    Write-Host "Aucun processus n'utilise le port 3000" -ForegroundColor Green
}

Write-Host ""
Write-Host "Pour verifier: netstat -ano | findstr :3000" -ForegroundColor Gray
