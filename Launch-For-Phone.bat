@echo off
title DailyPulse Mobile Server
cls
echo ========================================================
echo         DAILYPULSE ⚡ - MOBILE & TABLET LAUNCHER
echo ========================================================
echo.
echo 1. Ensure your phone and laptop are on the same Wi-Fi.
echo 2. Open Chrome or Safari on your phone.
echo.
for /f "tokens=4" %%a in ('route print ^| findstr 0.0.0.0.*0.0.0.0') do (
    set LOCAL_IP=%%a
)
echo 3. Visit this link on your phone/tablet:
echo.
echo        http://%LOCAL_IP%:8080
echo.
echo 4. Tap the "📲 Install" button or "Add to Home Screen"!
echo ========================================================
echo Server is running... (Press Ctrl+C to stop)
python -m http.server 8080
pause
