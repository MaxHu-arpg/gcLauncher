const {app, BrowserWindow, shell, Menu, nativeImage, desktopCapturer, ipcMain} = require('electron')
const path = require("path");
const os = require('os');


let mainWin = null;
let mainWinId = null;
module.exports = {
    getMainWin,
    getMainWinId,
    createMainWindow,
    restoreMainWindow,
}
function getMainWin(){return mainWin}

function getMainWinId(){return mainWinId}

function createMainWindow() {
    console.log('Creating MainWindow ...');
    // Menu.setApplicationMenu(null)
    mainWin = new BrowserWindow({
        width: 1300,
        height: 750,
        minWidth: 1300,  //窗口最小的宽度
        minHeight: 750, //窗口最小的高度
        useContentSize: true,
        resizable: false,
        icon :path.join(__dirname,'..','Ganyu.ico'),
        show: false,
        frame: true,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            devTools: true,

        },
    });
    console.log('MainWindow ID is:' + mainWin.id)
    console.log('MainWindow Title is:' + mainWin.getTitle())
    mainWinId = mainWin.id;
    mainWin.once('ready-to-show', () => mainWin.show());
    mainWin.on('close',(event) => {
        event.preventDefault()
        mainWin.hide()
    })
    //Electron CORS 问题处理
    mainWin.webContents.session.webRequest.onBeforeSendHeaders(
        (details, callback) => {
            callback({ requestHeaders: { Origin: '*', ...details.requestHeaders } });
        },
    );

    mainWin.webContents.session.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                'Access-Control-Allow-Origin': ['*'],
                // We use this to bypass headers
                'Access-Control-Allow-Headers': ['*'],
                ...details.responseHeaders,
            },
        });
    });
    //↑↑↑↑ 使用了 Electron 内置的网络请求钩子方法修改HTTP Header ↑↑↑↑
    mainWin.loadFile(path.join(__dirname,'web','index.html')).then(() => {   //mainWin.loadURL('http://127.0.0.1:5173/')
        mainWin.webContents.openDevTools()
        console.log('MainWindow Title is:' + mainWin.getTitle())
        console.log('MainWindow WebContents.URL is:' + mainWin.webContents.getURL())

    });
}

function restoreMainWindow(){
    if (getMainWinId()){
        getMainWin().restore();
        getMainWin().show();
        getMainWin().focus();
    }
}
