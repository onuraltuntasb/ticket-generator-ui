import { Box, Container, Paper } from '@mui/material';
import DetailedEvent from 'components/DetailedEvent';
import DetailedTicket from 'components/DetailedTicket';
import TicketTable from 'components/TicketTable';
import TopBar from 'components/TopBar';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useAppSelector } from 'redux/hooks';

import { useLazyGetAllTicketByAuthUserQuery } from 'redux/services/ticketApi';

const UserTickets = (props) => {
    const [trigger, { data: ticketListData, isSuccess }] = useLazyGetAllTicketByAuthUserQuery();

    const [ticketListDataParsed, setticketListDataParsed] = useState(null);

    const selectedTicketData = useAppSelector((state) => state?.ticket?.sendSelectedTicketData);

    useEffect(() => {
        trigger();
    }, []);

    useEffect(() => {
        if (isSuccess) {
            setticketListDataParsed(ticketListData);
        }
    }, [ticketListData]);

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
                        <TicketTable ticketList={ticketListDataParsed} />

                        {selectedTicketData && selectedTicketData[0]?.name ? <DetailedTicket /> : null}

                        {selectedTicketData && selectedTicketData[0]?.name ? <DetailedEvent /> : null}
                    </Box>
                </Paper>
            </Container>
            {/*     {selectedTicketData
        ? JSON.stringify(selectedTicketData)
        : 'selectedTicketData'} */}
            <br />
        </div>
    );
};

export default UserTickets;
