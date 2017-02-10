set CHROME_PATH="%USERPROFILE%\AppData\Local\Google\Chrome\Application\chrome.exe"

call c:
call cd c:\devel\workspace\sales

%CHROME_PATH% "http://localhost:8089/sales/inicio.html#/hipotecarios/consulta?targetHost=http://localhost:8080&debug=true" --new-window

set CHROME_PATH="%programfiles(x86)%\Google\Chrome\Application\chrome.exe"
%CHROME_PATH% "http://localhost:8089/sales/inicio.html#/hipotecarios/consulta?targetHost=http://localhost:8080&debug=true" --new-window

set CHROME_PATH="%programfiles%\Google\Chrome\Application\chrome.exe"
%CHROME_PATH% "http://localhost:8089/sales/inicio.html#/hipotecarios/consulta?targetHost=http://localhost:8080&debug=true" --new-window

http-server -s -c-1 -p 8089

