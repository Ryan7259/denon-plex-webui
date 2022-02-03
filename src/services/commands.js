//import axios from 'axios'
//axios.defaults.baseURL = 'http://localhost:3001';
import playerStates from '../utils/playerStates'
import { sendIPC } from '../client-ipc'

const grabIPs = async () => {
    try
    {
        //const grabIPsRes = await axios.get('/api/grabIPs')
        const grabIPsRes = await sendIPC('grabIPs')
        console.log('grabIPsRes:', grabIPsRes)
        if ( grabIPsRes )
        {
            return grabIPsRes
        }
    }
    catch (error)
    {
        console.log('grabIPs command error:', error)
    }
}

const searchForIPs = async () => {
    try
    {
        //const searchForIPsRes = await axios.get('/api/searchIPs')
        const searchForIPsRes = await sendIPC('searchForIPs')
        console.log('commands.js searchForIPsRes:', searchForIPsRes)
        if ( searchForIPsRes )
        {
            return searchForIPsRes
        }
    }
    catch ( error )
    {
        console.log('commands.js searchForIPs command error:', error)
    }
}

const sendCommand = async (command) => {
    /*
    console.log('commands.js command:', command)
    console.log('commands.js command type:', typeof command)
    */
    try 
    {
        const sendCmdRes = await sendIPC('sendCmd', command)
        console.log('commands.js sendCmdRes:', sendCmdRes)
        if ( sendCmdRes && sendCmdRes.heos.result === 'success' )
        {
            return sendCmdRes
        }
    }
    catch (error) 
    {
        console.log('commands.js sendCommand error:', error)
    }
}

const connectToIp = async (address) => {
    try 
    {
        const conRes = await sendIPC('connectToIp', address)
        //console.log(`commands.js connected to ${address}`)
        //console.log('commands.js connectToIp conRes:', conRes)
        if ( conRes )
        {
            return conRes
        }
    }
    catch (error) {
        console.log('commands.js connectToIP error:', error)
    }
}

const disconnectFromIp = async () => {
    try 
    {
        const disConRes = await sendIPC('disconnectFromIp')
        console.log('commands.js disConRes:', disConRes)

        if ( disConRes )
        {
            return disConRes
        }
    }
    catch (error) {
        console.log('command.js disconnectFromIp error:', error)
    }
}

const getCurrentMedia = async (pid) => {
    try
    {
        const currMediaRes = await sendCommand(`player/get_now_playing_media?pid=${pid}`)
        //console.log('currMediaRes:', currMediaRes)
        // check if we have a payload(atleast one song in existing player queue) and if it's a type song
        // type station is not supported
        // otherwise, leave currentItem empty
        if ( currMediaRes && Object.keys(currMediaRes.payload).length > 0 
        && currMediaRes.payload.type && currMediaRes.payload.type === 'song' )
        {
            //console.log('Setting new curr. playing media:', currMediaRes.payload)
            //console.log('Replacing this non-dupe:', currentItem)
            return currMediaRes
        }
    }
    catch(error)
    {
        console.log('command.js getCurrentMedia error:', error)
    }
}

const getVolume = async (pid) => {
    try
    {
        const playerVolRes = await sendCommand(`player/get_volume?pid=${pid}`)
        //console.log('playerVolRes:', playerVolRes)
        if ( playerVolRes )
        {
            // vol level returned in a message string as a url parameter, so remove rest of str and parse as int
            const volMatch = playerVolRes.heos.message.match(/(?<=.*level=)\d{1,3}/)
            if ( volMatch )
            {
                const existingVolInt = parseInt(volMatch[0])
                return existingVolInt
            }
        }
    }
    catch(error)
    {
        console.log('command.js getVolume error:', error)
    }
}

const setVolume = async (pid, newVolVal) => {
    try
    {
        const setVolRes = await sendCommand(`player/set_volume?pid=${pid}&level=${newVolVal}`)
        //console.log('setVolRes Playbar call:', setVolRes)
    }
    catch(error)
    {
        console.log('command.js setVolume error:', error)
    }
}


const getPlayMode = async (pid) => {
    try
    {
        const playModeRes = await sendCommand(`player/get_play_mode?pid=${pid}`)
        //console.log('playModeRes:', playModeRes)
        if ( playModeRes )
        {
            const repeatMatch = playModeRes.heos.message.match(/(?<=.*repeat=).*(?=&)/)
            const shuffleMatch = playModeRes.heos.message.match(/(?<=.*shuffle=).*/)
            if ( repeatMatch && shuffleMatch )
            {
                const repeatStrVal = repeatMatch[0]
                const shuffleStrVal = shuffleMatch[0]
                console.log('Repeat mode:', repeatStrVal, ', Shuffle mode:', shuffleStrVal)
                return { repeatStrVal, shuffleStrVal }
            }
        }
    }
    catch(error)
    {
        console.log('command.js getPlayMode error:', error)
    }
}

const setPlayMode = async (pid, shuffleMode = null, repeatMode = null) => {
    if ( shuffleMode || repeatMode )
    {
        try
        {
            const setPlayModeRes = await sendCommand(`player/set_play_mode?pid=${pid}${repeatMode ? `&repeat=${repeatMode}` : ''}${shuffleMode ? `&shuffle=${shuffleMode}` : ''}`)
            console.log('setPlayModeRes:', setPlayModeRes)
        }
        catch(error)
        {
            console.log('command.js setPlayMode error:', error)
        }
    }
}

const getPlayState = async (pid) => {
    try
    {
        const playStateRes = await sendCommand(`player/get_play_state?pid=${pid}`)
        //console.log('playStateRes:', playStateRes)
        if ( playStateRes )
        {
            const playStateMatch = playStateRes.heos.message.match(/(unknown|play|pause|stop)$/)
            if ( playStateMatch )
            {
                let playStateStrVal = playStateMatch[0]
                console.log('init play state:', playStateStrVal)
        
                if ( playStateStrVal === 'unknown' )
                {
                    playStateStrVal = playerStates.playMode.stopped
                }
        
                return playStateStrVal
            }
        }
    }
    catch(error)
    {
        console.log('command.js getPlayState error:', error)
    }

}

const setPlayState = async (pid, playMode) => {
    try
    {
        await sendCommand(`player/set_play_state?pid=${pid}&state=${playMode}`)
    }
    catch (error)
    {
        console.log('command.js setPlayState error:', error)
    }
}

const getQueue = async (pid) => {
    // populate virtual queue from from physical player's queue
    try
    {
        const getQueueRes = await sendCommand(`player/get_queue?pid=${pid}`)
        //console.log('getQueueRes:', getQueueRes)
        if ( getQueueRes )
        {
           return getQueueRes.payload
        }
    }
    catch(error)
    {
        console.log('command.js getQueue error:', error)
    }
}

const clearQueue = async (pid) => {
    try
    {
        const clearQueueRes = await sendCommand(`player/clear_queue?pid=${pid}`)
        //console.log('clearQueueRes:', clearQueueRes)
        if ( clearQueueRes )
        {
            return clearQueueRes
        }
    }
    catch(error)
    {
        console.log('command.js clearQueue error:', error)
    }
}

export default {
    grabIPs,
    searchForIPs,
    sendCommand,
    connectToIp,
    disconnectFromIp,
    getCurrentMedia,
    getVolume,
    setVolume,
    getPlayMode,
    setPlayMode,
    getPlayState,
    setPlayState,
    getQueue,
    clearQueue
}