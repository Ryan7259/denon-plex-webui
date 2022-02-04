import { Draggable } from 'react-beautiful-dnd'
import './QueueItem.css'
import styled from 'styled-components'

const StyledItemDiv = styled.div`
    display: grid;
    position: relative;
    justify-content: center;
    align-items: center;
    min-height: 50px;
    height: max-content;
    width: 100%;
    padding-left: 55px;

    background-color: ${props => props.isDragging || props.isSelected ? 'rgb(155, 100, 100)' : 'rgb(75,75,75)'};
    & * {
        background-color: ${props => props.isDragging || props.isSelected ? 'rgb(155, 100, 100)' : 'rgb(75,75,75)'};
    }
    opacity: ${props => props.isGhosting ? '0.2' : '1' };
    border-bottom: ${props => props.isDragging ? '0' : '1px solid rgba(0,0,0,0.45)'};
    border-radius: 4px;

    cursor: pointer;
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
const QueueItem = ({ item, index, handleItemDblClick, handleSelectItem, isSelected, isGhosting, selectionCount }) => 
{
    return (
        <Draggable draggableId={item.mid} index={index}>
            {(provided, snapshot) => (
                <StyledItemDiv
                    {...provided.draggableProps} 
                    {...provided.dragHandleProps} 
                    ref={provided.innerRef} 
                    onDoubleClick={(e) => handleItemDblClick(e, index)}
                    onClick={(e) => handleSelectItem(e, item)}
                    isSelected={isSelected}
                    isDragging={snapshot.isDragging}
                    isGhosting={isGhosting}
                    selectionCount={selectionCount}
                >
                    <div className='queueItemWrapper'>
                        <div style={{display: 'grid', gridColumn: '1/2', gridTemplateRows: 'max-content max-content', lineHeight: '20px', fontWeight: '400', overflow: 'hidden'}}>
                            <span style={{display: 'grid', gridRow: '1/2', width: 'max-content', fontSize: 'large', fontWeight: '500'}}>{(item.album) ? `${item.album}` : null}</span>
                            <span style={{display: 'grid', gridRow: '2/3', width: 'max-content'}}>{(item.artist) ? `${item.artist}` : null}</span>
                        </div>
                        <div style={{display: 'grid', gridColumn: '2/3', fontSize: 'larger', fontWeight: '500'}}>
                            <span style={{width: 'max-content'}}>{(item.name) ? item.name: item.song}</span>
                        </div>
                    </div>
                    {(snapshot.isDragging && selectionCount > 1)  ? <DragCountDiv>{selectionCount}</DragCountDiv> : null}
                </StyledItemDiv>
            )}
        </Draggable>
    )
}
export default QueueItem