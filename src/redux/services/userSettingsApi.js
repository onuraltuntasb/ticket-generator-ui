import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getReactBackendHostPort } from './authApi';

export const userSettingsApi = createApi({
    reducerPath: 'userSettingsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: getReactBackendHostPort() + '/api/user'
    }),
    endpoints: (builder) => ({
        updateUser: builder.mutation({
            query: (body) => {
                return {
                    url: '/update',
                    method: 'put',
                    body
                };
            }
        })
    })
});

export const { useUpdateUserMutation } = userSettingsApi;
