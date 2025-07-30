Write-Host "Setting up Achievements Management System..." -ForegroundColor Green
Write-Host ""

Write-Host "Installing Backend Dependencies..." -ForegroundColor Yellow
Set-Location backend
pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error installing backend dependencies" -ForegroundColor Red
    Read-Host "Press Enter to continue"
    exit 1
}
Set-Location ..

Write-Host ""
Write-Host "Installing Frontend Dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error installing frontend dependencies" -ForegroundColor Red
    Read-Host "Press Enter to continue"
    exit 1
}
Set-Location ..

Write-Host ""
Write-Host "Setup complete! You can now run start.bat or start.ps1 to start the application." -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to continue" 