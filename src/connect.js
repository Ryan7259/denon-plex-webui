const Telnet = require('telnet-client')
const connection = new Telnet()

const connectToIp = async (address) => {
    const params = {
        host: `${address}`,
        port: 1255,
        negotiationMandatory: false,
    }

    try
    {
        const conRes = await connection.connect(params)
        const prettifyRes = await sendCmd('system/prettify_json_response?enable=on')
        const unregRes = await sendCmd('system/register_for_change_events?enable=off')
        return Promise.all([conRes, prettifyRes, unregRes]).then(values => {
            console.log('connected, prettified, and unreg\'d events!')
            return Promise.resolve({success: true})
        })
        .catch( error => {
            console.log('connect.js Failed connection or prettify or unregister!', error)
            return Promise.reject(error)
        })
    }
    catch(error) 
    {
        console.log('connect.js connectToIp error:', error)
        return Promise.reject(error)
    }
}

const disconnectFromIp = async () => {
    try
    {
        await connection.end()
        return Promise.resolve({ success: true })
    }
    catch(error)
    {
        console.log('connect.js disconnectFromIp error:', error)
        return Promise.reject(error)
    }
}
/*
lazy match w/ this format: {heos{(cmd)!(command under process)}, (payload[]|,options[])*?}
*/

// waitfor regex seems to get overwritten if sendCmd is called more than once or close together?
// need to make it wait for old one to finish and be set to null
let cmdInProcess = null
const sendCmd = async (cmd) => {
    if ( cmdInProcess )
    {
        const isReady = await cmdInProcess
        if ( isReady )
        {
            console.log(`Ready for ${cmd}`)
        }
    }

    cmdInProcess = new Promise(async (resolve, reject) => {
        try
        {
            console.log('sendCmd:', cmd)
            const cmdMatch = cmd.match(/.*(?=\?)|.*$/)[0].replace('/', '\\/')
            console.log('cmdMatch:', cmdMatch)

            const matchRegex = `{[\\s]*"heos": {\\n.*${cmdMatch}.*\\n.*\\n(?!.*command under process)[\\s\\S]*?\\n}{1}`
            
            const sendRes = await connection.send('heos://' + cmd, {
                waitfor: matchRegex
            }, (error, res) => {
                if ( error )
                {
                    console.log('waitfor error:', error)
                }
                //console.log(`waitfor used with ${matchRegex}:`, res)
            })

            if ( sendRes )
            {
                //const sendResCleaned = sendRes.replace(/[\s]*{[\s]*"heos": {\n.*\n.*\n.*command under process.*\n.*\n}/, '')
                const matchRes = sendRes.match(matchRegex) 
                if ( matchRes )
                {
                    console.log(`Matching object for ${cmdMatch}:`, matchRes[0])
                    try
                    {
                        const resObj = JSON.parse(matchRes[0])
                        resolve(resObj)
                    }
                    catch(error)
                    {
                        console.log('sendCmd parse error:', error)
                        console.log('sendCmd parse OG str:', sendRes)
                        reject(error)
                    }
                }
            }
        }
        catch(error)
        {
            console.log('connect.js sendCmd error:', error)
            reject(error)
        }
    })

    const doneWithCmd = await cmdInProcess
    if ( doneWithCmd )
    {
        cmdInProcess = null
        return doneWithCmd
    }
}

module.exports = {
    connectToIp,
    disconnectFromIp,
    sendCmd,
    connection
}

connection.on('timeout', () => {
    console.log('timeout event!')
})

/*
connection.on('error', (error) => {
    console.log('error event:', error)
})
*/