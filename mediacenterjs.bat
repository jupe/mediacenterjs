@ECHO OFF
cd %CD% 
IF EXIST node_modules GOTO _EXISTS
  :: if node_modules folder not exists, assumed that this is fresh "installation" 
  :: and extract dependencies for win32 usage.
  mkdir node_modules
  unzip node_modules_zip\node_modules_win.zip -d node_modules/
  rename node_modules_win node_modules
:_EXISTS
   
node index.js
