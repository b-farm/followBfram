@echo off
REM Change directory to the location of the script
cd /d %~dp0

REM Run the Node.js script
node dev-fetchdata/readGSheet.js

pause
