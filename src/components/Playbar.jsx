import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { setCurrentItem, setPlayState, setDuration, setBlockEventUpdates } from '../reducers/playerSlice'
import { setQueue } from '../reducers/queueSlice'
import { setReadyForIPCEvents } from '../reducers/infoSlice'
import { setIPCEventHandler } from '../client-ipc'
import commandService from '../services/commands'
import findImg from '../utils/findImg'
import playerStates from '../utils/playerStates'
import eventTypes from '../utils/eventTypes'
import styled from 'styled-components';
import { setNotification } from '../reducers/notificationSlice'
import songEqual from '../utils/songEqual'
import { Image } from 'react-bootstrap'

const StyledPlayBar = styled.div`
    display: grid;
    grid-column: 1 / 3;
    grid-row: 3 / 4;
    gap: 1px;

    grid-template-columns: 256px minmax(600px, auto) minmax(200px, 350px);
    grid-template-rows: 81px 175px;

    text-align: center;
    font-size: 20px;
`

const StyledAlbumArtDiv = styled.div`
    display: grid;
    grid-column: 1 / 2;
    grid-row: 1 / 3;
    border: 0.5px solid rgb(70,70,70);;
    border-radius: 4px;
    user-select: none;
`

const StyledControlDiv = styled.div`
    border: 0.5px solid rgb(70,70,70);;
    border-radius: 4px;
    display: grid;
    grid-column: 2 / 3;
    grid-row: 2 / 3;
    grid-template-columns: 80px 80px 80px 80px 80px;

    justify-items: center;
    align-items: center;
    justify-content: center;

    overflow: hidden;
    grid-column-gap: 45px;

    & .disabled {
        opacity: 0.25; 
        pointer-events: none;
    }
    & div {
        cursor: pointer;
    }
    & svg {
        padding: 10px;
        width: 100%;
        height: 100%;
    }
    & div:hover path, div:hover rect {
        stroke: rgba(255,0,90,0.75);
        stroke-width: 3px;
    }
    & div:active path, div:active rect {
        stroke: rgba(0,0,0,1);
        stroke-width: 1.5px;
    }
`
const StyledVolDiv = styled.div`
    display: grid;
    grid-column: 3 / 4;
    grid-row: 2 / 3;

    grid-template-rows: auto auto;
    
    align-items: center;
    justify-items: center;

    border: 0.5px solid rgb(70,70,70);;
    border-radius: 4px;

    & rect:hover {
        stroke-width: 0.5px;
    }

    & .volNum {
    }

    & .volNum-show {
        opacity: 1;
        transition: opacity 250ms ease-in-out 0s;
    }

    & .volNum-hide {
        opacity: 0;
        transition: opacity 250ms ease-in-out 3s;
    }
`
export const Playbar = () => {
    const [ volume, setVolume ] = useState({value: 0, x: 0})
    const [ showVolume, setShowVolume ] = useState(false)
    const [ repeatState, setRepeatState ] = useState(playerStates.repeatMode.repeatOff)
    const [ shuffleState, setShuffleState ] = useState(playerStates.shuffleMode.shuffleOff)

    const dispatch = useDispatch()
    const info = useSelector(state => state.info)
    const playState = useSelector(state => state.player.playState)
    const currentItem = useSelector(state => state.player.currentItem, songEqual)
    const { queue } = useSelector(state => state.queue, shallowEqual)

    const blockEventUpdates = useSelector(state => state.player.blockEventUpdates)
    const blockRef = useRef(blockEventUpdates)
    blockRef.current = blockEventUpdates

    const toggleShuffleState = async () => {
        // states: 'shuffleOff, shuffleOn'
        // HEOS params: off, on
        if ( info.pid )
        {
            dispatch(setBlockEventUpdates(true))

            if ( shuffleState === playerStates.shuffleMode.shuffleOff )
            {
                setShuffleState(playerStates.shuffleMode.shuffleOn)
                await commandService.setPlayMode(info.pid, playerStates.shuffleMode.shuffleOn)
                console.log('Set shuffle ON on player...')
            }
            else
            {
                setShuffleState(playerStates.shuffleMode.shuffleOff)
                await commandService.setPlayMode(info.pid, playerStates.shuffleMode.shuffleOff)
                console.log('Set shuffle OFF on player...')
            }

            dispatch(setBlockEventUpdates(false))
        }
    }
    const switchRepeatState = async () => {
        // states: 'repeatOff', 'repeatAll', 'repeatOnce' 
        // HEOS params: on_all, on_one, off
        if ( info.pid )
        {
            dispatch(setBlockEventUpdates(true))
            
            if ( repeatState === playerStates.repeatMode.repeatOff )
            {
                setRepeatState(playerStates.repeatMode.repeatAll)
                await commandService.setPlayMode(info.pid, null, playerStates.repeatMode.repeatAll)
                console.log('Set REPEAT ALL on player...')
            }
            else if ( repeatState === playerStates.repeatMode.repeatAll )
            {
                setRepeatState(playerStates.repeatMode.repeatOnce)
                await commandService.setPlayMode(info.pid, null, playerStates.repeatMode.repeatOnce)
                console.log('Set REPEAT ONCE on player...')
            }
            else
            {
                setRepeatState(playerStates.repeatMode.repeatOff)
                await commandService.setPlayMode(info.pid, null, playerStates.repeatMode.repeatOff)
                console.log('Set REPEAT OFF on player...')
            }

            dispatch(setBlockEventUpdates(false))
        }
    }

    const togglePlayState = async () => {
        // set play state (play,pause,stop)
        if ( info.pid )
        {
            dispatch(setBlockEventUpdates(true))

            if ( playState === playerStates.playMode.playing )
            {
                dispatch(setPlayState(playerStates.playMode.paused))
                await commandService.setPlayState(info.pid, playerStates.playMode.paused)
                console.log('Set to PAUSE on player...')
            }
            else
            {
                dispatch(setPlayState(playerStates.playMode.playing))
                await commandService.setPlayState(info.pid, playerStates.playMode.playing)
                console.log('Set to PLAY on player...')
            }

            dispatch(setBlockEventUpdates(false))
        }
    }

    const canGoNext = () => {
        // if nothing in queue, return
        // switching to zero-based idx for queue array is negated by incrementing so already at proper next idx in virtual queue
        // disables next if already at end (follows behavior of HEOS apps)
        if ( currentItem && parseInt(currentItem.qid) < queue.length )
        {
            return true
        }
        return false
    }
    const handlePlayNext = async () => {
        // Doesn't change play state
        // Only works when connected to a player since no items will be displayed anyways
        if ( info.pid && canGoNext() )
        {
            dispatch(setBlockEventUpdates(true))

            const playNextRes = await commandService.sendCommand(`player/play_next?pid=${info.pid}`)
            // console.log('playNextRes:', playNextRes)
            if ( playNextRes )
            {
                console.log('Playing next song on player...')
            }

            dispatch(setBlockEventUpdates(false))
        }
    }

    const canGoBack = () => {
        // if nothing in queue, return
        // find prev item by currentItem.qid - 2 ( to make it a zero-based idx for queue array and to go back one )
        // check if already at 1st item in queue and keep it there if so (follows behavior of HEOS apps)
        if ( currentItem && parseInt(currentItem.qid) > 1 )
        {
            return true
        }
        return false
    }
    const handlePlayPrev = async () => {
        // Doesn't change play state
        // Only works when connected to a player since no items will be displayed anyways
        // Rewind to 0:00 time 1st click and if clicked 2nd time fast enough, go back to prev. song
        if ( info.pid && canGoBack())
        {
            dispatch(setBlockEventUpdates(true))

            const playPrevRes = await commandService.sendCommand(`player/play_previous?pid=${info.pid}`)
            // console.log('playPrevRes:', playPrevRes)
            if ( playPrevRes )
            {
                console.log('Playing prev. song on player...')
            }

            dispatch(setBlockEventUpdates(false))
        }
    }

    // store maxVolWidth on initial render for setting existing volume from a player connection
    const maxVolWidth = 375

    // on pid change get initial player state data
    useEffect(() => {
        const setInitPlayerState = async () => {

            const existingVolInt = await commandService.getVolume(info.pid)
            if ( existingVolInt >= 0 )
            {
                setVolume({ 
                    value: existingVolInt, 
                    x: ((maxVolWidth*existingVolInt)/100.0)
                })
            }

            const { repeatStrVal, shuffleStrVal } = await commandService.getPlayMode(info.pid)
            //console.log('playModeRes:', playModeRes)
            if ( repeatStrVal && shuffleStrVal )
            {
                setRepeatState(repeatStrVal)
                setShuffleState(shuffleStrVal)
            }

            const playStateStrVal = await commandService.getPlayState(info.pid)
            //console.log('playStateRes:', playStateRes)
            if ( playStateStrVal )
            {
                if ( playStateStrVal === playerStates.playMode.stopped )
                {
                    dispatch(setCurrentItem(null))
                }
                dispatch(setPlayState(playStateStrVal))
            }

            const currMediaRes = await commandService.getCurrentMedia(info.pid)
            if ( currMediaRes )
            {
                //console.log('Setting new curr. playing media:', currMediaRes.payload)
                //console.log('Replacing this non-dupe:', currentItem)
                dispatch(setCurrentItem(currMediaRes.payload))
            }

            // register for events after initialization
            const regRes = await commandService.sendCommand('system/register_for_change_events?enable=on')
            // console.log('regRes:', regRes)
            if ( regRes )
            {
               console.log('Registered for events!')
            }

            // once events are registered again, setup server side events for detecting changes in queue
            dispatch(setReadyForIPCEvents(true))
            console.log('Set up event source!')
        }

        if ( info.pid )
        {
            setInitPlayerState()
        }
        else
        {
            // if no player is connected reset all states
            setVolume({value: 0, x: 0})
            dispatch(setCurrentItem(null))
            dispatch(setPlayState(playerStates.playMode.paused))
            setRepeatState(playerStates.repeatMode.repeatOff)
            setShuffleState(playerStates.shuffleMode.shuffleOff)
        }
    }, [info.pid])



    const eventHandler = async (e) => {
        if ( blockRef.current )
        {
            //console.log('blockRef.current:', blockRef.current)
            console.log('Blocked an event!')
            return
        }
        else if ( typeof e !== 'object' )
        {
            //console.log('Not a parseable event!', e)
            return
        }

        //console.log('IPC event recv\'d:', e)
        const evtObj = e.heos
        if ( evtObj.command === eventTypes.nowPlayingChanged )
        {
            console.log('Now playing change event, getting new current media...')
            const currMediaRes = await commandService.getCurrentMedia(info.pid)
            if ( currMediaRes )
            {
                //console.log('Setting new curr. playing media:', currMediaRes.payload)
                //console.log('Replacing this non-dupe:', currentItem)
                dispatch(setCurrentItem(currMediaRes.payload))
            }
            else
            {
                dispatch(setNotification('Failed updating current media from event...'))
            }
        }
        else if ( evtObj.command === eventTypes.playerStateChanged )
        {
            console.log('Playstate change event!')
            //"message": "pid=1933802518&state=stop"
            let playStateMatch = evtObj.message.match(/(unknown|play|pause|stop)$/)
            if ( playStateMatch )
            {
                if ( playStateMatch[0] === 'unknown' )
                {
                    playStateMatch[0] = playerStates.playMode.stopped
                }

                console.log(`Changing to ${playStateMatch[0]} event state...`)

                if ( playStateMatch[0] === playerStates.playMode.stopped )
                {
                    dispatch(setCurrentItem(null))
                }

                dispatch(setPlayState(playStateMatch[0]))
            }
            else
            {
                dispatch(setNotification('Failed updating playstate from event...'))
            }
        }
        else if ( evtObj.command === eventTypes.nowPlayingProgress )
        {
            //console.log('duration:', evtObj.message)
            //"message": "pid=player_id&cur_pos=position_ms&duration=duration_ms"
            let progress = evtObj.message.match(/(?<=.*&cur_pos=)\d+/)
            let total = evtObj.message.match(/(?<=.*&duration=)\d+/)

            if ( progress && total )
            {
                progress = parseInt(progress[0])
                total = parseInt(total[0])
                //console.log('progress:', progress, '/', total) 
                dispatch(setDuration({progress, total}))
            }
            else
            {
                dispatch(setNotification('Failed updating progress from event...'))
            }
        }
        else if ( evtObj.command === eventTypes.volumeChanged )
        {
            console.log('Vol. change event!')
            //pid='player_id'&level='vol_level'&mute='on_or_off'
            const volMatch = evtObj.message.match(/(?<=.*level=)\d{1,3}/)
            if ( volMatch )
            {
                const existingVolInt = parseInt(volMatch[0])
                setVolume({ 
                    value: existingVolInt, 
                    x: ((maxVolWidth*existingVolInt)/100.0)
                })
            }
            else
            {
                dispatch(setNotification('Failed updating volume from event...'))
            }

        }
        else if ( evtObj.command === eventTypes.repeatModeChanged || evtObj.command === eventTypes.shuffleModeChanged )
        {
            console.log('Playmode change event!')
            const { repeatStrVal, shuffleStrVal } = await commandService.getPlayMode(info.pid)
            if ( repeatStrVal && shuffleStrVal )
            {
                setRepeatState(repeatStrVal)
                setShuffleState(shuffleStrVal)
            }
            else
            {
                dispatch(setNotification('Failed updating playmode from event...'))
            }
        }
        else if ( evtObj.command === eventTypes.queueChanged )
        {
            console.log('Queue change event!')
            const newQueueItems = await commandService.getQueue(info.pid)
            //console.log('newQueueItems:', newQueueItems)
            if ( newQueueItems )
            {
                console.log('Setting queue items...', newQueueItems)
                dispatch(setQueue(newQueueItems))
            }
        }
        else if ( evtObj.command === eventTypes.sourcesChanged )
        {
            //browse/get_music_sources
            //browse/get_source_info?sid=source_id
            const musicSourcesRes = await commandService.sendCommand(`browse/get_source_info?sid=${info.sid}`)
            console.log('musicSourcesRes:', musicSourcesRes)
        }
        else if ( evtObj.command === eventTypes.playbackError )
        {
            dispatch(setNotification('Playblack error. Unable to play media.'))
        }
    } 
    useEffect(() => {
        if ( info.readyForIPCEvents && info.pid )
        {
            setIPCEventHandler(eventHandler)
        }            
    }, [info.readyForIPCEvents])

    const startDrag = (e) => {
        // stop defaults, stop events from here
        e.preventDefault()
        e.stopPropagation()

        // trigger only one left mouse button
        if ( e.button > 0 )
        {
            return
        }

        // prevent event updating from volume change SSEs
        dispatch(setBlockEventUpdates(true))

        // onMouseDown event listener applied to parent div, currentTarget = elem that attached evt listener
        // playbar div > [svg] > [line,line,rect]
        const volBar = e.currentTarget.childNodes[0].childNodes[2]

        const calcNewPos = (e) => {
            const CTM =  volBar.getScreenCTM() 
            let newX = (e.clientX - CTM.e) / CTM.a // transfer screenspace to svg space
            newX -= parseFloat(volBar.getAttribute('width'))/2.0 // offset to center of rect

            // clamp from 0 min dist to svg width max dist
            if ( newX < 0 )
            {
                newX = 0
            }
            // problem: distance of svg doesn't scale, so use static max value of 375
            // need to account for padding and middle offset
            else if (newX > maxVolWidth )
            {
                newX = maxVolWidth
            }

            return newX
        }
        
        let newVolVal = 0
        let stoppedDragMovementTimeout = null
        const drag = async (e) => {
            const newX = calcNewPos(e)
            newVolVal = parseInt((newX/maxVolWidth)*100)
            setVolume({value: newVolVal, x: newX })
            setShowVolume(true)
            if ( info.pid )
            {
                if ( stoppedDragMovementTimeout ) {
                    clearTimeout(stoppedDragMovementTimeout)
                }
                stoppedDragMovementTimeout = setTimeout(() => {
                    commandService.setVolume(info.pid, newVolVal)
                }, 250)
            }
        }

        const endDrag = async (e) => {
            clearTimeout(stoppedDragMovementTimeout)
            document.removeEventListener('mousemove', drag)
            document.removeEventListener('mouseup', endDrag)

            if ( info.pid )
            {
                commandService.setVolume(info.pid, newVolVal)
            }

            // turn back on event updating from volume change SSEs
            dispatch(setBlockEventUpdates(false))
        }

        // if user clicked a position without moving, vol bar won't move, so just move it to initial click pos
        // then, if user holds down, it will trigger mousemove event listener to update pos, or endDrag will trigger on mouseup
        drag(e)
        document.addEventListener('mousemove', drag)
        document.addEventListener('mouseup', endDrag)
    }

    const [ albumArt, setAlbumArt ] = useState({})

    const getAlbumArt = async () => {
        if ( info.pid && info.clientIP )
        {
            const findImgRes = await findImg(currentItem.album, info.clientIP)
            //console.log('findImgRes:', findImgRes)
            if ( findImgRes && !findImgRes.error )
            {
                //console.log('album art retrieved, memoizing and setting')
                setAlbumArt({
                    ...albumArt,
                    [currentItem.album]: findImgRes                  
                })
            }
            else if ( findImgRes.error )
            {
                dispatch(setNotification(findImgRes.error))
            }
            else
            {
                dispatch('Failed to find album art!')
            }
        }
    }

    // if we are connected to a player and have a current item in queue
    useEffect(() => {
        // also check if we are in same album, so don't need to retrieve it again
        if ( info.pid && currentItem && !albumArt[currentItem.album] )
        {
            console.log('Getting album art...')
            getAlbumArt()
        }
    }, [currentItem])

    return (
        <StyledPlayBar>
            <StyledAlbumArtDiv>
                {(currentItem && albumArt[currentItem.album])
                ? 
                <Image 
                    style={{
                        borderRadius: '4px',
                        paddingRight: '2px',
                        width: '256px',
                    }}
                    fluid={true}
                    src={albumArt[currentItem.album]} 
                /> 
                : 
                    null
                }
            </StyledAlbumArtDiv>
            <StyledControlDiv>
                <div className='repeatBtn' onClick={switchRepeatState} style={{
                    display: 'grid', 
                    gridColumn: '1/2',
                    gridRow: '1/2',
                }}>
                    <svg viewBox='0 0 150 150'>
                        <g style={{
                            fill: repeatState !== playerStates.repeatMode.repeatOff ? 'rgba(255,0,90,0.75)' : 'rgba(75,75,75,0.5)',
                            stroke: repeatState !== playerStates.repeatMode.repeatOff ? 'rgba(255,0,90,0.75)' : 'rgba(75,75,75,0.5)',
                            strokeWidth: repeatState !== playerStates.repeatMode.repeatOff ? '3' : '1.5',
                        }}>
                            <path d='M 90,25 L 90,5 L 125,25 L 90,45 z'/>
                            <path d='M 60,125 L 60,145 L 25,125 L 60,105 z'/>
                        </g>
                        <g style={{
                            fill: 'none',
                            stroke: repeatState !== playerStates.repeatMode.repeatOff ? 'rgba(255,0,90,0.75)' : 'rgba(75,75,75,0.5)',
                            strokeWidth: repeatState !== playerStates.repeatMode.repeatOff ? '3' : '1.5',
                        }}>
                            <path d='M 20,110 Q 0 40 , 50 25'/>
                            <path d='M 50,25 L 90,25'/>
                            <path d='M 130,40 Q 150 110 , 100 125'/>
                            <path d='M 60,125 L 100,125'/>
                        </g>
                        <g style={{
                            display: repeatState === playerStates.repeatMode.repeatOnce ? 'grid' : 'none',
                        }}>
                            <circle fill='rgb(255,0,90)' cx='120' cy='120' r='25'/>
                            <line strokeWidth='2' stroke='black' x1='120' y1='135' x2='120' y2='115'/>
                            <line strokeWidth='2' stroke='black' x1='120' y1='115' x2='115' y2='120'/>
                        </g>
                    </svg>
                </div>
                <div className={`prevBtn ${canGoBack() ? '' : 'disabled'}`} onClick={handlePlayPrev} style={{
                    display: 'grid',
                    gridColumn: '2/3',
                    gridRow: '1/2',
                }}>
                    <svg viewBox='0 0 150 150'>
                        <path fill='rgba(75,75,75,0.5)' stroke='black' strokeWidth='1.5'
                            d='M 150,0 L 150,150 L 20,78
                            L 20,150 L 0,150 L 0,0 L 20,0 L 20,72 z'
                        />
                    </svg>
                </div>
                <div className={`playPauseBtn ${currentItem ? '' : 'disabled'}`} onClick={togglePlayState} style={{
                    display: 'grid',
                    gridColumn: '3/4',
                    gridRow: '1/2',
                }}>
                    <svg viewBox='0 0 150 150' style={{
                        fill: 'rgba(75,75,75,0.5)',
                        stroke: 'rgba(75,75,75,0.5)',
                        strokeWidth: '1.5px',
                    }}>
                        <g style={{ display: playState === playerStates.playMode.playing ? 'grid' : 'none'}}>
                            <rect x='0' y='0' width='50' height='150'/>
                            <rect x='100' y='0' width='50' height='150'/>
                        </g>
                        <g style={{ display: (playState === playerStates.playMode.paused || playState === playerStates.playMode.stopped) ? 'grid' : 'none'}}>
                            <path fill='rgba(75,75,75,0.5)' stroke='rgba(75,75,75,0.5)' strokeWidth='1.5'
                                d='M 0,0 L 0,150 L 150,75 z'
                            />
                        </g>
                    </svg>
                </div>
                <div className={`nextBtn ${canGoNext() ? '' : 'disabled'}`} onClick={handlePlayNext} style={{
                    display: 'grid',
                    gridColumn: '4/5',
                    gridRow: '1/2'
                }}>
                    <svg viewBox='0 0 150 150'>
                        <path fill='rgba(75,75,75,0.5)' stroke='rgba(75,75,75,0.5)' strokeWidth='1.5'
                            d='M 0,0 L 0,150 L 130,78
                            L 130,150 L 150,150 L 150,0 L 130,0 L 130,72 z'
                        />
                    </svg>
                </div>
                <div className='shuffleBtn' onClick={toggleShuffleState} style={{
                        display: 'grid', 
                        gridColumn: '5/6',
                        gridRow: '1/2',
                    }}>
                    <svg viewBox='0 0 150 150' style={{
                        fill: shuffleState === playerStates.shuffleMode.shuffleOn ? 'rgba(255,0,90,0.75)' : 'rgba(75,75,75,0.5)',
                        stroke: shuffleState === playerStates.shuffleMode.shuffleOn ? 'rgba(255,0,90,0.75)' : 'rgba(75,75,75,0.5)',
                        strokeWidth: shuffleState === playerStates.shuffleMode.shuffleOn ? '3' : '1.5',
                    }}>
                        <g transform='rotate(45, 75, 75)'>
                            <path d='M -25,75 L 150,75'/>
                            <path d='M 150,75 L 150,50 L 175,75 L 150,100 L 150,75'/>
                        </g>
                        <g transform='rotate(-45, 75, 75)'>
                            <path d='M -25,75 L 150,75'/>
                            <path d='M 150,75 L 150,50 L 175,75 L 150,100 L 150,75'/>
                        </g>
                    </svg>
                </div>
            </StyledControlDiv>
            <StyledVolDiv>
                <div 
                    className={`volNum ${showVolume ? 'volNum-show' : 'volNum-hide'}`}
                    onTransitionEnd={() => setShowVolume(false)}
                    style={{
                        display: 'grid',
                        gridRow: '1/2',
                        gridColumn: '1/2',
                        height: '100%',
                        width: '100%',
                    }}
                >
                    {volume.value}
                </div>
                <div 
                    style={{
                        display: 'grid',
                        gridRow: '2/3',
                        gridColumn: '1/2',
                        height: '100%',
                        width: '100%'
                    }} 
                    onMouseDown={startDrag}
                >
                    <svg 
                        viewBox='0 0 400 150' 
                        style={{
                            padding: '0px 15px 15px 15px',
                            overflow: 'visible',
                            maxWidth: '100%',
                            maxHeight: '100%'
                        }}
                    >
                        <line 
                            strokeLinecap="round" 
                            strokeWidth='10px' 
                            stroke='rgb(50,50,50)' x1='0' y1='100%' x2='100%' y2='25%'
                        />
                        <line 
                            strokeLinecap="round" 
                            strokeWidth='1px' 
                            stroke='rgba(0,0,0,1)' x1='0' y1='100%' x2='100%' y2='25%'
                        />
                        <rect 
                            fill='rgb(75,75,75)' 
                            stroke='black' 
                            strokeWidth='0.25' 
                            x={`${volume.x}`} y='30' height='120' width='30'
                        />
                    </svg>
                </div>
            </StyledVolDiv>
        </StyledPlayBar>
    )
}