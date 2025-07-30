@echo off
echo Starting Achievements Management System...
echo.

echo Starting Backend (FastAPI)...
start "Backend" cmd /k "cd backend && python main.py"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend (React)...
start "Frontend" cmd /k "cd frontend && npm start"

echo.
echo Services are starting...
echo Backend will be available at: http://localhost:8000
echo Frontend will be available at: http://localhost:3000
echo.
echo Press any key to exit this window...
pause > nul 