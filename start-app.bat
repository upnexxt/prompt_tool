@echo off
echo Prompt Tool wordt gestart...
cd /d "%~dp0"
start http://localhost:3000
npm run dev 