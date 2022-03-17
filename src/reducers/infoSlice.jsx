import { createSlice } from '@reduxjs/toolkit'

/*
pid = player id
sid = source id
*/
export const infoSlice = createSlice({
    name: 'info',
    initialState: {
        pid: null, 
        sid: null, 
        clientIP: null,
        deviceIP: null,
        readyForEvents: null,
    },
    reducers: {
        setPid: (state, action) => {
            state.pid = action.payload
        },
        setSid: (state, action) => {
            state.sid = action.payload
        },
        setClientIP: (state, action) =>
        {
            state.clientIP = action.payload ? `http://${action.payload}:32400` : ''
        },
        setReadyForEvents: (state, action) => {
            state.readyForEvents = action.payload
        },
        // Don't want to reset settings or searched IPs, only connection state info
        clearInfo: (state) => {
            state.pid = null
            state.sid = null
            state.readyForEvents = null
        }
    }
})

export const { setPid, setSid, setClientIP, setReadyForEvents, clearInfo } = infoSlice.actions

export default infoSlice.reducer