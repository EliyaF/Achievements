@echo off
echo Setting up Achievements Management System...
echo.

echo Installing Backend Dependencies...
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Error installing backend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo Installing Frontend Dependencies...
cd frontend
npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo Setup complete! You can now run start.bat or start.ps1 to start the application.
echo.
pause 