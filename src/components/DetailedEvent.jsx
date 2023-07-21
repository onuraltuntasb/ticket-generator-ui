import { Box, Button, Chip, Grid, Paper } from '@mui/material';
import React, { useState } from 'react';
import { useAppSelector } from 'redux/hooks';
import ModalBase from './ModalBase';
import { ConfirmationNumberRounded, EventSeat, ReduceCapacity } from '@mui/icons-material';
import AddUpdateTicketForm from './form/AddUpdateTicketForm';
import { useGetAllTagsQuery } from 'redux/services/tagApi';
import { useEffect } from 'react';
import { useSnackbar } from 'notistack';

const DetailedEvent = () => {
    const { enqueueSnackbar } = useSnackbar();

    const [isOpen, setisOpen] = useState(false);
    const [tagOptions, settagOptions] = useState(null);
    const [showFullSizeToggle, setShowFullSizeToggle] = useState(false);

    const selectedEventData = useAppSelector((state) => state?.event?.sendSelectedEventData);
    const { data: tagOptionsData, isError: tagOptionsIsError, isSuccess: tagOptionsIsSuccess } = useGetAllTagsQuery();
    const authUserData = useAppSelector((state) => state?.auth?.sendAuthUserData);

    useEffect(() => {
        if (tagOptionsIsError) {
            enqueueSnackbar('Get tag options error!', { variant: 'error' });
            //console.log('Get tag options error!');
        }
    }, [tagOptionsIsError]);

    useEffect(() => {
        if (tagOptionsData && tagOptionsIsSuccess && selectedEventData) {
            var tagOptionsDataTemp = null;
            selectedEventData[0]?.tags.forEach((se) => {
                tagOptionsDataTemp = tagOptionsData.filter((to) => to.id === se);
            });
            settagOptions(tagOptionsDataTemp);
        }
    }, [tagOptionsData, tagOptionsIsSuccess, selectedEventData]);

    return (
        <div>
            <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2, padding: 2 }} elevation={1}>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <span style={{ fontWeight: 500 }}>Event Detail</span>
                        </Grid>
                        <Grid item xs={4}>
                            <Button
                                onClick={() => {
                                    if (!authUserData?.isAuth) {
                                        //navigate('/login');
                                        enqueueSnackbar('Please first login.', { variant: 'success' });
                                    } else {
                                        setisOpen(true);
                                    }
                                }}
                                variant="outlined"
                                startIcon={<ConfirmationNumberRounded />}
                            >
                                Buy Ticket
                            </Button>

                            <Button
                                sx={{ ml: 2 }}
                                onClick={() => setShowFullSizeToggle(!showFullSizeToggle)}
                                variant="outlined"
                                startIcon={<ReduceCapacity />}
                            >
                                Show Seating
                            </Button>
                        </Grid>
                        <Grid item xs={8}>
                            <span style={{ fontWeight: 500 }}>Name: </span>
                            <span>{selectedEventData[0]?.name}</span>
                        </Grid>
                        <Grid item xs={4}>
                            <span style={{ fontWeight: 500 }}>Tags: </span>
                            {tagOptions?.map((el) => (
                                <Chip key={el?.id} label={el?.name} />
                            ))}
                        </Grid>
                        <Grid item xs={8}>
                            <span style={{ fontWeight: 500 }}>Description: </span>
                            <span>{selectedEventData[0]?.description}</span>
                        </Grid>
                        <Grid item xs={4}>
                            <span style={{ fontWeight: 500 }}>Seats: </span>
                            <span>
                                {JSON.parse(JSON.stringify(selectedEventData[0]?.seats)).map((el) => (
                                    <Chip
                                        key={el?.name}
                                        icon={<EventSeat style={{ color: el?.isReserved ? '#FF9E9E' : 'green' }} />}
                                        label={el?.name}
                                    />
                                ))}
                            </span>
                        </Grid>

                        <Grid item xs={8}>
                            <span style={{ fontWeight: 500 }}>CreatedAt: </span>
                            <span>{new Date(selectedEventData[0]?.createdAt).toLocaleString()}</span>
                        </Grid>
                        <Grid item xs={4}>
                            <span style={{ fontWeight: 500 }}>UpdatedAt: </span>
                            {new Date(selectedEventData[0]?.updatedAt).toLocaleString()}
                        </Grid>
                    </Grid>
                </Paper>
            </Box>

            <ModalBase
                style={{ zIndex: 2000 }}
                modalWidth={'auto'}
                modalHeight={'auto'}
                modalTop={'50%'}
                isOpen={showFullSizeToggle}
                setIsOpen={setShowFullSizeToggle}
                childComp={
                    <Box
                        component="img"
                        src={selectedEventData[0]?.seatingImageReference}
                        alt={'eventSeating'}
                        sx={{ height: 'auto', width: 'auto' }}
                    />
                }
            />

            <ModalBase
                modalTop={'50%'}
                isOpen={isOpen}
                setIsOpen={setisOpen}
                childComp={<AddUpdateTicketForm setIsOpen={setisOpen} operationType={'add'} />}
            />

            {/*   {JSON.stringify(selectedEventData)} */}
        </div>
    );
};

export default DetailedEvent;
