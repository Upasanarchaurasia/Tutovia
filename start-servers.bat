@echo off
cd /d "%~dp0"
set NODE_EXE=C:\Users\Nidhi Chaurasia\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe

powershell -NoProfile -ExecutionPolicy Bypass -Command "Stop-Process -Name node -Force -ErrorAction SilentlyContinue; Start-Sleep -Milliseconds 500; Start-Process -FilePath '%NODE_EXE%' -ArgumentList 'server.js' -WorkingDirectory 'c:\UC - Work Dump Impt\Tutovia' -WindowStyle Hidden; Start-Process -FilePath '%NODE_EXE%' -ArgumentList './node_modules/vite/bin/vite.js' -WorkingDirectory 'c:\UC - Work Dump Impt\Tutovia' -WindowStyle Hidden"
