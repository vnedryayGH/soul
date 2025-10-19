@echo off
setlocal
REM Ensure run from repo root and proper PYTHONPATH
set ROOT=%~dp0..\..
pushd "%ROOT%" >nul 2>&1
set "PYTHONPATH=%ROOT%;%PYTHONPATH%"
set PY=python
set SCRIPT=Soul\scripts\roles_editor_cli.py
%PY% %SCRIPT% %*
popd >nul 2>&1
endlocal
