import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  email: null,
  name: null,
  authorities: null,
  jwtToken: null,
  jwtRefreshToken: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      localStorage.setItem(
        'user',
        JSON.stringify({
          name: action.payload.email,
          token: action.payload.jwtToken,
        }),
      )
      state.name = action.payload.name
      state.jwtToken = action.payload.jwtToken
      state.email = action.payload.email
      state.authorities = action.payload.authorities
    },
    logout: (state) => {
      localStorage.clear()
      state.name = null
      state.jwtToken = null
      state.authorities = null
      state.email = null
    },
  },
})

export const selectAuth = (state) => state.auth
export const { setUser, logout } = authSlice.actions
export default authSlice.reducer
