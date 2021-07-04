import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { useSelector } from 'react-redux'
import playerStates from '../utils/playerStates'
import convertTime from '../utils/convertTime'
import './QueueItem.css'
import styled from 'styled-components'

const StyledCurrentItemDiv = styled.div`
    display: grid;
    position: relative;
    justify-content: center;
    align-items: center;
    min-height: 50px;
    height: max-content;
    width: 100%;
    padding-left: 10px;
    
    opacity: ${props => props.isGhosting ? '0.2' : '1' };
    border-bottom: ${props => props.isDragging ? '0' : '1px solid rgba(0,0,0,0.45)'};
    border-radius: 4px;
    background-color: ${props => props.isDragging || props.isSelected ? 'rgb(255, 200, 200)' : 'white'};

    font-weight: 500;
    user-select: none;
    outline: none;
`
const DragCountDiv = styled.div`
    display: flex;
    position: absolute;
    align-items: center;
    justify-content: center;
    border-radius: 50%;

    left: -15px;
    top: -15px;
    width: 40px;
    height: 40px;
    
    color: whitesmoke;
    font-size: larger;
    background-color: rgb(255,120,120);
    text-shadow: 2px 2px rgba(0,0,0,0.25);
`
const CurrentQueueItem = ({ item, index, handleSelectItem, isSelected, isGhosting, selectionCount }) => 
{
    const currPlayState = useSelector(state => state.player.playState)
    const duration = useSelector(state => state.player.duration)

    return (
        <Draggable draggableId={item.mid} index={index}>
            {(provided, snapshot) => (
                <StyledCurrentItemDiv 
                    ref={provided.innerRef} 
                    {...provided.draggableProps} 
                    {...provided.dragHandleProps} 
                    onClick={(e) => handleSelectItem(e, item)}
                    isSelected={isSelected}
                    isDragging={snapshot.isDragging}
                    isGhosting={isGhosting}
                >
                    <div className='queueItemWrapper currentlyPlaying' style={{gridTemplateColumns: '25px minmax(150px, 350px) minmax(325px, 500px)'}}>
                        <svg style={{display: 'grid', gridRow: '1/2', width: '25px'}}>
                            <g style={{opacity: currPlayState === playerStates.playMode.playing ? '0.8' : '0' }}>
                                <path
                                    d='M 0,0 L 0,25 L 25,12.5 z'
                                />
                            </g>
                            <g style={{opacity: currPlayState !== playerStates.playMode.playing ? '0.8' : '0' }}>
                                <rect x='0' y='0' width='10' height='25'/>
                                <rect x='15' y='0' width='10' height='25'/>
                            </g>
                        </svg>
                        <div style={{display: 'grid', gridColumn: '2/3', gridTemplateRows: 'max-content max-content', lineHeight: '20px', opacity: '0.75', fontWeight: '400', overflow: 'hidden'}}>
                            <span style={{display: 'grid', gridRow: '1/2', width: 'max-content',fontSize: 'large', fontWeight: '500'}}>{(item.album) ? `${item.album}` : null}</span>
                            <span style={{display: 'grid', gridRow: '2/3', width: 'max-content'}}>{(item.artist) ? `${item.artist}` : null}</span>
                        </div>
                        <div style={{display: 'grid', gridColumn: '3/4', gridTemplateColumns: 'max-content max-content', columnGap: '50px', fontSize: 'larger', fontWeight: '500'}}>
                            <span style={{display: 'grid', gridColumn: '1/2'}}>
                                {(item.name) ? item.name: item.song}
                            </span>
                            <span style={{display: 'grid', gridColumn: '2/3', fontWeight: '400', opacity: '0.75'}}>
                                {duration.total > 0 ? `${convertTime(duration.progress)}/${convertTime(duration.total)}` : ''}
                            </span>
                        </div>
                    </div>
                    {(snapshot.isDragging && selectionCount > 1)  ? <DragCountDiv>{selectionCount}</DragCountDiv> : null}
                </StyledCurrentItemDiv>
            )}
        </Draggable>
    )
}

export default CurrentQueueItem