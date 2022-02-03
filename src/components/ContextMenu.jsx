import { useState, useEffect } from 'react'

const ContextMenu = (props) => {
    const [ xPos, setXPos ] = useState('0px')
    const [ yPos, setYPos ] = useState('0px')
    const [ showMenu, setShowMenu ] = useState(false)
    
    useEffect(() => {
        //console.log('constructing click container')
        document.addEventListener("click", contextMenuClick);
        document.addEventListener("contextmenu", contextMenuClick);

        return () => {
            //console.log('deconstructing click container')
            document.removeEventListener("click", contextMenuClick);
            document.addEventListener("contextmenu", contextMenuClick);
        }
    }, [])

    const contextMenuClick = (e) => {
        if ( e.target.classList.contains('clickableItem') )
        {
            setXPos(e.pageX)
            setYPos(e.pageY)
            setShowMenu(true)
        }
        else
        {
            setShowMenu(false)
        }
    }

    const menuStyle = {
        position: 'absolute',
        top: yPos,
        left: xPos,
    }
    
    return (showMenu)
    ?
    (
        <div style={menuStyle}>
            {props.children}
        </div>
    )
    :
        null
}

export default ContextMenu