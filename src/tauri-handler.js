import { invoke } from '@tauri-apps/api/tauri'
import { listen } from '@tauri-apps/api/event'
import store from './store'
import { setClientIP } from './reducers/infoSlice'

export const find_denon_devices = async () => {
    return new Promise(resolve => {
        invoke('find_denon_devices').then((devices) => {
            resolve(devices);
        });
    })
}

export const connect_to_device = async (deviceIp) => {
    return new Promise((resolve, reject) => {
        invoke('connect_to_device', { deviceIp }).then((clientIP) => {
            console.log(`tauri connected to device from ${clientIP}!`)
            store.dispatch(setClientIP(clientIP));
            resolve({success: true})
        })
        .catch(e => {
            console.log('tauri failed to connect to device; err=', e);
            reject({error: e})
        });
    })
}

export const disconnect_from_device = () => {
    invoke('disconnect_from_device');
}

export let clearEventHandler = null;
export const setEventHandler = async (eventHandler) => {
    clearEventHandler = await listen('event', e => {
        console.log('got an event')
        eventHandler(e.payload);
    });
}

let replyMap = new Map();
export const send_command = async (args) => {
    return new Promise((resolve, reject) => {
        replyMap.set(args, {resolve, reject});
        invoke('send_command', { args }).then(() => {
            console.log('invoked and mapped', args)
        }).catch(err => {
            console.log("send_command err:", err)
        })
    })
}

export const startReplyHandler = async () => {
    console.log('Starting reply handler...');

    await listen('reply', event => {
        console.log('got a reply event')
        console.log(event)

        // reformat string here. cut all http like param types
        // either match is cmd, cmd+message, or cutout HTTP like params i.e. '&count=0'

        let heos = event.payload.heos;

        let cmd1 = heos.command;
        let cmd2 = heos.command+'?'+heos.message
        let cmd3 = cmd2.replace(/&.*/, ''); // remove all & params
        let cmd4 = cmd2.match(/.*?&.*?(?=&)/) // remove all after the sid/cid container params

        let cmd = null
        if ( replyMap.has(cmd1) ) {
            cmd = cmd1
        }
        else if ( replyMap.has(cmd2) )
        {
            cmd = cmd2
        }
        else if ( replyMap.has(cmd3) )
        {
            cmd = cmd3
        }
        else if ( cmd4 && replyMap.has(cmd4[0]) )
        {
            cmd = cmd4[0]
        }

        if ( cmd )
        {
            console.log('found match cmd:', cmd)
            replyMap.get(cmd).resolve(event.payload);
            replyMap.delete(cmd);

            console.log("Matched response to reply!");
        }
        else {
            console.log("Couldn't match reply!");
        }
    });
}