import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getReactBackendHostPort } from './authApi';

export const ticketApi = createApi({
    reducerPath: 'ticketApi',
    baseQuery: fetchBaseQuery({
        baseUrl: getReactBackendHostPort() + '/api/ticket'
    }),
    endpoints: (builder) => ({
        getAllTicketByAuthUser: builder.query({
            query: () => '/getallbyauthuser'
        }),

        addTicket: builder.mutation({
            query: (data) => {
                console.log(data);
                const { eventId, ...body } = data;
                return {
                    url: '/save?event-id=' + eventId,
                    method: 'post',
                    body
                };
            }
        }),

        updateTicket: builder.mutation({
            query: (data) => {
                console.log(data);
                const { eventId, ticketId, ...body } = data;
                return {
                    url: '/update?event-id=' + eventId + '&ticket-id=' + ticketId,
                    method: 'put',
                    body
                };
            }
        }),

        deleteTicket: builder.mutation({
            query: (data) => {
                const { eventId, ticketId } = data;
                console.log(data);
                return {
                    url: '/delete?event-id=' + eventId + '&ticket-id=' + ticketId,
                    method: 'delete'
                };
            }
        })
    })
});

export const {
    useLazyGetAllTicketByAuthUserQuery,
    useAddTicketMutation,
    useUpdateTicketMutation,
    useDeleteTicketMutation
} = ticketApi;
