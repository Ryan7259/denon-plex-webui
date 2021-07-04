import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import styled from 'styled-components'

const StyledPlaylistItemDiv = styled.div`
    height: 40px;
    text-align: center;
    border-bottom: ${props => props.isDragging ? '0' : '1px solid rgba(0,0,0,0.5)'};
    padding: 5px;
    background-color: ${props => props.isDragging ? 'rgb(255, 200, 200)' : 'white'};
`
const PlaylistItem = ({playlist, index}) => 
{
    return (
        <Draggable draggableId={playlist.cid} index={index}>
            {(provided, snapshot) => (
                <StyledPlaylistItemDiv 
                    ref={provided.innerRef} 
                    {...provided.draggableProps} 
                    {...provided.dragHandleProps} 
                    isDragging={snapshot.isDragging}
                >
                    {playlist.name}
                </StyledPlaylistItemDiv>
            )}
        </Draggable>
    )
}

export default PlaylistItem