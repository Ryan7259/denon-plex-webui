import { useState, useEffect } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import styled from 'styled-components'

const StyledContainerDiv = styled.div`
    display: grid;
    margin: 2px 0px 2px 0px;
`

const Container = ({ item, handleContainerCmds }) => {
    const [ showSpinner, setShowSpinner ] = useState(false)
    const handleContainerClick = async () => {
        setShowSpinner(true)

        // at playable container level
        if (item.playable === 'yes')
        {
            handleContainerCmds(null, item.cid, item)
        }
        // at unplayable container level
        else if (item.container === 'yes')
        {   
            if (!(await handleContainerCmds(null, item.cid)))
            {
                setShowSpinner(false)
            }
        }
        // at source container level
        else
        {
            handleContainerCmds(item.sid)
        }
    }

    useEffect(() => {
        return () => {
            setShowSpinner(false)
        }
    }, [])

    return (
        <StyledContainerDiv showSpinner={showSpinner}>
            <Button onClick={handleContainerClick} disabled={showSpinner}>{item.name} {showSpinner ? <Spinner as="span" animation="border" size="sm"/> : null}</Button>
        </StyledContainerDiv>
    )
}

export default Container