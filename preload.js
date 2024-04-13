const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    checknreadDir: (folder) => ipcRenderer.invoke("checknreadDir", folder),
    joinpath: (folder, i) => ipcRenderer.invoke("joinpath", folder, i),
    isdir: (folder, i) => ipcRenderer.invoke("isdir", folder, i),
    parentdir: (folder) => ipcRenderer.invoke("parentdir", folder)
});
