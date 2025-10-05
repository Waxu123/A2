@echo off
echo ====================================
echo 启动慈善活动管理系统 客户端网站
echo ====================================
echo.

cd /d "%~dp0client"

echo 正在启动HTTP服务器...
echo 网站将在 http://localhost:8080 运行
echo.
echo 按 Ctrl+C 停止服务器
echo.

python -m http.server 8080

pause
