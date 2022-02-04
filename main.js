const { app, BrowserWindow } = require('electron');
const path = require('path')
const { fork } = require('child_process')

if ( process.env.NODE_ENV === 'development' )
{
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, 'node_modules', 'electron', 'dist', 'electron.exe')
    })
}

const createServerProcess = () => {
    // stdio inherit means reuse the fds from main process
    // so that console logging goes back to main process terminal
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

    if ( process.env.NODE_ENV === 'development' )
    {
        win.loadURL('http://localhost:3000')
    }
    else
    {
        win.loadFile(path.join(__dirname, 'dist/index.html'))
    }
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