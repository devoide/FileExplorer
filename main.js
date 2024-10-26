const { app, BrowserWindow, ipcMain } = require("electron/main")
const path = require("path")
const fs = require("node:fs")
const fsPromises = fs.promises
const { exec } = require("child_process")
const ndi = require('node-disk-info');

let parentwin;
let errorwin;

app.setUserTasks([])

function createWindow(){
    parentwin = new BrowserWindow({
        width: 800,
        height: 600,
        icon: "./ICON/106.ico",
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });
    parentwin.setThumbarButtons([])
    parentwin.webContents.openDevTools()
    parentwin.loadFile("index.html")
}

function createErrorWindow(parentWindow){
    errorwin = new BrowserWindow({
        width: 300,
        height: 150,
        icon: "./ICON/2.ico",
        modal: true,
        parent: parentWindow,
        alwaysOnTop: true,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    errorwin.loadFile("error.html");
    errorwin.once("focus", () => errorwin.flashFrame(false));
    errorwin.flashFrame(true);
    errorwin.once('ready-to-show', () => {
        errorwin.show();
        errorwin.focus();
    });

}




//joins paths function
function joinpath(folder, i){
    return path.join(folder, i);
}

//when called, calls the join function
ipcMain.handle("joinpath", (event, folder, i) => {
    return joinpath(folder, i);
})

//checks if element is a dir and if so returns true if not false
ipcMain.handle("isdir", async (event, folder) => { //did not work because i didnt use try and catch, plus because there was no async
    try {
        const stats = await fsPromises.stat(folder);
        console.error(stats)
        return stats.isDirectory();
    } catch (err) {
        console.error(`Error checking if path is a directory: ${err}`);
        return false;
    }
});

//when called checks if dir exists and if so it returns a list
ipcMain.handle("checknreadDir", (event, path) => {
    try {
        return fs.readdirSync(path);
    } catch(err) {
        createErrorWindow(parentwin);
    }
});

ipcMain.handle("parentdir", (event, folder) => {
    return path.dirname(folder);
});

ipcMain.handle("closewin", () => {
    errorwin.close();
});

//starts a file
ipcMain.handle("start",(event, path) => {
    exec(`"${path}"`, (error) => {
        if (error) {
            console.error(`exec error: ${error}`);
            createErrorWindow()
        }
    });
});

//lists disks plus info
ipcMain.handle("disks", () => {
    let disklist = []
    ndi.getDiskInfo()
        .then(disks => {
            disks.forEach(disk => {
                console.log(`Disk ${disk.mounted}`);
                console.log(`  Total: ${disk.blocks}`);
                console.log(`  Used: ${disk.used}`);
                console.log(`  Available: ${disk.available}`);
                disklist.push([disk.mounted, disk.blocks, disk.used, disk.available, disk.filesystem])
            });
            console.log(disks);
        })
        .catch(error => console.error(error));
    return disklist
})


//opens window if ready, it iz time
app.whenReady().then(() => {
    createWindow()
});

//TODO: MAKE IT BASED