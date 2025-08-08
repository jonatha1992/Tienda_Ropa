# Script PowerShell para obtener la Firebase Service Account Key para Railway

Write-Host "=== Firebase Service Account Key para Railway ===" -ForegroundColor Green
Write-Host ""
Write-Host "Copia el siguiente JSON y pégalo en la variable FIREBASE_SERVICE_ACCOUNT_KEY en Railway:" -ForegroundColor Yellow
Write-Host ""
Write-Host "----------------------------------------" -ForegroundColor Cyan

$content = Get-Content "backend\firebase_service_account.json" -Raw
$content = $content -replace "`r`n", "" -replace "`n", ""
Write-Host $content

Write-Host "----------------------------------------" -ForegroundColor Cyan
Write-Host ""
Write-Host "Nota: Es una sola línea JSON sin saltos de línea." -ForegroundColor Yellow
