@echo off
REM Sobe a API fake (JSON Server) do Minha Discoteca no Windows.
REM De dois cliques neste arquivo e deixe a janela aberta enquanto usa o site.
cd /d "%~dp0"
where npm >nul 2>nul || (echo Node.js nao encontrado. Instale a versao LTS em https://nodejs.org e tente de novo. & pause & exit /b 1)
if not exist node_modules\json-server (
  echo Instalando as dependencias, so na primeira vez...
  call npm install || (echo Falha no npm install. & pause & exit /b 1)
)
call npm run api
pause
