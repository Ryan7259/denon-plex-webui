import React, { useState } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import styled from 'styled-components'

const StyledContainerDiv = styled.div`
    display: grid;
    margin: 2px 0px 2px 0px;
    opacity: ${props => props.showSpinner ? '0.5' : '1'};
`

const Container = ({ item, handleContainerCmds }) => {
    const [ showSpinner, setShowSpinner ] = useState(false)
    const handleContainerClick = () => {
        setShowSpinner(true)

        // at playable container level
        if (item.playable === 'yes')
        {
            handleContainerCmds(null, item.cid, item)
        }
        // at unplayable container level
        else if (item.container === 'yes')
        {   
            handleContainerCmds(null, item.cid)
        }
        // at source container level
        else
        {
            handleContainerCmds(item.sid)
        }
    }

    return (
        <StyledContainerDiv showSpinner={showSpinner}>
            <Button onClick={handleContainerClick}>{item.name}  {showSpinner ? <Spinner as="span" animation="border" size="sm"/> : null}</Button>
        </StyledContainerDiv>
    )
}

export default Container