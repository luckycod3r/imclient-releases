const { info } = require('console');
const { app, BrowserWindow, ipcMain, net, shell, Menu, MenuItem, dialog } = require('electron')
const Store = require('electron-store');
const path = require('path')
global.mainWindow;
const STORAGE = new Store();
function createWindow() {

    global.mainWindow = new BrowserWindow({
        width: 1200,
        height: 750,
        productName: "FallLinks",
        frame: false,
        transparent: true,
        contextIsolation: false,
        title: "FallLinks",
        icon: "images/win-ico.ico",
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'scripts/node.js')
        }
    })
    const menu = new Menu()
    menu.append(new MenuItem({
        label: 'browsertools',
        submenu: [{
            role: 'help',
            accelerator: process.platform === 'darwin' ? 'Cmd+I' : 'F12',
            click: () => {
                mainWindow.webContents.openDevTools()
            }
        }]
    }))
    menu.append(new MenuItem({
        label: 'browsertools',
        submenu: [{
            role: 'help',
            accelerator: process.platform === 'darwin' ? 'Cmd+R' : 'Ctrl + R',
            click: () => {
                mainWindow.loadFile('index.html');
            }
        }]
    }))
    Menu.setApplicationMenu(menu)
    mainWindow.loadFile('index.html')
    mainWindow.setResizable(false);
}
app.whenReady().then(() => {
    createWindow()

    app.on('activate', function() {


        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})


app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('quit-app', () => {
    app.quit();
});
ipcMain.handle('hide-app', () => {
    BrowserWindow.getFocusedWindow().minimize();
});
ipcMain.handle('saveInStorage',(event,...args)=>{
    STORAGE.set(args[0],args[1]);
})
ipcMain.handle('getFromStorage',(event,...args)=>{
    return STORAGE.get(args[0]);

})
ipcMain.handle('dialog',(event,...args)=>{
    return dialog.showOpenDialog(mainWindow,{});
})