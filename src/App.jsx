import { useState, useEffect } from 'react'
import Connection from './components/Connection'
import Queue from './components/Queue'
import Settings from './components/Settings'
import Notification from './components/Notification'
import { Spinner, Tabs, Tab, Button, Fade } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { setNotification } from './reducers/notificationSlice'
import commandService from './services/commands'
import { startReplyHandler } from './tauri-handler'

const App = () => {
    const [ips, setIps] = useState(new Set())
    const [isSearching, setSearching] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        startReplyHandler();

        const initStoredIps = JSON.parse(localStorage.getItem('ipsFound'))
        if ( initStoredIps )
        {
            setIps(initStoredIps)
        }
    }, [])

    const handleSearch = async () => {
        if (isSearching) return

        setSearching(true)

        try {
            const searchForIPsRes = await commandService.searchForIPs()
            console.log('App searchForIPsRes:', searchForIPsRes)
            if ( !searchForIPsRes )
            {
                console.log('Error in searching for ips...')
                dispatch(setNotification('Error in searching for ips...'))
                return setSearching(false)
            }

            if ( searchForIPsRes.length < 1 )
            {
                console.log('No new devices found!')
                dispatch(setNotification('No new devices found...'))
                return setSearching(false)
            }

            let newIpSet = new Set(searchForIPsRes)
            const existingStoredIps = JSON.parse(localStorage.getItem('ipsFound'))
            if ( existingStoredIps )
            {
                console.log('existingStoredIps:', existingStoredIps)
                // check if new ips have not been seen before
                for ( storedIp of existingStoredIps )
                {
                    // if found an old matching ip, remove it
                    if ( !newIpSet.has(storedIp) )
                    {
                        newIpSet.add(storedIp);
                    }
                }
            }   

            console.log('newIpSet:', newIpSet)
            const newIps = Array.from(newIpSet);

            localStorage.setItem('ipsFound', JSON.stringify(newIps));
            setIps(newIps);

            return setSearching(false)
        }   
        catch(e)
        {
            console.log('Error in grabbing devices...')
            dispatch(setNotification('Error in grabbing devices...'))
            return setSearching(false)
        }
    }

    const clearSearchHistory = () => {
        setIps([])
        localStorage.clear();
    }

    const buildPage = () => {
        return (!isSearching && ips.length > 0) 
        ?
            <Connection ips={ips} handleSearch={handleSearch} clearSearchHistory={clearSearchHistory}/>
        :
            <div className='searchPage'>
                <Button 
                    variant="primary" 
                    size="lg"
                    style={{width: '100%'}}  
                    onClick={handleSearch}
                    disabled={isSearching}
                >
                    {isSearching ? 
                        <div>
                            <span>Searching </span>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                            />
                        </div>
                    : 
                        'Search for Denon devices'
                    }
                </Button>
                <ul>
                    {(isSearching && ips.length > 0) ? ips.map(ip => <Fade key={ip} in={true} appear={true}><li style={{fontSize: '20px'}}>{ip}</li></Fade>) : null}
                </ul>
            </div>
    }

    return (
            <div className='main'>
                <Notification />
                <Tabs className='tabs' defaultActiveKey="queue">
                        <Tab className='c' eventKey="browse" title="Browse">
                            <div className='cMain'>
                                { buildPage() }
                            </div>
                        </Tab>
                        <Tab className='q' eventKey="queue" title="Queue">
                            <Queue />
                        </Tab>
                        <Tab className='s' eventKey="settings" title='Settings'>
                            <Settings />
                        </Tab>
                </Tabs>
            </div>
    )
}

export default App