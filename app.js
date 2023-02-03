const { info } = require('console');
const { app, BrowserWindow, ipcMain, net, shell, Menu, MenuItem, dialog } = require('electron')
const Store = require('electron-store');

const path = require('path')
var axios = require('axios');
var FormData = require('form-data');
const fs = require('fs');


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
    var template = [
        {
            label: 'browsertools',
            submenu: [{
                role: 'help',
                accelerator: process.platform === 'darwin' ? 'Cmd+I' : 'F12',
                click: () => {
                    mainWindow.webContents.openDevTools()
                }
            }]
        },
        {
        label: "Application",
        submenu: [
            { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
            { type: "separator" },
            { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
        ]},
        {
            label: 'browsertools',
            submenu: [{
                role: 'help',
                accelerator: process.platform === 'darwin' ? 'Cmd+R' : 'Ctrl + R',
                click: () => {
                    mainWindow.loadFile('index.html');
                }
            }]
        },
         {
        label: "Edit",
        submenu: [
            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
            { type: "separator" },
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]}
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
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

function sendMessage(channelID,text, paths = []){
    var data = new FormData();
    let file = 0;
    if(paths.length > 0){
        data.append('file1', fs.createReadStream(paths[0]));
    }
    
    let payload = {
        "content" : text
    }
    data.append('payload_json', JSON.stringify(payload));
    
    var config = {
      method: 'post',
      url: 'https://discord.com/api/v10/channels/' + channelID +'/messages',
      headers: { 
        'Authorization': 'NzA2MDI1MTI1MDczMzg3NTUx.G9LPNO.hQufICpeXAphPSlAWueBKQ0DS88ILhplhoh51M', 
        'Content-Type': 'multipart/form-data', 
        'Cookie': '__cfruid=496360623eb2a9bd7dedbcc45afd04b1eeca0006-1675402344; __dcfduid=2209c7ea9e4411ed86972eeab664f185; __sdcfduid=2209c7ea9e4411ed86972eeab664f18588b85ebf2baa0a229239c86d51b7ab72e39fd2547bf256ebb58926c2f1a0fc86', 
        ...data.getHeaders()
      },
      data : data
    };
    
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
}

ipcMain.handle("sendMessage",(event,...args)=>{
    sendMessage(args[0], args[1], args[2]);
})