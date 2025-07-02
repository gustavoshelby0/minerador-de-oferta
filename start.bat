@echo off
echo.
echo ========================================
echo   FACEBOOK ADS MINER - INICIANDO...
echo ========================================
echo.

REM Verificar se o Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado!
    echo Por favor, instale o Node.js: https://nodejs.org
    pause
    exit /b 1
)

REM Verificar se existe .env
if not exist .env (
    echo ⚠️  Arquivo .env não encontrado!
    echo Copiando .env.example para .env...
    copy .env.example .env
    echo.
    echo ✅ Configure seu .env com os tokens da API do Facebook
    echo Depois execute este script novamente.
    pause
    exit /b 1
)

REM Instalar dependências se necessário
if not exist node_modules (
    echo 📦 Instalando dependências...
    npm install
    echo.
)

REM Criar pasta de logs
if not exist logs mkdir logs

echo 🚀 Iniciando servidor...
echo.
echo Dashboard: http://localhost:3000
echo API Health: http://localhost:3000/api/health
echo.

npm start

pause
