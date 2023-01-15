//在此写主进程ipc通讯
const {app, desktopCapturer, ipcMain, dialog} =require("electron");
const Store = require('electron-store');
const path = require("path");
const os = require("os");
const child_process = require("child_process");
const MainWindow = require(path.join(__dirname,'MainWindow','MainWindow.js'))

const config = new Store({
    cwd: 'Config',
    clearInvalidConfig: true,
    defaults: {
        IP: '',
        Port: '',
        ExecPath: '',
        ProxyInstalled: false,
    },
});

(async () => {
    //忽略证书的检测
    app.commandLine.appendSwitch('ignore-certificate-errors')

    await app.whenReady()
    ipcMain.handle('GET_CONFIG',  (event) => {
        return config.store
    })
    ipcMain.handle('SET_CONFIG',  (event,key,value) => {
        config.set(key,value)
        return config.store
    })
    ipcMain.handle('SHOW_UNINSTALL',  async (event) => {
        console.log('Showing MessageBox...')
        let result = await dialog.showMessageBox(MainWindow.getMainWin(),{
            message:'检测到私服代理证书未安装，安装方可进入私服！',
            type:'warning',
            buttons:['安装','取消'],
            defaultId:0,
            title:'提示',
            cancelId:1,
        })
        console.log(result)
        return result.response
    })
    ipcMain.handle('INSTALL_PROXY',  (event) => {
        console.log('Start install proxy')
        const install = child_process.exec(`"${path.join(__dirname,'cmdScript','install.cmd')}" ${path.join(__dirname,'unpack')}`)
        install.on('error',(error)=>{
            console.log(error)
        })
        return 1
    })
    ipcMain.handle('SELECT_FILE', async (event) => {
        let resolve = await dialog.showOpenDialog(MainWindow.getMainWin(),{
            title: '选择游戏可执行文件（.exe）',
            defaultPath: path.join(__dirname,'..','..'),
            filters: [
                { name: '可执行文件', extensions: ['exe'] },
                { name: 'All Files', extensions: ['*'] }
            ],
            properties: ['openFile','showHiddenFiles']
        })
        return resolve.filePaths[0]
    })
    ipcMain.handle('START_GAME',  (event,IP,PORT,GAME_PATH) => {
        console.log('Start Game')
        console.log(`"${path.join(__dirname,'cmdScript','private_server_launch.cmd')}" ${IP} ${PORT} true "${GAME_PATH}" "${path.join(__dirname,'unpack')}"`)
        child_process.exec(`"${path.join(__dirname,'cmdScript','private_server_launch.cmd')}" ${IP} ${PORT} true "${GAME_PATH}" "${path.join(__dirname,'unpack')}"`)
        return 1
    })
})();
