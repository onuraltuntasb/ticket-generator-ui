import { Box, Container, Paper } from '@mui/material';
import DetailedEvent from 'components/DetailedEvent';
import EventTable from 'components/EventTable';
import TopBar from 'components/TopBar';
import React from 'react';
import { useEffect } from 'react';
import { useAppSelector } from 'redux/hooks';
import { useLazyGetAllEventQuery } from 'redux/services/eventApi';

const Events = (props) => {
    const [trigger, { data: eventListData }] = useLazyGetAllEventQuery();

    useEffect(() => {
        trigger();
    }, []);

    const selectedEventData = useAppSelector((state) => state?.event?.sendSelectedEventData);
    return (
        <div>
            <TopBar isAuthenticated={props.isAuthenticated} />
            <Container maxWidth="xl">
                <Paper sx={{ marginTop: '16px' }} elevation={1}>
                    <Box
                        display="flex"
                        flexDirection="column"
                        component="form"
                        noValidate
                        autoComplete="off"
                        sx={{ padding: '16px' }}
                    >
                        <EventTable eventList={eventListData} disableOperations={true} />

                        {selectedEventData && selectedEventData[0]?.name ? <DetailedEvent /> : null}
                    </Box>
                </Paper>
            </Container>

            <br />
        </div>
    );
};

export default Events;
