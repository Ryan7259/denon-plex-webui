import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setPlaylists, clearPlaylists } from '../reducers/playlistsSlice'
import commandService from '../services/commands'
import sourceIdTypes from '../utils/sourceIdTypes'
import styled from 'styled-components'
import ContextMenu from './ContextMenu'
import AddPlaylistItemsMenu from './AddPlaylistItemsMenu'
import EditPlaylistMenu from './EditPlaylistMenu'
import { setBlockEventUpdates } from '../reducers/playerSlice'

const StyledPlaylistItem = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 45px;
    align-items: center;
    justify-content: center;
    color: black;
    background-color: white;
    font-size: medium;
    border: 0;
    border-bottom: 0.5px solid rgba(0,0,0,0.75);
    border-radius: 4px;

    cursor: pointer;
    user-select: none;
    outline: none;

    &:hover, &:focus {
        background-color: ${props => props.showRename ? 'white' : 'rgb(255,200,200)'};
        box-shadow: 0 0 0 0 white;
        border: 0;
        border-bottom: 0.5px solid rgba(0,0,0,0.75);
    }
`
const RenameInputDiv = styled.div`
    display: grid;
    grid-template-columns: auto auto;
    width: 100%;
    height: 100%;
    padding: 5px;
    column-gap: 5px;
`
const SaveButton = styled.button`
    border: 0;
    border-radius: 4px;
    &:hover {
        border: 0.5px solid black;
    }
`
const SavedPlaylists = () => 
{
    const dispatch = useDispatch()
    const { playlists }  = useSelector(state => state.playlists)
    const pid = useSelector(state => state.info.pid)

    useEffect(() => {
        const getPlaylists = async () => {
            console.log('Getting existing playlists...')
            const playlistRes = await commandService.sendCommand(`browse/browse?sid=${sourceIdTypes.playlists}`)
            //console.log('playlistRes:', playlistRes)
            if ( playlistRes )
            {
                dispatch(setPlaylists(playlistRes.payload))
            }
        }

        if ( pid )
        {
            getPlaylists()
        }
        else
        {
           dispatch(clearPlaylists())
        }
    }, [pid])

    const [ selectedPlaylist, setSelectedPlaylist ] = useState(null)
    const [ playlistToEdit, setPlaylistToEdit ] = useState(null)
    const [ newName, setNewName ] = useState('')
    const [ showRename, setShowRename ] = useState(false)
    
    const startRename = () => {
        setShowRename(true)
        setNewName(playlistToEdit.name)
    }
    const renamePlaylist = async () => {

        if ( pid )
        {
            dispatch(setBlockEventUpdates(true))

            let newPlaylists = [...playlists]
            const idx = newPlaylists.findIndex(p => p.cid === playlistToEdit.cid)
            newPlaylists.splice(idx, 1, {...newPlaylists[idx], name: newName})

            dispatch(setPlaylists(newPlaylists))
            
            //browse/rename_playlist?sid=source_id&cid=contaiiner_id&name=playlist_name
            const renamePlaylistRes = await commandService.sendCommand(`browse/rename_playlist?sid=${sourceIdTypes.playlists}&cid=${playlistToEdit.cid}&name=${newName}`)
            if ( renamePlaylistRes )
            {
                dispatch(setBlockEventUpdates(false))
            }
            
            setShowRename(false)
            setPlaylistToEdit(null)
            setNewName('')
        }
    }
    const handleDelete = async () => {
        if ( pid )
        {
            dispatch(setBlockEventUpdates(true))
            dispatch(setPlaylists(playlists.filter(p => p.cid !== playlistToEdit.cid )))

            // browse/delete_playlist?sid=source_id&cid=contaiiner_id
            const deletePlaylistRes = await commandService.sendCommand(`browse/delete_playlist?sid=${sourceIdTypes.playlists}&cid=${playlistToEdit.cid}`)
            if ( deletePlaylistRes )
            {
                dispatch(setBlockEventUpdates(false))
            }
        }
    }

    const determineMenuType = () => {
        if ( selectedPlaylist )
        {
            return (
                <AddPlaylistItemsMenu cid={selectedPlaylist.cid} />
            )
        }
        if ( playlistToEdit )
        {
            return (
                <EditPlaylistMenu handleDelete={handleDelete} startRename={startRename} />
            )
        }
        return null
    }

    const determineClickType = (e, playlist) => {
        /*
        console.log('showRename:', showRename)
        console.log('e.button:', e.button)
        console.log('playlistToEdit:', playlistToEdit)
        console.log('playlist:', playlist)
        console.log('selectedPlaylist:', selectedPlaylist)
        */
        // if we opened rename menu and right clicked another playlist, cancel rename
        if ( showRename && e.button === 2 && playlistToEdit && playlist.cid !== playlistToEdit.cid )
        {   
            return cancelRename()
        }
        // if we opened rename menu and left clicked another playlist, cancel rename
        else if ( showRename && e.button === 0 && playlistToEdit && playlist.cid !== playlistToEdit.cid )
        {
            setSelectedPlaylist(playlist)
            return cancelRename()
        }
        // else clicked within same playlist, let user finish by clicking save or cancel by clicking outside of playlists
        else if ( showRename )
        {
            return
        }

        if ( e.button === 0 )
        {
            console.log('left-clicked')
            setPlaylistToEdit(null)
            setSelectedPlaylist(playlist)
        }
        else if ( e.button === 2 )
        {
            console.log('right-clicked')
            setSelectedPlaylist(null)
            setPlaylistToEdit(playlist)
        }
    }

    const cancelRename = (e) => {
        setShowRename(false)
        setPlaylistToEdit(null)
        setNewName('')
    }
    const handleOutsideClick = (e) => {
        if (e.target.classList.contains('rename-playlist'))
        {
            return
        }
        
        cancelRename()
    }

    useEffect(() => {
        window.addEventListener('click', handleOutsideClick)
        return () => window.removeEventListener('click', handleOutsideClick)
    }, [])

    return (
        <div className='savedPlaylists'>
            <ContextMenu>
                {determineMenuType()}
            </ContextMenu>
            { 
                playlists && playlists.length > 0 
                ? 
                    playlists.map(playlist => {
                        return (
                            <StyledPlaylistItem 
                                key={playlist.cid} 
                                className='clickableItem' 
                                onMouseUp={e => determineClickType(e, playlist)}
                                onContextMenu={e => e.preventDefault()}
                                showRename={showRename}
                            >
                            {showRename && playlistToEdit && playlistToEdit.cid === playlist.cid 
                            ?
                                <RenameInputDiv className='rename-playlist'>
                                    <input className='rename-playlist' onChange={(e) => setNewName(e.target.value)} value={newName}/>
                                    <SaveButton onClick={renamePlaylist}>Save</SaveButton>
                                </RenameInputDiv>
                            : 
                                playlist.name
                            }
                            </StyledPlaylistItem>
                        )
                    })
                : 
                    null 
            }
        </div>
    )
}

export default SavedPlaylists