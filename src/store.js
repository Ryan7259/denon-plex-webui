import { createStore, combineReducers } from 'redux'
import notificationSlice from './reducers/notificationSlice'
import playlistsSlice from './reducers/playlistsSlice'
import queueSlice from './reducers/queueSlice'
import infoSlice from './reducers/infoSlice'
import playerSlice from './reducers/playerSlice'

const reducer = combineReducers({
    notification: notificationSlice,
    playlists: playlistsSlice,
    queue: queueSlice,
    info: infoSlice,
    player: playerSlice
})

const store = createStore(reducer)

export default store