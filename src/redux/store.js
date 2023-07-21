import { configureStore } from '@reduxjs/toolkit';

import { authApi } from './services/authApi';
import { userSettingsApi } from './services/userSettingsApi';
import authReducer from '../redux/features/authSlice';
import { eventApi } from './services/eventApi';
import eventReducer from '../redux/features/eventSlice';
import { tagApi } from './services/tagApi';

import tagReducer from '../redux/features/tagSlice';
import { ticketApi } from './services/ticketApi';
import ticketReducer from '../redux/features/ticketSlice';

export const setupStore = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [userSettingsApi.reducerPath]: userSettingsApi.reducer,
        event: eventReducer,
        [eventApi.reducerPath]: eventApi.reducer,
        tag: tagReducer,
        [tagApi.reducerPath]: tagApi.reducer,
        ticket: ticketReducer,
        [ticketApi.reducerPath]: ticketApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(authApi.middleware)
            .concat(userSettingsApi.middleware)
            .concat(eventApi.middleware)
            .concat(tagApi.middleware)
            .concat(ticketApi.middleware)
});
