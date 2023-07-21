import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getReactBackendHostPort } from './authApi';

export const tagApi = createApi({
    reducerPath: 'tagApi',
    baseQuery: fetchBaseQuery({
        baseUrl: getReactBackendHostPort() + '/api/tag'
    }),
    endpoints: (builder) => ({
        getAllTags: builder.query({
            query: () => '/all'
        })
    })
});

export const { useGetAllTagsQuery } = tagApi;
