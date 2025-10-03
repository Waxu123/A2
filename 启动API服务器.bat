@echo off
echo ====================================
echo 启动慈善活动管理系统 API 服务器
echo ====================================
echo.

cd /d "%~dp0api"

echo 正在启动服务器...
echo.

node server.js

pause

