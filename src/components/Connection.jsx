import { useState } from 'react'
import Containers from './Containers'
import commandService from '../services/commands'
import { Button } from 'react-bootstrap'
import { clearInfo, setPid, setReadyForIPCEvents} from '../reducers/infoSlice'
import { setNotification } from '../reducers/notificationSlice'
import { useSelector, useDispatch } from 'react-redux'
import { clearIPCEventHandler } from '../client-ipc'

const Connection = ({ ips, handleSearch, clearSearchHistory }) => {
    const [ connectedAddress, setConnectedAddress ] = useState('')
    const [ isConnected, setConnected ] = useState(false)

    const dispatch = useDispatch()
    const readyForIPCEvents = useSelector(state => state.info.readyForIPCEvents)

    const handleConnect = async (address) => {
        const conRes = await commandService.connectToIp(address)
        //console.log('conRes:', conRes)
        if ( conRes && conRes.success )
        {
            setConnectedAddress(address)
            setConnected(true)
            
            const getPlayersRes = await commandService.sendCommand('player/get_players')
            //console.log('getPlayersRes:', getPlayersRes)
            if ( getPlayersRes )
            {
                const newPid = getPlayersRes.payload.find(players => players.ip === address).pid
                dispatch(setPid(newPid))
            }
        }
        else
        {
            if ( conRes )
            {
                console.log('Connection.js handleConnect error:', conRes)
            }
            dispatch(setNotification('Failed to connect to player...'))
        }
    }

    const handleDisconnect = async () => {
        if ( !isConnected )
        {
            return
        }

        if ( readyForIPCEvents )
        {
            clearIPCEventHandler()
            dispatch(setReadyForIPCEvents(false))
            console.log('Ended SSE connection!')
        }
        const disConRes = await commandService.disconnectFromIp()
        if ( disConRes )
        {
            setConnectedAddress('')
            setConnected(false)
            dispatch(clearInfo())
        }
        else
        {
            console.log('Failed to close connection to server and player...')
            if ( disConRes )
            {
                console.log('disconnect error:', disConRes)
            }
        }
    }

    return (!isConnected)
    ?
    (
        <div className='connectionPrompt'>
            <h3 style={{gridColumn: '1/3'}}>Connect to a device</h3>
            <Button 
                style={{gridColumn: '1/2', marginRight: '5px', marginBottom: '10px'}} 
                size="lg" 
                onClick={handleSearch}
            >
                Re-scan for Denon devices
            </Button>
            <Button 
                style={{gridColumn: '2/3', marginBottom: '10px'}}
                variant="secondary" 
                size="lg" 
                onClick={clearSearchHistory}
            >
                Clear search history
            </Button>
            <div style={{
                gridColumn: '1/3',
                gridRow: '3',
                overflow: 'auto',
                height: 'auto'
            }}>
                {ips.map(ip => <div style={{fontSize: '20px'}} key={ip}><Button onClick={() => handleConnect(ip)}>connect</Button> {ip}</div>)}
            </div>
        </div>
    ) 
    :
        <>
        <div className='connectedPrompt'>
            <h5>Connected to {connectedAddress}</h5><Button variant='secondary' onClick={handleDisconnect}>disconnect</Button> 
        </div>
        <div className='containers'>
            <Containers />
        </div>
        </>
}

export default Connection