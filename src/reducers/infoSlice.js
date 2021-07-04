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
        plexIp: null,
        evtSource: null,
    },
    reducers: {
        setPid: (state, action) => {
            state.pid = action.payload
        },
        setSid: (state, action) => {
            state.sid = action.payload
        },
        setPlexSeverIP: (state, action) =>
        {
            state.plexIp = `http://${action.payload}`
        },
        setEvtSource: (state, action) => {
            state.evtSource = action.payload
        },
        // Don't want to reset settings or searched IPs, only connection state info
        clearInfo: (state) => {
            state.pid = null
            state.sid = null
            state.evtSource = null
        }
    }
})

export const { setPid, setSid, setPlexSeverIP, setEvtSource, clearInfo } = infoSlice.actions

export default infoSlice.reducer