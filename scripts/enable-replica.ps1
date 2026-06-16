$cfgPath = "C:\Program Files\MongoDB\Server\8.3\bin\mongod.cfg"
$content = Get-Content $cfgPath -Raw
if ($content -notmatch "replSetName") {
    $content += "`nreplication:`n  replSetName: rs0`n"
    Set-Content -Path $cfgPath -Value $content
    Write-Host "Replica set config added."
} else {
    Write-Host "Replica set already configured."
}
Stop-Service MongoDB
Start-Service MongoDB
Start-Sleep -Seconds 3
Write-Host "MongoDB restarted."
