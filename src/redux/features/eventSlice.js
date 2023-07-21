import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sendSelectedEventData: {},
}

export const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    sendSelectedEventData: (state, action) => {
      state.sendSelectedEventData = action.payload
    },
  },
})

export const { sendSelectedEventData } = eventSlice.actions
export default eventSlice.reducer
