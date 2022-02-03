import { createSlice } from '@reduxjs/toolkit'
import playerStates from '../utils/playerStates'

const playerSlice = createSlice({
    name: 'player',
    initialState: {
        currentItem: null,
        duration: {
            progress: 0,
            total: 0
        },
        playState: playerStates.playMode.paused,
        blockEventUpdates: false
    },
    reducers: {
        setCurrentItem: (state, action) => {
            console.log('replacing currItem with:', action.payload)
            state.currentItem = action.payload
            state.duration = {progress: 0, total: 0}
        },
        setPlayState: (state, action) => {
            state.playState = action.payload
        },
        setDuration: (state, action) => {
            state.duration = {
                ...action.payload
            }
        },
        setBlockEventUpdates: (state, action) => {
            if ( action.payload )
            {
                console.log('Started blocking events...')
            }
            else
            {
                console.log('Ending blocking events...')
            }
            state.blockEventUpdates = action.payload
        }
    }
})

export const { setCurrentItem, setPlayState, setDuration, setBlockEventUpdates } = playerSlice.actions

export default playerSlice.reducer