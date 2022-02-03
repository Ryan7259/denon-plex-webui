const ipc = require('node-ipc').default
const { searchForIPs, grabIPs } = require('./search.js')
const { connectToIp, disconnectFromIp, sendCmd, connection } = require('./connect.js')
const { networkInterfaces } = require('os')

const handlers = {
    searchForIPs,
    grabIPs,
    connectToIp,
    disconnectFromIp,
    sendCmd,
    connection
}

ipc.config.id = 'server'
ipc.config.retry = 1500;
ipc.config.silent = true
let connected = false

ipc.serve(
    () => {
        ipc.server.on('connect', (socket) => {
            for ( const e of networkInterfaces().Ethernet )
            {
                if ( e.family === 'IPv4' && !e.internal )
                {
                    ipc.server.emit(socket, 'connect', e.address);
                    break;
                }
            }
        })

        ipc.server.on('message', (data, socket) => {
            let msg = JSON.parse(data)
            const { id, cmd, args } = msg

            console.log('Recv\'d msg from client:', msg)

            if ( handlers[cmd] )
            {
                handlers[cmd](args).then(result => {
                    if ( !connected && cmd === 'connectToIp' )
                    {
                        console.log('Connecting to device...')
                        connected = true
                        connection.on('data', data => {
                            const dataStr = data.toString()
                            //console.log('data event:', dataStr)
                        
                            const evtMatches = dataStr.match(/{[\s]*"heos": {\n.*command.*event\/[^}]*}\n}[\s]*/g)
                            if ( evtMatches )
                            {
                                for ( const evt of evtMatches )
                                {
                                    ipc.server.emit(
                                        socket, 
                                        'event', 
                                        JSON.stringify(JSON.parse(evt))
                                    )
                                }
                            }
                        })
                    }
                    else if ( connected && cmd === 'disconnectFromIp' )
                    {
                        console.log('Disconnecting from device...')
                        connection.on('data', () => {})
                        connection.end()
                        connected = false
                    }

                    ipc.server.emit(
                        socket,
                        'message',
                        JSON.stringify({ id, type: 'reply', result })
                    )
                })
                .catch(error => {
                    ipc.server.emit(
                        socket,
                        'message',
                        JSON.stringify({ id, type: 'error', error })
                    )
                })
            }
            else
            {
                ipc.server.emit(
                    socket,
                    'message',
                    JSON.stringify({ id, type: 'error', error: `Unknown command: ${cmd}(${args})` })
                )
            }
        });
    }
)

ipc.server.start();