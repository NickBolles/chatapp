rmdir platforms /s /q
rmdir plugins /s /q
call scripts/installCordova.bat
call scripts/addPlatforms.bat
call scripts/addPlugins.bat