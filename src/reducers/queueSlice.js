import { createSlice } from '@reduxjs/toolkit'

// only changes queue, need to keep separate slice to handle player state
const queueSlice = createSlice({
    name: 'queue',
    initialState: {
        queue: [
            /*
            {album: 'AM', artist: 'Arctic Monkeys', song: `She's Thunderstorms`, qid: 1, mid: 'a1'}, 
            {album: 'AM', artist: 'Arctic Monkeys', song: 'Black Treacle', qid: 2, mid: 'b2'},
            {album: 'AM', artist: 'Arctic Monkeys', song: 'No.1 Party Anthem', qid: 3, mid: 'c3'}, 
            {album: 'AM', artist: 'Arctic Monkeys', song: 'Snap Out Of It', qid: 4, mid: 'd4'},
            */
        ],
        // used to prevent duplicate mids
        countSoFar: 0
    },
    reducers: {
        setQueue: (state, action) => {
            // loop thru to create qid indices
            // needed for adding new items to queue, since qid generation is only done on physical player
            let newQ = []
            for ( let i = 0; i < action.payload.length; ++i )
            {
                newQ.push({
                    ...action.payload[i],
                    mid: `${action.payload[i].mid}${state.countSoFar++}`,
                    qid: i+1,
                })
            }
            //console.log('new queue:', newQ)
            state.queue = newQ
        },
        clearQueue: (state) => {
            state.queue = []
        }
    }
})

export const { setQueue, clearQueue } = queueSlice.actions

export default queueSlice.reducer