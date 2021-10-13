const {app, BrowserWindow,nativeTheme, ipcMain} = require('electron')
nativeTheme.themeSource = 'dark'
const path = require('path')
const isDev = require('electron-is-dev')
require('@electron/remote/main').initialize()



function createWindow(){
const win = new BrowserWindow({
    width: 800,
    height:600,
    resizable:false,
    title:'bpass | Management system',
    icon: __dirname + '/favicon.ico',
    webPreferences:{
        nodeIntegration:true,
        enableRemoteModule: true,
        contextIsolation: false
    },

})
win.setMenuBarVisibility(false)
win.loadURL(
    isDev ? 
    'http://localhost:3000' : 
    `file://${path.join(__dirname, '../build/index.html')}`
    )
}

app.on('ready',createWindow)

app.on('window-all-closed',function (){

if(process.platform !== 'darwin'){
    app.quit()
}

})


app.on('activate',function(){

if(BrowserWindow.getAllWindows().length === 0) createWindow()

})

ipcMain.on('close', (evt, arg) => {
    app.quit()
  })