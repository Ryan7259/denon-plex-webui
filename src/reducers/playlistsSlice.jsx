import { createSlice } from '@reduxjs/toolkit'

const playlistsSlice = createSlice({
    name: 'playlists',
    initialState: {
        playlists: [
            /*
            {name: 'Arctic Monkeys Playlist', cid: 'a'},
            {name: 'Benee Playlist', cid: 'b'},
            {name: 'TaySwift Playlist', cid: 'c'},
            {name: 'NAV Playlist', cid: 'd'}
            */
        ]
    },
    reducers: {
        setPlaylists: (state, action) => {
            console.log('setting playlist:', action.payload)
            state.playlists = action.payload
        },
        clearPlaylists: state => {
            state.playlists = []
        }
    }
})


export const { setPlaylists, clearPlaylists } = playlistsSlice.actions

export default playlistsSlice.reducer