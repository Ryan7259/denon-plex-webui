import { useEffect, useState } from 'react'
import AddQueueMenu from './AddQueueMenu'
import ContextMenu from './ContextMenu'
import { Button, Image } from 'react-bootstrap'
import styled from 'styled-components'

const StyledPlayableContainerDiv = styled.div`
    display: grid;
    grid-row: 2 / 3;
    grid-column: 2 / 3;
    grid-template-rows: auto auto minmax(0, 1fr);
    grid-template-columns: auto auto;
    min-height: 0;
`
const StyledPlayableItemsListDiv = styled.div`
    grid-column: 1 / 3;
    grid-row: 3 / 4;
    min-height: 0;
    height: auto;
`
const StyledPlayableItemDiv = styled.div`
    display: grid;
    margin: 2px 0px 2px 0px;
`


const PlayableContainer = ({ container, items }) => {
    container.image_url = items[0].image_url
    const [ clickedItems, setClickedItems ] = useState(null)
    
    useEffect(() => {
        const hideScroll = (e) => {
            if ( !e.target.classList.contains('clickableItem') )
            {
                setClickedItems(null)
            }
        }
        document.addEventListener('click', hideScroll);
        return () => {
            document.removeEventListener('click', hideScroll)
        }
    }, [])

    const clickHandler = (e) => {
        if ( e.target.classList.contains('clickableItem') )
        {
            setClickedItems([JSON.parse(e.target.value)])
        }
    }
    return (
        <StyledPlayableContainerDiv>
            <ContextMenu>
                <AddQueueMenu cid={container.cid} content={clickedItems} />
            </ContextMenu>
            <Image style={{
                display: 'grid',
                gridRow: '1 / 2',
                gridColumn: '1 / 2', 
                maxHeight: '256px',
                maxWidth: '256px',
                width: '100%', 
                height: 'auto'
            }} src={container.image_url} />
            <div style={{display: 'flex', 
                flexDirection:'column', 
                padding: '15px', 
                gridColumn: '2 / 3', 
                placeSelf: 'center stretch'}}
            >
                <h2 style={{fontWeight: 'normal'}}>{container.name}</h2>
                <h3 style={{fontWeight: 300}}>{container.artist}</h3>
            </div>
            <div style={{
                display: 'grid',
                gridRow: '2 / 3', 
                gridColumn: '1 / 3'}}
            >
                <Button variant='success' onClick={() => setClickedItems(items)} className='clickableItem clickableAlbum'>Play Album</Button>
            </div>
            <StyledPlayableItemsListDiv onClick={clickHandler} style={{overflow: clickedItems ? 'hidden' : 'overlay'}}>
                {items.map(item => <StyledPlayableItemDiv key={item.mid}><Button value={JSON.stringify(item)} className='clickableItem'>{item.name}</Button></StyledPlayableItemDiv>)}
            </StyledPlayableItemsListDiv>
        </StyledPlayableContainerDiv>
    )
}

export default PlayableContainer