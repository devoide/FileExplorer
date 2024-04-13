const { app, BrowserWindow, ipcMain } = require("electron/main")
const path = require("path")
const fs = require("node:fs")
const fsPromises = fs.promises

let parentwin;

function createWindow(){
    parentwin = new BrowserWindow({
        width: 800,
        height: 600,
        icon: "./ICON/106.ico",
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    //win.webContents.openDevTools()
    parentwin.loadFile("index.html")
}

function createErrorWindow(parentWindow){
    let win = new BrowserWindow({
        width: 300,
        height: 150,
        icon: "./ICON/2.ico",
        modal: true,
        parent: parentWindow,
        alwaysOnTop: true,
        resizable: false,

    })
    win.loadFile("error.html");
    win.once('ready-to-show', () => {
        win.show();
        win.focus();  // Force focus on the window when it's ready to show
    });

    win.on('closed', () => {
        win = null;  // Dereference the window object for garbage collection
    });
}

//joins paths function
function joinpath(folder, i){
    return path.join(folder, i)
}

//when called, calls the join function
ipcMain.handle("joinpath", (event, folder, i) => {
    return joinpath(folder, i)
})

//checks if element is a dir and if so returns true if not false
ipcMain.handle("isdir", async (event, folder) => { //did not work because i didnt use try and catch, plus because there was no async
    try {
        const stats = await fsPromises.stat(folder)
        return stats.isDirectory()
    } catch (err) {
        console.error(`Error checking if path is a directory: ${err}`)
        return false;
    }
});

//when called checks if dir exists and if so it returns a list
ipcMain.handle("checknreadDir", (event, path) => {
    try {
        return fs.readdirSync(path)
    } catch(err) {
        createErrorWindow(parentwin)
    }
})

ipcMain.handle("parentdir", (event, folder) => {
    return path.dirname(folder)
})


//opens window if ready, it iz time
app.whenReady().then(() => {
    createWindow()
})

//TODO: create error popup system when not allowed to enter directory
//TODO: MAKE IT BASED