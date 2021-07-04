import React, { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { setPlexSeverIP } from '../reducers/infoSlice'

const Settings = () => {
    const dispatch = useDispatch()
    const plexIp = useSelector(state => state.info.plexIp)
    const [ inputIp, setInputIp ] = useState(plexIp ? plexIp.replace('http://', '') : '')

    useEffect(() => {
        const existingSettings = JSON.parse(localStorage.getItem('settings'))
        if ( existingSettings )
        {
            dispatch(setPlexSeverIP(existingSettings.plexIp))
            setInputIp(existingSettings.plexIp)
        }
    }, [])

    const setPlexIp = (e) => {
        e.preventDefault()
        e.stopPropagation()

        localStorage.setItem('settings', JSON.stringify({ plexIp: inputIp }))
        dispatch(setPlexSeverIP(inputIp))
    }

    return (
        <div className='settings'>
            <div style={{alignSelf: 'center'}}>Plex Server IP (w/ port #): </div>
            <input style={{width: '250px'}} value={inputIp} onChange={(e) => setInputIp(e.target.value)} placeholder='Ex: 192.168.7.208:32400'/>
            <Button style={{width: '75px'}} onClick={setPlexIp}>Set</Button>
        </div>
    )
}

export default Settings