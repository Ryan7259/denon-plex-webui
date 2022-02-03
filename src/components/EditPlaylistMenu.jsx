import { Button } from 'react-bootstrap'
import styled from 'styled-components'

const MenuButton = styled(Button)`
border: 0px;
z-index: 1;
`
const Menu = styled.div`
display: grid;
grid-template-rows: 1fr 1fr 1fr 1fr;
gap: 1px;
`
const EditPlaylistMenu = ({ handleDelete, startRename }) => {

    return (
        <Menu>
            <MenuButton onClick={startRename} className='rename-playlist' variant='secondary'>Rename</MenuButton>
            <MenuButton onClick={handleDelete} variant='danger'>Delete</MenuButton>
        </Menu>
    )
}

export default EditPlaylistMenu