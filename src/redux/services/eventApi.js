import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getReactBackendHostPort } from './authApi';

export const eventApi = createApi({
    reducerPath: 'eventApi',
    baseQuery: fetchBaseQuery({
        baseUrl: getReactBackendHostPort() + '/api/event'
    }),
    endpoints: (builder) => ({
        getAllEventByAuthUser: builder.query({
            query: () => '/getallbyauthuser'
        }),

        getAllEvent: builder.query({
            query: () => '/getall'
        }),

        getEvent: builder.query({
            query: (eventId) => {
                return {
                    url: '/get?event-id=' + eventId
                };
            }
        }),

        addEvent: builder.mutation({
            query: (body) => {
                return {
                    url: '/save',
                    method: 'post',
                    body
                };
            }
        }),

        updateEvent: builder.mutation({
            query: (data) => {
                console.log(data);
                const { eventId, ...body } = data;
                return {
                    url: '/update?event-id=' + eventId,
                    method: 'put',
                    body
                };
            }
        }),

        deleteEvent: builder.mutation({
            query: (eventId) => {
                console.log(eventId);
                return {
                    url: '/delete?event-id=' + eventId,
                    method: 'delete'
                };
            }
        })
    })
});

export const {
    useLazyGetAllEventByAuthUserQuery,
    useLazyGetEventQuery,
    useGetAllEventByAuthUserQuery,
    useLazyGetAllEventQuery,
    useAddEventMutation,
    useUpdateEventMutation,
    useDeleteEventMutation
} = eventApi;
