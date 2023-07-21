import { Box, Grid, Paper } from '@mui/material';
import React, { useState } from 'react';
import { useAppSelector } from 'redux/hooks';
import ModalBase from './ModalBase';
import AddUpdateTicketForm from './form/AddUpdateTicketForm';

const DetailedTicket = () => {
    const [isOpen, setisOpen] = useState(false);

    const selectedTicketData = useAppSelector((state) => state?.ticket?.sendSelectedTicketData);

    return (
        <div>
            <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2, padding: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <span style={{ fontWeight: 500 }}>Ticket Detail</span>
                        </Grid>
                        <Grid item xs={4}>
                            <span style={{ fontWeight: 500 }}>Barcode: </span>
                            <span>{JSON.stringify(selectedTicketData[0]?.barcode)}</span>
                        </Grid>

                        <Grid item xs={8}>
                            <span style={{ fontWeight: 500 }}>Name: </span>
                            <span>{selectedTicketData[0]?.name}</span>
                        </Grid>
                        <Grid item xs={4}>
                            <span style={{ fontWeight: 500 }}>CreatedAt: </span>
                            <span>{new Date(selectedTicketData[0]?.createdAt).toLocaleString()}</span>
                        </Grid>
                        <Grid item xs={8}>
                            <span style={{ fontWeight: 500 }}>Seat: </span>
                            <span>{selectedTicketData[0]?.seatNumber}</span>
                        </Grid>
                        <Grid item xs={4}>
                            <span style={{ fontWeight: 500 }}>UpdatedAt: </span>
                            <span>{new Date(selectedTicketData[0]?.updatedAt).toLocaleString()}</span>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>

            <ModalBase
                modalTop={'50%'}
                isOpen={isOpen}
                setIsOpen={setisOpen}
                childComp={<AddUpdateTicketForm setIsOpen={setisOpen} operationType={'add'} />}
            />

            {/*  {JSON.stringify(selectedTicketData)} */}
        </div>
    );
};

export default DetailedTicket;
