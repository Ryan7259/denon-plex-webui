const Client = require('node-ssdp').Client
const client = new Client()

let uniqueDenonIps = []
let sentDenonIps = []
client.on('response', (headers, statusCode, rInfo) => {

    //console.log('statusCode:', statusCode)
    const deviceIp = rInfo.address
    //console.log('deviceIp:', rInfo.address)

    if ( !(uniqueDenonIps.includes(deviceIp)) && (headers.ST === 'urn:schemas-denon-com:device:ACT-Denon:1') )
    {
        uniqueDenonIps.push(deviceIp)
        console.log('uniqueDenonIps:', uniqueDenonIps)
    }
})

const searchForIPs = () => {
    console.log('Attempting search...')
    try
    {
        uniqueDenonIps = []
        sentDenonIps = []

        client.search('urn:schemas-denon-com:device:ACT-Denon:1')
        console.log('Executed search...')
        return Promise.resolve({success: true})
    }
    catch(error)
    {
        return Promise.reject({success: false, error})
    }
}
const grabIPs = () => {
    try
    {
        console.log('Grabbing ips...')

        for ( const uniqueIp of uniqueDenonIps )
        {
            if ( !sentDenonIps.includes(uniqueIp) )
            {
                sentDenonIps.push(uniqueIp)
            }
        }

        return Promise.resolve(sentDenonIps)
    }
    catch(error)
    {
        return Promise.reject(error)
    }
}

module.exports = {
    searchForIPs,
    grabIPs
}