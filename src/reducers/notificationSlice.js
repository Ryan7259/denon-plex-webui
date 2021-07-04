import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: {
        message: '',
        gotNotification: false
    },
    reducers: {
        setNotification: (state, action) => {
            state.message = action.payload
            state.gotNotification = true
        },
        resetGotNotification: state => {
            state.gotNotification = false
        }
    }
})

export const { setNotification, resetGotNotification } = notificationSlice.actions

export default notificationSlice.reducer