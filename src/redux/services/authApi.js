import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const REACT_APP_BACKEND_HOST_PORT = ''

if (process.env.NODE_ENV !== 'production') {
  REACT_APP_BACKEND_HOST_PORT = process.env.REACT_APP_BACKEND_HOST_PORT_DEV
} else {
  REACT_APP_BACKEND_HOST_PORT = process.env.REACT_APP_BACKEND_HOST_PORT_PROD
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: REACT_APP_BACKEND_HOST_PORT + '/api/user',
  }),
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (body) => {
        return {
          url: '/login',
          method: 'post',
          body,
        }
      },
    }),
    registerUser: builder.mutation({
      query: (body) => {
        return {
          url: '/register',
          method: 'post',
          body,
        }
      },
    }),
  }),
})

export const { useLoginUserMutation, useRegisterUserMutation } = authApi
