@echo off
title Prompt Tool Launcher
color 0A

:: Ga naar de project directory
cd /d "C:\Users\vanle\Documents\prompt_tool"

echo ======================================
echo    Prompt Tool wordt gestart...
echo ======================================
echo.

:: Controleer of node_modules bestaat
if not exist "node_modules\" (
    echo Node modules niet gevonden. Dependencies worden geinstalleerd...
    echo.
    call npm install
    if errorlevel 1 (
        echo Fout bij het installeren van dependencies.
        echo.
        pause
        exit /b 1
    )
    echo.
    echo Dependencies succesvol geinstalleerd!
    echo.
)

:: Controleer of er al een instantie draait op poort 3000
netstat -ano | find ":3000" > nul
if %errorlevel% equ 0 (
    echo Een instantie van de app draait al!
    echo De browser wordt geopend...
    timeout /t 2 > nul
    start http://localhost:3000
    exit
)

:: Start de development server
echo Server wordt gestart...
echo Dit kan enkele seconden duren...
echo.
echo [Als je de app wilt stoppen, sluit dan dit venster]
echo.

:: Start de server in de achtergrond
start /b cmd /c "npm run dev > server.log 2>&1"

:: Wacht tot de server volledig is opgestart (max 30 seconden)
echo Wachten tot de server gereed is...
set /a attempts=0
:WAIT_LOOP
if %attempts% geq 30 (
    echo Timeout bij het wachten op de server.
    echo Controleer server.log voor details.
    pause
    exit /b 1
)
timeout /t 1 > nul
curl -f http://localhost:3000 > nul 2>&1
if errorlevel 1 (
    set /a attempts+=1
    goto WAIT_LOOP
)

:: Server is gereed, open de browser
echo Server is gereed! Browser wordt geopend...
start http://localhost:3000

:: Toon server output
type server.log
echo.
echo Server draait... Sluit dit venster om te stoppen.
pause > nul 