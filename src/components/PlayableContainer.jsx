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
    const [ clickedItems, setClickedItems ] = useState(null)
    
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
            }} fluid={true} src={container.image_url} />
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
                <Button variant='success' onClick={() => setClickedItems(items)} className='clickableItem'>Play Album</Button>
            </div>
            <StyledPlayableItemsListDiv style={{overflow: clickedItems ? 'hidden' : 'auto'}}>
                {items.map(item => <StyledPlayableItemDiv key={item.mid}><Button onClick={() => setClickedItems([item])} className='clickableItem'>{item.name}</Button></StyledPlayableItemDiv>)}
            </StyledPlayableItemsListDiv>
        </StyledPlayableContainerDiv>
    )
}

export default PlayableContainer