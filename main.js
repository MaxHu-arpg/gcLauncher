const {app, BrowserWindow, shell} = require('electron')
const path = require("path");

console.log('App Name: ' + app.getName());
console.log('App Version: ' + app.getVersion());
console.log('Inner Version:')
console.log(process.versions)
console.log('process.env:')
console.log(process.env)
console.log('Is Packaged: ' + app.isPackaged);
console.log('process.argv:' + process.argv)
// console.log(path.join(__dirname, 'preload.js'));
// console.log(__filename);

require('./src/app.on')
const MainWindow = require(path.join(__dirname,'src','MainWindow','MainWindow.js'))

//获得单例锁
const gotTheLock = app.requestSingleInstanceLock()
//获得单例锁失败，正在打开第二个实例app，退出
if (!gotTheLock) {
    app.quit()
}
//获得单例锁成功，此为单例app，启动应用
else {//如果此为已打开单例，app.on将接收到second-instance事件
    app.on('second-instance', (event, commandLine, workingDirectory, additionalData) => {
        // 输出从第二个实例中接收到的数据
        console.log("[info]  Second Instance will not be created!'")
        // 有人试图运行第二个实例，我们应该关注我们的窗口
        MainWindow.restoreMainWindow();
    })
    // 创建 mainWin, 加载应用的其余部分, etc...
    app.on('ready', () => {
        //创建主窗口
        MainWindow.createMainWindow();
        //主窗口未成功创建则创建，在首次启动时
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                console.log('BrowserWindow.getAllWindows().length is 0')
                MainWindow.createMainWindow();
            }
        });
        //托盘设置
        const {setUpTray} = require(path.join(__dirname,'src','tray','tray.js'))
        setUpTray();
    })
    //在此列出允许外链url
    app.on('web-contents-created', (event, contents) => {
        console.log('web-contents-created');//这个事件在new BrowserWindow时会触发
        //这个“打开窗口的处理函数”(WindowOpenHandler)（也就是setWindowOpenHandler(这里的箭头函数)）只在父窗口中创建子窗口时或在父窗口导航到其他窗口时会回调
        contents.setWindowOpenHandler(({url, frameName, features, disposition}) => {
            console.log('Run WindowOpenHandler');
            console.log('Child Window Url is:' + url)
            console.log('Child Window frameName is:' + frameName)
            console.log('Child Window features is:' + features)
            console.log('Child Window disposition is:' + disposition)
            // 在此示例中我们要求操作系统
            // 在默认浏览器中打开此事件的 url。
            //
            // 关于哪些URL应该被允许通过shell.openExternal打开，
            // 请参照以下项目。
            if (url.includes('http')) {
                if (disposition === 'new-window') {return {action: 'allow'}}//这个最好不要，在程序内访问外部网页，危险
                else {
                    setImmediate(() => {
                        console.log('open website')
                        shell.openExternal(url)
                    })
                }
            }
            if (disposition === 'new-window') {return {action: 'allow'}}
            return {action: 'deny'}
        })
    });
    //所有窗口被关闭时正常退出
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
}
