const { contextBridge, ipcRenderer, crashReporter, nativeImage, webFrame } = require('electron')

contextBridge.exposeInMainWorld('elec', {
    getConfig: () => ipcRenderer.invoke('GET_CONFIG'),
    setConfig: (key,value) => ipcRenderer.invoke('SET_CONFIG',key,value),
    installProxy: () => ipcRenderer.invoke('INSTALL_PROXY'),
    showUninstall: () => ipcRenderer.invoke('SHOW_UNINSTALL'),
    selectFile: () => ipcRenderer.invoke('SELECT_FILE'),
    startGame: (IP,PORT,GAME_PATH) => ipcRenderer.invoke('START_GAME',IP,PORT,GAME_PATH),
})


