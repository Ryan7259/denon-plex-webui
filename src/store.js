import { createStore, combineReducers } from 'redux'
import notificationSlice from './reducers/notificationSlice.js'
import playlistsSlice from './reducers/playlistsSlice.js'
import queueSlice from './reducers/queueSlice.js'
import infoSlice from './reducers/infoSlice.js'
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