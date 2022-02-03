import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { setQueue } from '../reducers/queueSlice'
import { setBlockEventUpdates } from '../reducers/playerSlice'
import commandService from '../services/commands'
import { setNotification } from '../reducers/notificationSlice'
import styled from 'styled-components'

const MenuButton = styled(Button)`
    border: 0px;
    z-index: 1;
`
const Menu = styled.div`
    display: grid;
    grid-template-rows: 1fr 1fr 1fr 1fr;
    gap: 1px;
`
const ShortMenu = styled.div`
    display: grid;
    grid-template-rows: 1fr 1fr;
    gap: 1px;
`

const AddQueueMenu = ({cid, content}) => 
{
    const { queue } = useSelector(state => state.queue)
    const info = useSelector(state => state.info)
    const dispatch = useDispatch()

    const addMedia = async (option) => {
        dispatch(setBlockEventUpdates(true))

        // virtual copy of queue to tell queue when to get actual playlist
        let newQueue = []
        // playNow
        if ( option === 1 )
        {
            newQueue = [...content, ...queue]
        }
        // playNext
        else if ( option === 2 )
        {
            newQueue = [...queue.slice(0,1), ...content, ...queue.slice(1)]
        }
        // addToEnd
        else if ( option === 3 )
        {
            newQueue = [...queue, ...content]
        }
        // playNowAndReplaceQueue
        else if ( option === 4 )
        {
            newQueue = [...content]
        }
        
        // Play events and current item changes will be triggered by SSEs
        dispatch(setQueue(newQueue))

        try
        {
            //console.log('adding to virtual queue:', content, option)
            const cmdStr = `browse/add_to_queue?pid=${info.pid}&sid=${info.sid}&cid=${cid}${(content.length === 1) ? `&mid=${content[0].mid}` : ''}&aid=${option}`
            const addToQueueRes = await commandService.sendCommand(cmdStr)
            if ( addToQueueRes )
            {
                console.log('addToQueueRes:', addToQueueRes)
                dispatch(setBlockEventUpdates(false))
            }
        }
        catch(error)
        {
            console.log('AddQueueMenu error:', error)
            dispatch(setNotification('Failed to add items to queue!'))
            dispatch(setBlockEventUpdates(false))
        }
    }

    // if queue is empty, hide some unnecessary options
    return (queue.length > 0) 
    ?
    <Menu>
        <MenuButton onClick={() => addMedia(1)} variant='secondary'>Play Now</MenuButton>
        <MenuButton onClick={() => addMedia(2)} variant='secondary'>Play Next</MenuButton>
        <MenuButton onClick={() => addMedia(3)} variant='secondary'>Add to End of Queue</MenuButton>
        <MenuButton onClick={() => addMedia(4)} variant='secondary'>Play Now & Replace Queue</MenuButton>
    </Menu>
    :
    <ShortMenu>
        <MenuButton onClick={() => addMedia(1)} variant='secondary'>Play Now</MenuButton>
        <MenuButton onClick={() => addMedia(3)} variant='secondary'>Add to End of Queue</MenuButton>
    </ShortMenu>
}

export default AddQueueMenu