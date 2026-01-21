@echo off
echo Starting Mobile API Server (Legacy PHP Server)...
echo This server bypasses "php artisan serve" to avoid hanging on POST requests.
echo Listening on http://127.0.0.1:6003
php -S 127.0.0.1:6003 server_mobile.php
pause
