const ipc = require('node-ipc').default
const { contextBridge } = require('electron')

const socketId = 'server'
ipc.config.silent = true

const connectIPC = (handlers) => {
    ipc.connectTo(
        socketId,
        () => {
            ipc.of[socketId].on('message', handlers.message),
            ipc.of[socketId].on('connect', handlers.connect),
            ipc.of[socketId].on('disconnect', handlers.disconnect),
            ipc.of[socketId].on('event', handlers.event)
        }
    )
}

const emitIPC = (event, data = {}) => {
    ipc.of[socketId].emit(event, data)
}

contextBridge.exposeInMainWorld('serverAPI', {
    connectIPC,
    emitIPC
})

