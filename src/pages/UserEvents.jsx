import { Box, Container, Paper } from '@mui/material';
import DetailedEvent from 'components/DetailedEvent';
import EventTable from 'components/EventTable';
import TopBar from 'components/TopBar';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useAppSelector } from 'redux/hooks';
import { useLazyGetAllEventByAuthUserQuery } from 'redux/services/eventApi';

const UserEvents = (props) => {
    const [trigger, { data: eventListData, isSuccess }] = useLazyGetAllEventByAuthUserQuery();

    const [eventListDataParsed, seteventListDataParsed] = useState(null);

    const selectedEventData = useAppSelector((state) => state?.event?.sendSelectedEventData);

    useEffect(() => {
        trigger();
    }, []);

    useEffect(() => {
        if (isSuccess) {
            seteventListDataParsed(eventListData);
        }
    }, [eventListData]);

    return (
        <div>
            <TopBar isAuthenticated={props.isAuthenticated} />
            <Container maxWidth="xl">
                <Paper sx={{ marginTop: '16px' }} elevation={3}>
                    <Box
                        display="flex"
                        flexDirection="column"
                        component="form"
                        noValidate
                        autoComplete="off"
                        sx={{ padding: '16px' }}
                    >
                        <EventTable eventList={eventListDataParsed} />

                        {selectedEventData && selectedEventData[0]?.name ? <DetailedEvent /> : null}
                    </Box>
                </Paper>
            </Container>
            {/*  {eventListData && isSuccess
        ? JSON.stringify(eventListData)
        : 'eventListStateDataBos'} */}
            <br />
        </div>
    );
};

export default UserEvents;
