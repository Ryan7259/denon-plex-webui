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
        readyForIPCEvents: null,
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
            state.clientIP = action.payload ? `http://${action.payload}` : ''
        },
        setReadyForIPCEvents: (state, action) => {
            state.readyForIPCEvents = action.payload
        },
        // Don't want to reset settings or searched IPs, only connection state info
        clearInfo: (state) => {
            state.pid = null
            state.sid = null
            state.readyForIPCEvents = null
        }
    }
})

export const { setPid, setSid, setClientIP, setReadyForIPCEvents, clearInfo } = infoSlice.actions

export default infoSlice.reducer