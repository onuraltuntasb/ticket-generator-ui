import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sendSelectedTicketData: {},
}

export const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    sendSelectedTicketData: (state, action) => {
      state.sendSelectedTicketData = action.payload
    },
  },
})

export const { sendSelectedTicketData } = ticketSlice.actions
export default ticketSlice.reducer
