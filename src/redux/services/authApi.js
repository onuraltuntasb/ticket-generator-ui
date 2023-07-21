import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const getReactBackendHostPort = () => {
    var REACT_APP_BACKEND_HOST_PORT = '';

    if (process.env.NODE_ENV !== 'production') {
        REACT_APP_BACKEND_HOST_PORT = process.env.REACT_APP_BACKEND_HOST_PORT_DEV;
    } else {
        REACT_APP_BACKEND_HOST_PORT = process.env.REACT_APP_BACKEND_HOST_PORT_PROD;
    }
    return REACT_APP_BACKEND_HOST_PORT;
};

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: getReactBackendHostPort() + '/api/user'
    }),
    endpoints: (builder) => ({
        loginUser: builder.mutation({
            query: (body) => {
                return {
                    url: '/login',
                    method: 'post',
                    body
                };
            }
        }),
        registerUser: builder.mutation({
            query: (body) => {
                return {
                    url: '/register',
                    method: 'post',
                    body
                };
            }
        }),
        forgotPassword: builder.mutation({
            query: (body) => {
                return {
                    url: '/forgot-password',
                    method: 'post',
                    body
                };
            }
        }),
        resetPassword: builder.mutation({
            query: (body) => {
                return {
                    url: '/reset-password',
                    method: 'post',
                    body
                };
            }
        })
    })
});

export const { useLoginUserMutation, useRegisterUserMutation, useForgotPasswordMutation, useResetPasswordMutation } =
    authApi;
