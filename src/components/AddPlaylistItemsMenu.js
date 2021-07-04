import React from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import sourceIdTypes from '../utils/sourceIdTypes'
import commandService from '../services/commands'
import { setNotification } from '../reducers/notificationSlice'
import styled from 'styled-components'
import { setBlockEventUpdates } from '../reducers/playerSlice'
import { setQueue } from '../reducers/queueSlice'

const MenuButton = styled(Button)`
    border: 0px;
    z-index: 1;
`
const Menu = styled.div`
    display: grid;
    grid-template-rows: 1fr 1fr 1fr 1fr;
    gap: 1px;
`
const AddPlaylistItemsMenu = ({cid}) => {
    const { queue } = useSelector(state => state.queue)
    const pid = useSelector(state => state.info.pid)
    const dispatch = useDispatch()

    const addPlaylistMedia = async (option) => {
        try
        {
            dispatch(setBlockEventUpdates(true))
            
            // browse/browse?sid=sid&cid=cid -> browse/add_to_queue?pid=pid&sid=sid&cid=cid&aid=aid
            const cmdStr = `browse/add_to_queue?pid=${pid}&sid=${sourceIdTypes.playlists}&cid=${cid}&aid=${option}`
            const addPlaylistMediaRes = await commandService.sendCommand(cmdStr)
            console.log('addPlaylistMediaRes:', addPlaylistMediaRes)
            if ( addPlaylistMediaRes )
            {
                // Add options mean we can't just merge queue from SSE, so update queue by options here
                const newQueueItems = await commandService.getQueue(pid)
                console.log('newQueueItems:', newQueueItems)
                if ( newQueueItems )
                {
                    let newQueue = []

                    // playNow
                    if ( option === 1 )
                    {
                        newQueue = [...newQueueItems, ...queue]
                    }
                    // playNext
                    else if ( option === 2 )
                    {
                        newQueue = [...queue.slice(0,1), ...newQueueItems, ...queue.slice(1)]
                    }
                    // addToEnd
                    else if ( option === 3 )
                    {
                        newQueue = [...queue, ...newQueueItems]
                    }
                    // playNowAndReplaceQueue
                    else if ( option === 4 )
                    {
                        newQueue = [...newQueueItems]
                    }

                    console.log('Setting queue items...', newQueue)
                    dispatch(setQueue(newQueue))
                }

                dispatch(setBlockEventUpdates(false))
            }
        }
        catch(error)
        {
            console.log('addPlaylistMedia error:', error)
            dispatch(setNotification('Failed to add items to queue!'))
            dispatch(setBlockEventUpdates(false))
        }
    }

    // if queue is empty, hide some unnecessary options
    return (queue.length > 0) 
    ?
    <Menu>
        <MenuButton onClick={() => addPlaylistMedia(1)} variant='secondary'>Play Now</MenuButton>
        <MenuButton onClick={() => addPlaylistMedia(2)} variant='secondary'>Play Next</MenuButton>
        <MenuButton onClick={() => addPlaylistMedia(3)} variant='secondary'>Add to End of Queue</MenuButton>
        <MenuButton onClick={() => addPlaylistMedia(4)} variant='secondary'>Play Now & Replace Queue</MenuButton>
    </Menu>
    :
    <Menu>
        <MenuButton onClick={() => addPlaylistMedia(1)} variant='secondary'>Play Now</MenuButton>
        <MenuButton onClick={() => addPlaylistMedia(3)} variant='secondary'>Add to End of Queue</MenuButton>
    </Menu>
}

export default AddPlaylistItemsMenu