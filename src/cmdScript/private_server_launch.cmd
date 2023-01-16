@echo off
chcp 65001
CLS

title Private Sever Launcher

echo ============================================================================================================
echo.
echo 切勿关闭本窗口，直接关闭游戏即可
echo 本窗口会自动关闭
echo.
echo ============================================================================================================
echo.
echo 代理服务器运行---

set IP=%1
set PORT=%2
set USE_HTTPS=%3
set GAME_PATH=%4
set ORIGIN=%5

cd "%ORIGIN%"

:: For registry
set GAME_REG="HKEY_CURRENT_USER\Software\miHoYo\Genshin Impact"

set PROXY=true
@rem Store original proxy settings
for /f "tokens=2*" %%a in ('reg query "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable 2^>nul') do set "ORIG_PROXY_ENABLE=%%b"
for /f "tokens=2*" %%a in ('reg query "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyServer 2^>nul') do set "ORIG_PROXY_SERVER=%%b"

:: Set proxy settings in Windows
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable /t REG_DWORD /d 1 /f >nul 2>nul
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyServer /d "127.0.0.1:46852" /f >nul 2>nul

:: Start proxy server
start "Proxy Server" /b "%ORIGIN%\mitmdump.exe" --listen-host 127.0.0.1 -p 46852 -s "%ORIGIN%\proxy.py" -k --allow-hosts ".*\.yuanshen\.com|.*\.mihoyo\.com|.*\.hoyoverse\.com" --ssl-insecure --set ip=%IP% --set port=%PORT% --set use_https=%USE_HTTPS%

echo Opening %GAME_PATH%

:: Allow the proxy server to open fully
ping 127.0.0.1 -n 5 > nul


:: Launch game
%GAME_PATH%

:: On exit clean proxy stuff
:EXIT
echo Exiting...

if "%PROXY%" EQU "" (
	echo 代理未开启，终止清理，即将退出。。。

	exit /b	
)

:: Clean proxy settings
echo Cleaning up proxy settings...
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable /t REG_DWORD /d "%ORIG_PROXY_ENABLE%" /f >nul 2>nul
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyServer /d "%ORIG_PROXY_SERVER%" /f >nul 2>nul

:: Kill proxy server
taskkill /f /im mitmdump.exe

echo 代理已关闭，即将退出。。

:: Just in case the user has corutils installed, use this hacky timeout instead of the timeout command
ping 127.0.0.1 -n 2 > nul


:: Attempt to kill either
taskkill /f /fi "WINDOWTITLE eq Administrator:  Private Sever Launcher"
taskkill /f /fi "WINDOWTITLE eq Private Sever Launcher"


exit /b