import { createSlice } from '@reduxjs/toolkit'

const initialState = {}

export const tagSlice = createSlice({
  name: 'tag',
  initialState,
  reducers: {
    setAllTags: (state, action) => {
      state = action.payload
    },
  },
})

export const { setAllTags } = tagSlice.actions
export default tagSlice.reducer
