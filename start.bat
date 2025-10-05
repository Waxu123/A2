@echo off
chcp 65001 >nul
echo ============================================
echo Charity Events Management System
echo ============================================
echo.
echo Starting API Server...
echo.

cd /d "%~dp0"

REM Start API server in a new window
start "API Server" cmd /k "cd /d %~dp0api && npm start"

REM Wait for API to start
timeout /t 5 /nobreak >nul

echo.
echo API Server started at http://localhost:3000
echo.
echo Starting Client Website...
echo.

REM Start client in a new window
start "Client Website" cmd /k "cd /d %~dp0client && python -m http.server 8080"

echo.
echo ============================================
echo Project Started Successfully!
echo ============================================
echo.
echo API Server:      http://localhost:3000
echo Client Website:  http://localhost:8080/index.html
echo.
echo Press any key to open the website in your browser...
pause >nul

start http://localhost:8080/index.html

echo.
echo To stop the servers, close the API and Client windows.
echo.
