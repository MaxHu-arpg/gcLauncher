@echo off
chcp 65001
CLS


title mitmproxy Installer

set ORIGIN=%1
set ORIGIN=%ORIGIN:"=%

cd "%ORIGIN%"

echo Running proxy server in order to generate certificates...

:: Start proxy server
start "Proxy Server" /min "%ORIGIN%\mitmdump.exe" --ssl-insecure --set ip=%ip%

:: Allow the proxy server to create the certificates
ping 127.0.0.1 -n 6 > nul

:: Kill the process
taskkill /f /im mitmdump.exe

echo Adding ceritifcate...

:: Ensure we are elevated for certs
>nul 2>&1 certutil -addstore root "%USERPROFILE%\.mitmproxy\mitmproxy-ca-cert.cer" || (
	echo ============================================================================================================
	echo !! 代理证书安装失败 !!
	echo.
	echo 请以管理员身份手动运行以下在cmd中代码
	echo 			certutil -addstore root "%USERPROFILE%\.mitmproxy\mitmproxy-ca-cert.cer"
	echo.
    echo 或者打开目录"%USERPROFILE%\.mitmproxy"手动安装证书
	echo ============================================================================================================
	goto ed
)
echo ============================================================================================================
echo.
echo 安装完成，可关闭该界面！
echo.
echo ============================================================================================================

:ed

pause

taskkill /f /fi "WINDOWTITLE eq mitmproxy Installer"
taskkill /f /fi "WINDOWTITLE eq Administrator:  mitmproxy Installer"
