set CHROME_PATH="%USERPROFILE%\AppData\Local\Google\Chrome\Application\chrome.exe"

call E:
call cd E:\Trabajos\2017\referidosBrian2

%CHROME_PATH% http://localhost:8089/sales/inicio.html#/referidos/consulta?targetHost=http://localhost:8080 --new-window

set CHROME_PATH="%programfiles(x86)%\Google\Chrome\Application\chrome.exe"
%CHROME_PATH% http://localhost:8089/sales/inicio.html#/referidos/consulta?targetHost=http://localhost:8080 --new-window

set CHROME_PATH="%programfiles%\Google\Chrome\Application\chrome.exe"
%CHROME_PATH% http://localhost:8089/sales/inicio.html#/referidos/consulta?targetHost=http://localhost:8080 --new-window

http-server -s -c-1 -p 8089

