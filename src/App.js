import React, { useState, useRef, useEffect } from 'react'
import Connection from './components/Connection.js'
import Queue from './components/Queue.js'
import Settings from './components/Settings.js'
import Notification from './components/Notification.js'
import { Spinner, Tabs, Tab, Button, Fade } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { setNotification } from './reducers/notificationSlice.js'
import commandService from './services/commands.js'

const App = () => {
    const [ips, setIps] = useState([])
    const [isSearching, setSearching] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        const initStoredIps = JSON.parse(localStorage.getItem('ipsFound'))
        if ( initStoredIps )
        {
            setIps(initStoredIps)
        }
    }, [])

    const ipsFoundRef = useRef(ips)
    ipsFoundRef.current = ips

    const handleSearch = async () => {
        setSearching(true)

        const searchForIPsRes = await commandService.searchForIPs()
        //console.log('searchForIP App call res:', searchForIPsRes)
        if ( !searchForIPsRes || !searchForIPsRes.data.success )
        {
            //console.log('Error in searching for ips...')
            dispatch(setNotification('Error in searching for ips...'))
            return setSearching(false)
        }

        let timeoutId = null
        const id = setInterval(async () => {
            console.log('Searching...')

            if ( !timeoutId )
            {
                timeoutId = setTimeout(() => {
                    clearInterval(id)
                    // console.log('ipsFoundRef.current:', ipsFoundRef.current)
                    if ( ipsFoundRef.current.length == ips.length )
                    {
                        dispatch(setNotification('No new ips found...'))
                    }
                    else
                    {
                        let newIps = [...ipsFoundRef.current]
                        const existingStoredIps = JSON.parse(localStorage.getItem('ipsFound'))
                        if ( existingStoredIps )
                        {
                            console.log('existingStoredIps:', existingStoredIps)
                            // check if new ips have not been seen before
                            for ( let i = 0; i < newIps.length; ++i )
                            {
                                // if found an old matching ip, remove it
                                if ( existingStoredIps.find(oldIp => oldIp === newIps[i]) )
                                {
                                    console.log('found old match:', newIps[i])
                                    newIps.splice(i, 1)
                                }
                            }
                        }   

                        if ( newIps.length > 0 )
                        {
                            // include existing unique ips after removing all dupes from new ips found
                            newIps = [...newIps, ...existingStoredIps]
                            console.log('replacing locStorage:', newIps)
                            localStorage.setItem('ipsFound', JSON.stringify(newIps));
                        }
                    }
                    setSearching(false)
                }, 3000)
            }

            let ipsFound = (await commandService.grabIPs()).data
            //console.log('grabIPs result ipsFound:', ipsFound)
            if ( ipsFound )
            {
                // when grabbing ips, we need to check for existing duplicates that were set from localStorage useEffect
                for ( let i = 0; i < ipsFound.length; ++i )
                {
                    if ( ips.includes( ipsFound[i]) )
                    {
                        console.log('found and removing existing match:', ipsFound[i], ips)
                        ipsFound.splice(i, 1)
                    }
                }

                // if all were removed, it was empty or all dupes
                if ( ipsFound.length > 0 )
                {
                    console.log('setting new unique ipsFound:', ipsFound)
                    setIps([...ipsFound, ...ips])
                }
            }
            else
            {
                clearInterval(id)
                if ( timeoutId )
                {
                    clearTimeout(timeoutId)
                }
                console.log('Error in grabbing devices...')
                dispatch(setNotification('Error in grabbing devices...'))
                return setSearching(false)
            }
        }, 1000)
    }

    const buildPage = () => {
        return (!isSearching && ips.length > 0) 
        ?
            <Connection ips={ips} handleSearch={handleSearch}/>
        :
            <div className='searchPage'>
                <Button 
                    variant="primary" 
                    size="lg"
                    style={{width: '100%'}}  
                    onClick={!isSearching ? handleSearch : null}
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
                <h2 className='title'>Denon-Plex-WebUI</h2>
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