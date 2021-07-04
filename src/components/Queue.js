import React, { useState, useEffect, useRef } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { Button, Collapse } from 'react-bootstrap'

import SavedPlaylists from './SavedPlaylists'
import Playbar from './Playbar'
import QueueItem from './QueueItem'
import CurrentQueueItem from './CurrentQueueItem'

import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { setQueue, clearQueue } from '../reducers/queueSlice'
import { setCurrentItem, setPlayState, setBlockEventUpdates } from '../reducers/playerSlice'
import playerStates from '../utils/playerStates'
import songEqual from '../utils/songEqual'
import sourceIdTypes from '../utils/sourceIdTypes'
import commandService from '../services/commands'
import { setPlaylists } from '../reducers/playlistsSlice'
import { setNotification } from '../reducers/notificationSlice'

const Queue = () => {
    const dispatch = useDispatch()
    const pid = useSelector(state => state.info.pid)
    const { queue }  = useSelector(state => state.queue, shallowEqual)
    const currentItem = useSelector(state => state.player.currentItem, songEqual)

    const blockEventUpdates = useSelector(state => state.player.blockEventUpdates)
    const blockRef = useRef(blockEventUpdates)
    blockRef.current = blockEventUpdates

    // once connected to the player, set existing queue state
    useEffect(() => {
        const getInitialQueue = async () => {
            const getInitialQueueRes = await commandService.getQueue(pid)
            //console.log('getInitialQueueRes:', getInitialQueueRes)
            if ( getInitialQueueRes )
            {
                console.log('Setting queue items...', getInitialQueueRes)
                dispatch(setQueue(getInitialQueueRes))
            }
        }

        if (pid) 
        {
            console.log('Initialized SSEs, initial state, and pid connected:', pid)
            // populate virtual queue from from physical player's queue
            getInitialQueue()
        }
        else
        {
            dispatch(clearQueue())
        }
    }, [pid])

    const handleItemDblClick = async (e, index) => {
        e.preventDefault()
        if ( pid )
        {
            console.log('Double clicked item qid:', index+1)
            // don't do anything if we already selected it; also check if clicked delete button
            if ( currentItem && currentItem.qid === (index+1) || e.target.classList.contains('btn') )
            {
                return
            }

            dispatch(setBlockEventUpdates(true))
            
            // set new current item and set it to play
            dispatch(setCurrentItem(queue[index]))
            dispatch(setPlayState(playerStates.playMode.playing))

            const playQueueRes = await commandService.sendCommand(`player/play_queue?pid=${pid}&qid=${index+1}`)
            if ( playQueueRes )
            {
                console.log('playQueueRes:', playQueueRes)
                dispatch(setBlockEventUpdates(false))
            }
            
        }
    }

    const reorder = (items, sourceIdx, destIdx) => {
        let result = [...items]
        const [ removed ] = result.splice(sourceIdx, 1) // take it out of src idx
        result.splice(destIdx, 0, removed) // put it back in in new dest idx

        // dragging queue item
        // after re-order, current item could've moved, get and set its new qid
        if ( (selectedItems.size > 0 || draggingMid) && currentItem )
        {
            const newCurrIdx = result.findIndex(i => i.mid === currentItem.mid)
            console.log('setting new currItem qid:', currentItem.qid, 'to', newCurrIdx+1)
            dispatch(setCurrentItem({...currentItem, qid: newCurrIdx+1}))
        }

        return result
    }
    const multiReorder = (items, destIdx) => {
        let newDestIdx = 0
        // filter out selected items
        let result = items.filter(i => !selectedItems.has(i.mid))
        //console.log('result before splice:', [...result])
        // if destIdx is at beginning, don't need to check ordering ( checking will lead to bugs )
        if ( destIdx > 0 )
        {
            // while the items at destIdx are in selectedItems, increment until we find one that isn't selected or until end
            let midToBump = null
            for ( let i = destIdx; i < items.length; ++i )
            {
                if ( !selectedItems.has(items[i].mid) )
                {
                    midToBump = items[i].mid
                    //console.log('found a non-selected mid:', mid)
                    break
                }
            }
            
            // find new position to splice in dragged items
            // if midToBump is null, we went thru whole items and couldn't find a non-selected item, just splice into end
            // if midToBump is at last idx, we want to splice into end as well
            newDestIdx = ( midToBump !== null && items[items.length-1].mid !== midToBump ) ? result.findIndex(i => i.mid === midToBump) : result.length
        }
        console.log('newDestIdx:', newDestIdx)

        // create array of selected items
        const splicedItems = items.filter(i => selectedItems.has(i.mid))
        //console.log('splicedItems:', splicedItems)

        // splice them back in at newDestIdx
        result.splice(newDestIdx, 0, ...splicedItems)
        //console.log('result after splice:', [...result])

        return [ result, newDestIdx ]
    }

    const [ draggingMid, setDraggingMid ] = useState(null)
    const onDragStart = async (start) => {
        setDraggingMid(start.draggableId)
        // if there were other items in selection group, deselect all and move only this one
        if ( !selectedItems.has(start.draggableId) )
        {
            deselectAllQueueItems()
        }
        dispatch(setBlockEventUpdates(true))
    }

    const cleanUpDrag = () => {
        setDraggingMid(null)
        deselectAllQueueItems()
    }

    const onDragEnd = async (result) => {
        // - invalid destination
        // - selected all items, order doesn't matter so return
        // - single dragging & dropping at same pos, don't do anything 
        if ( !result.destination
            || (selectedItems.size === queue.length)
            || ((selectedItems.size <= 1) && result.source.index === result.destination.index) )
        {
            dispatch(setBlockEventUpdates(false))
            cleanUpDrag()
            return
        }

        console.log('sourceIdx:', result.source.index)
        console.log('destIdx:', result.destination.index)
        
        let newQueueOrder = null
        let multiDestIdx = null
        // determine if its a single or multiple reorder
        if ( selectedItems.size > 1 )
        {
            [ newQueueOrder, multiDestIdx ] = multiReorder(queue, result.destination.index)
        }
        else
        {
            // dragging single queue item
            newQueueOrder = reorder(queue, result.source.index, result.destination.index)
        }

        // update UI list order
        dispatch(setQueue(newQueueOrder))

        // still need to generate qid strings for player queue changes
        let srcQidStr = ''
        let destQidStr = ''
        // if only 1 item dragging, don't calculate more than the single qid
        if ( selectedItems.size > 0 )
        {
            // selectedItems stores qid as a value to the mid key, use the Map to get original qid ordering
            const selectedQids = Array.from(selectedItems.values()).sort()
            for ( let i = 0; i < selectedItems.size; ++i )
            {
                srcQidStr += `${selectedQids[i]}${i < selectedItems.size-1 ? ',' : ''}`
            }

            // when generating destination qids, start at destination and increment in order for all selected items
            // possible problem with edge case: selecting all items and moving them to end
            const destStrSize = ( multiDestIdx + (selectedItems.size || 1) )
            for ( let i = multiDestIdx; i < destStrSize; ++i )
            {
                destQidStr += `${i+1}${i < destStrSize-1 ? ',' : ''}`
            }
        }
        else
        {
            srcQidStr = `${queue[result.source.index].qid}`
            destQidStr = `${queue[result.destination.index].qid}`
        }

        console.log('srcQidStr:', srcQidStr)
        console.log('destQidStr:', destQidStr)

        if ( srcQidStr === destQidStr )
        {
            console.log('same qid order, not applying changes')
            dispatch(setBlockEventUpdates(false))
        }
        else
        {
            // just trust that it updates queue, so we don't get weird visual delays when drag ends
            const moveQueueRes = await commandService.sendCommand(`player/move_queue_item?pid=${pid}&sqid=${srcQidStr}&dqid=${destQidStr}`)
            if ( moveQueueRes )
            {
                console.log('moveQueueRes:', moveQueueRes)
                dispatch(setBlockEventUpdates(false))
            }
        }

        cleanUpDrag()
    }

    const handleDeleteAll = async (e) => {
        e.preventDefault()

        if ( pid )
        {
            dispatch(clearQueue())
            dispatch(setBlockEventUpdates(true))
            const clearQueueRes = await commandService.clearQueue(pid)
            //console.log('clearQueueRes:', clearQueueRes)
            if ( clearQueueRes )
            {
                console.log('Deleted all queue items on player')
                dispatch(setBlockEventUpdates(false))
            }
        }
    }

    const handleDeleteItems = async (e) => {
        e.preventDefault()

        // player/remove_from_queue?pid=player_id&qid=queue_id_1,queue_id_2,…,queue_id_n
        if ( pid )
        {
            dispatch(setBlockEventUpdates(true))

            // filter out items selected for deletion
            const filteredQueue = queue.filter(item => !selectedItems.has(item.mid))
            console.log('filtered queue:', filteredQueue)
            dispatch(setQueue(filteredQueue))

            // create a list of qids for sendCmd parameter
            let qidStr = ''
            let i = 0
            for ( const [mid, qid] of selectedItems )
            {
                // if at last element, add space, otherwise add comma
                qidStr += `${qid}${i < (selectedItems.size-1) ? ',' : ''}`
                ++i
            }
            console.log('handleDeleteItems qidStr:', qidStr)

            const removeQueueRes = await commandService.sendCommand(`player/remove_from_queue?pid=${pid}&qid=${qidStr}`)
            console.log('removeQueueRes:', removeQueueRes)
            if ( removeQueueRes )
            {
                // check if current item got deleted and let player update current item after deletion (follows HEOS player behavior)
                if ( currentItem && selectedItems.has(currentItem.mid) )
                {
                    // let player tell us which item it switched to
                    dispatch(setCurrentItem(null))
                }

                dispatch(setBlockEventUpdates(false))
            }
        }
    }

    // Map Key: mid, Value: qid
    const [ selectedItems, setSelectedItems ] = useState(new Map())
    // select with array[qid] ordering
    const handleSelectItem = (e, item) => {
        const mid = item.mid
        //console.log('clicked mid', mid)
        if ( e.button !== 0 || e.defaultPrevented )
        {
            return
        }
        e.preventDefault()

        const wasSelected = selectedItems.has(mid)
        
        let newSelection = null
        // ctrl+click (add/remove from selection)
        if ( e.ctrlKey )
        {
            newSelection = new Map([...selectedItems])
            // add never selected to list
            if ( !wasSelected )
            {
                newSelection.set(mid, item.qid)
            }
            // already selected so, remove it from list
            else
            {
                newSelection.delete(mid)
            }
        }
        // shift-click (multi-select)
        else if ( e.shiftKey )
        {
            newSelection = new Map([...selectedItems])
            // if no items were selected already, nothing to multi-select to, so add it alone
            if ( selectedItems.size < 1 )
            {
                newSelection.set(mid, item.qid)
            }
            // select from last selected idx to clicked idx
            // Maps store insertions in order, convert to array and pop off last elem.
            const newIdx = queue.findIndex(qitem => qitem.mid === mid)
            const lastIdx = queue.findIndex(qitem => qitem.mid === Array.from(selectedItems.keys()).pop())
            //console.log('newIdx:', newIdx)
            //console.log('lastIdx:', lastIdx)

            // same position, return
            if ( newIdx === lastIdx )
            {
                return
            }

            const isSelectingForwards = newIdx > lastIdx
            const start = isSelectingForwards ? lastIdx : newIdx
            const end = isSelectingForwards ? newIdx : lastIdx

            const inBetween = queue.slice(start, end+1)
           // console.log('inBetween:', inBetween)

            for ( let i of inBetween )
            {
                if ( !newSelection.has(i.mid) )
                {
                    newSelection.set(i.mid, i.qid)
                }
            }

        }
        // 1 click
        else
        {
            newSelection = new Map()
            // never selected
            if ( !wasSelected )
            {
                newSelection.set(mid, item.qid)
            }
            // already selected, but in group, so deselect everything but it
            else if ( selectedItems.size > 1 )
            {
                newSelection.set(mid, item.qid)
            }
            // already selected, so leave empty

        }

        setSelectedItems(newSelection)
    }

    const deselectAllQueueItems = () => {
        setSelectedItems(new Map())
    }
    const onNonItemClick = (e) => {
        // if any other event triggered, it should've called preventDefault to stop de-selection
        if ( e.defaultPrevented 
            || e.target.classList.contains('playlist-input-collapse') 
            || showPromptRef.current && e.target.classList.contains('delete-collapse') )
        {
            return
        }
        if ( showPromptRef.current )
        {
            setShowPrompt(false)
        }
        deselectAllQueueItems()
    }

    // deselect all if not clicking anywhere
    useEffect(() => {
        document.addEventListener('click', onNonItemClick)
        return () => document.removeEventListener('click', onNonItemClick)
    }, [showPrompt, setShowPrompt])

    useEffect(() => {
        // if queue is added or removed from, queue mids (tied to draggableId) will change, make user re-select
        deselectAllQueueItems()
    }, [queue])

    const itemHandleFuncs = {
        handleItemDblClick,
        handleSelectItem
    }

    const [ playlistName, setPlaylistName ] = useState('')
    const [ showPrompt, setShowPrompt ] = useState(false)
    const showPromptRef = useRef(showPrompt)
    showPromptRef.current = showPrompt

    const handleShowPrompt = e => {
        e.preventDefault()
        setShowPrompt(true)
    }
    const saveToPlaylist = async () => {
        if ( playlistName.length < 1 )
        {
            return dispatch(setNotification('Cannot enter an empty playlist name!'))
        }
        //player/save_queue?pid=player_id&name=playlist_name
        if ( pid )
        {
            dispatch(setBlockEventUpdates(true))
            const addPlaylistRes = await commandService.sendCommand(`player/save_queue?pid=${pid}&name=${playlistName}`)
            console.log('addPlaylistRes:', addPlaylistRes)
            if ( addPlaylistRes )
            {

                console.log('Getting existing playlists...')
                const playlistRes = await commandService.sendCommand(`browse/browse?sid=${sourceIdTypes.playlists}`)
                console.log('playlistRes:', playlistRes)
                if ( playlistRes )
                {
                    dispatch(setPlaylists(playlistRes.data.payload))
                    setShowPrompt(false)
                    setPlaylistName('')
                    dispatch(setBlockEventUpdates(false))
                }
            }
        }
    }

    return (
        <div className='qMain'>
            <Collapse in={showPrompt}>
                <div className='playlist-input-collapse'> 
                    <input 
                        className='playlist-input-collapse'
                        style={{marginRight:'5px', 
                            border: '0.5px solid black', 
                            backgroundColor: 'whitesmoke',
                            borderRadius: '4px',
                            paddingLeft: '5px'
                        }} 
                        placeholder='Enter a playlist name' 
                        value={playlistName} 
                        onChange={e => setPlaylistName(e.target.value)} 
                    /> 
                    <Button onClick={saveToPlaylist} variant='success'>Save</Button>
                </div>
            </Collapse>
            <Collapse in={showPrompt || (!draggingMid && selectedItems.size > 0)}>
                <div className='delete-collapse'>
                    <Button className='show-prompt-btn' disabled={showPrompt} onClick={handleShowPrompt} style={{marginRight: '3px'}} variant='secondary'>Save All to Playlist</Button>
                    <Button onClick={handleDeleteItems} style={{marginRight: '3px'}} variant='danger'>Clear Selected</Button>
                    <Button onClick={handleDeleteAll} variant='danger'>Clear All</Button>
                </div>
            </Collapse>
            <SavedPlaylists />
            <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
                <Droppable droppableId='queueDroppable'>
                    {(provided) => (
                        <div
                            ref={provided.innerRef} 
                            {...provided.droppableProps} 
                            className='mediaQueue'
                        >
                            {queue.map( (item, index) => {
                                if ( currentItem && currentItem.qid === item.qid )
                                {
                                    return <CurrentQueueItem 
                                        key={item.mid} 
                                        item={item} 
                                        index={index} 
                                        {...itemHandleFuncs}
                                        isSelected={selectedItems.has(item.mid)}
                                        isGhosting={draggingMid && selectedItems.has(item.mid) && draggingMid !== item.mid}
                                        selectionCount={selectedItems.size}
                                    />
                                }
                                return <QueueItem 
                                    key={item.mid} 
                                    item={item} 
                                    index={index} 
                                    {...itemHandleFuncs}
                                    isSelected={selectedItems.has(item.mid)}
                                    // used for multi-select ghosting the others, if selected and is not dragging id
                                    isGhosting={draggingMid && selectedItems.has(item.mid) && draggingMid !== item.mid}
                                    selectionCount={selectedItems.size}
                                />
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <Playbar />
        </div>
    )
}


export default Queue