import { configureStore } from '@reduxjs/toolkit'

import { authApi } from './services/authApi'
import authReducer from '../redux/features/authSlice'

export const setupStore = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
})
