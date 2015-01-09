call forever stop "chatappbrowser"
call cordova build browser
copy /Y scripts\serve.js  platforms\browser\www
mklink /j "platforms/browser/www/node_modules" "%APPDATA%\npm\node_modules"
call forever --uid "chatappbrowser" -s platforms/browser/www/serve.js --port %1
