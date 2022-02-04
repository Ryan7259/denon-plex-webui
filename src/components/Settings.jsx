import { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { setClientIP } from '../reducers/infoSlice'

const Settings = () => {
    const dispatch = useDispatch()
    const clientIP = useSelector(state => state.info.clientIP)
    const [ inputIP, setInputIP ] = useState('')

    useEffect(() => {
        if ( clientIP )
        {
            setInputIP(clientIP.replace('http://', ''))
        }
    }, [clientIP])

    const handleSetClientIP = (e) => {
        localStorage.setItem('settings', JSON.stringify({ clientIP: inputIP }))
        dispatch(setClientIP(inputIP))
    }

    const handleClearClientIP = () => {
        dispatch(setClientIP(''))
        setInputIP('')
    }

    return (
        <div className='settings'>
            <div style={{alignSelf: 'center'}}>My Plex Auth'd IP (w/ port #): </div>
            <input style={{width: '250px', backgroundColor: 'rgb(200,200,200)', color: 'black'}} value={inputIP} onChange={(e) => setInputIP(e.target.value)} placeholder='Ex: 192.168.7.208:32400'/>
            <Button style={{width: '75px'}} onClick={handleSetClientIP}>Set</Button>
            <Button disabled={!inputIP || inputIP.length < 1} variant='danger' onClick={handleClearClientIP}>Clear</Button>
        </div>
    )
}

export default Settings