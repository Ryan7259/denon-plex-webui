import React, { useState } from 'react'
import AddQueueMenu from './AddQueueMenu'
import ContextMenu from './ContextMenu'
import { Button, Media } from 'react-bootstrap'

const PlayableContainer = ({ container, items }) => {
    const [ clickedItems, setClickedItems ] = useState(null)
    
    return (
        <div className='playableContainer'>
            <ContextMenu>
                <AddQueueMenu cid={container.cid} content={clickedItems} />
            </ContextMenu>
            <Media style={{gridRow: '1 / 2', gridColumn: '1 / 3', display: 'grid'}}>  
                <img
                    style={{
                        gridColumn: '1 / 2', 
                        maxHeight: '256px',
                        maxWidth: '256px',
                        width: '100%', 
                        height: 'auto'
                    }}
                    src={container.image_url}
                />
                <Media.Body style={{padding: '15px', gridColumn: '2 / 3', placeSelf: 'center stretch'}}>
                    <h2>{container.name}</h2>
                </Media.Body>
            </Media>
            <div style={{gridRow: '2 / 3', gridColumn: '1 / 3', display: 'grid'}}>
                <Button variant='success' onClick={() => setClickedItems(items)} className='clickableItem'>Play Album</Button>
            </div>
            <div className='playableItemsList'>
                {items.map(item => <div key={item.mid} className='playableItem'><Button onClick={() => setClickedItems([item])} className='clickableItem'>{item.name}</Button></div>)}
            </div>
        </div>
    )
}

export default PlayableContainer