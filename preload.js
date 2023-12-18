const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("myAPI", {
    skrape: (args) => ipcRenderer.invoke("skrape", args),
    loadJson: () => ipcRenderer.invoke("loadJson"),
    saveTemplate: (args) => ipcRenderer.invoke("saveTemplate", args),
    deleteTemplate: (args) => ipcRenderer.invoke("deleteTemplate", args),
});
