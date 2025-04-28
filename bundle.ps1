$FolderPath = "./satisfactory"

# Chemin vers le fichier de configuration
$confFile = Join-Path $FolderPath "bundle.conf"

if (-not (Test-Path $confFile)) {
    Write-Error "Le fichier bundle.conf est introuvable dans '$FolderPath'."
    exit 1
}

# Fichier de sortie
$outputFile = "./dist/satisfactory.js"

# Vide le fichier de sortie s'il existe déjà
if (Test-Path $outputFile) {
    Remove-Item $outputFile
}

# Lecture ligne par ligne de bundle.conf
Get-Content $confFile | ForEach-Object {
    $fileName = $_.Trim()
    
    if ($fileName -eq "") {
        return
    }

    $filePath = Join-Path $FolderPath $fileName

    if (Test-Path $filePath) {
        Get-Content $filePath | Out-File -Append -Encoding utf8 $outputFile
    } else {
        Write-Warning "⚠️ Fichier introuvable : $fileName"
    }
}

Write-Host "✅ Bundle généré : $outputFile"
