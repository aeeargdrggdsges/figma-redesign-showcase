@echo off
echo ========================================================
echo   Launching Apex Platform Figma Redesign Showcase
echo   Running on http://localhost:4500
echo ========================================================
start "" http://localhost:4500
python -m http.server 4500
