const { app, BrowserWindow } = require('electron');
const path = require('path')
const { fork } = require('child_process')

const createServerProcess = () => {
    // stdio inherit means reuse the fds from main process
    // so that console logging goes back to main process terminal
    // express: fork('./src/server.js', {stdio: 'inherit'});
    fork(path.join(__dirname, 'src/server-ipc.js'))
}

const createWindow = () => {
    const win = new BrowserWindow({
        height: 800,
        width: 1200,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'src/client-preload.js')
        }
    });
    win.loadFile(path.join(__dirname, 'dist/index.html'))
}

app.whenReady().then(() => {
    createServerProcess();
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})