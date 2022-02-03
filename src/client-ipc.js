import { v4 as uuidv4 } from 'uuid';
const { connectIPC, emitIPC } = window.serverAPI
import store from './store'
import { setClientIP } from './reducers/infoSlice'
/*
    electron main loads
        fork nodeipc server process
    in preload, create a bridge to ipc connect function with a callback that will setup handlers in renderer
    in our renderer, connect and setup handlers in callback
*/

/* 
    1. in react app, call await on a async func to be sent by IPC to server socket
    2. this Map saves a request's promise resolve/reject funcs tied to an id, before emitting request to be exec'd on server process
    3. server execs request and emits result in a promise back to client with id
    4. client IPC receives message as a reply/error type with id, get same mapping in replyHandlers and resolve or reject
    5. react app await finishes and receives resolved/rejected result
*/
let replyHandlers = new Map()

/*
    once server connects, it will start transmitting events from telnet device
    on our client, we don't want to attach evt handler until that is done first, which is signaled by info reducer filling out p(layer)id states
    so attach real event handler in Playbar.js after connection is established
*/
let IPCEventHandler = () => {}
export const setIPCEventHandler = (handler) => {
    IPCEventHandler = handler
}
export const clearIPCEventHandler = () => {
    IPCEventHandler = () => {}
}

// Proxy acts as the event queue's push event handler so we can act on our events as soon as server emits them to our client
const proxyEventQueue = new Proxy([], {
    set: function(_target, _property, value, _receiver) {      
        IPCEventHandler(value)
        return true;
    }
}) 

connectIPC({
    connect: (data) => {
        if ( data )
        {
            store.dispatch(setClientIP(data+':32400'))
        }
        else
        {
            console.log('Connected to server!');
        }
    },

    disconnect: () => {
        console.log('Disconnected from server!');
    },
    
    message: (data) => {
        let msg = JSON.parse(data)
        const { id, type, result } = msg

        console.log('Recv\'d msg from server:', msg)
        if ( type === 'reply' )
        {
            replyHandlers.get(id).resolve(result)
        }
        else if ( type === 'error' )
        {
            replyHandlers.get(id).reject(error)
        }

        if ( replyHandlers.has(id) )
        {
            replyHandlers.delete(id)
        }
    },

    event: (data) => {
        proxyEventQueue.push(JSON.parse(data))
    }
})

export const sendIPC = (cmd, args) => {
    return new Promise((resolve, reject) => {
        let id = uuidv4()
        replyHandlers.set(id, {resolve, reject})
        emitIPC('message', JSON.stringify({id, cmd, args}))
    })
}