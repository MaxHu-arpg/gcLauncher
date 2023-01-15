const {app, Tray, Menu, nativeImage} = require('electron')
const path = require("path");
const {restoreMainWindow} = require(path.join(__dirname,'..','MainWindow','MainWindow.js'));

exports.setUpTray = function () {
    const iconPath = path.join(__dirname, '..', 'Ganyu.ico')
    //创建托盘图标
    let tray = new Tray(nativeImage.createFromPath(iconPath))
    //设置鼠标指针在托盘图标上悬停时显示的文本
    tray.setToolTip(app.name);

    const contextMenu = Menu.buildFromTemplate([
        {label: '打开主面板', click() {restoreMainWindow()}},
        {label: '退出', click() {app.exit()}},
    ])
    //设置托盘上下文菜单
    tray.setContextMenu(contextMenu)
    // windows下双击托盘图标打开app
    tray.on('double-click', () => {
        restoreMainWindow()
    })
}

// console.log(module)
