import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Alert, AlertTitle, Box, Button, ListItemIcon, MenuItem } from '@mui/material';
import FormInput from 'components/mui-rhf/FormInput';
import { useSnackbar } from 'notistack';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { useAddTicketMutation, useUpdateTicketMutation } from 'redux/services/ticketApi';
import { object, string } from 'zod';
import { ticketApi } from '../../redux/services/ticketApi';
import FormSelect from 'components/mui-rhf/FormSelect';
import { EventSeat, ReduceCapacity } from '@mui/icons-material';
import ModalBase from 'components/ModalBase';
import { useLazyGetEventQuery } from 'redux/services/eventApi';
import { sendSelectedTicketData } from 'redux/features/ticketSlice';

const AddUpdateTicketForm = (props) => {
    const { operationType, setIsOpen, setSelectedProp } = props;
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const selectedTicketData = useAppSelector((state) => state?.ticket?.sendSelectedTicketData);

    const selectedEventData = useAppSelector((state) => state?.event?.sendSelectedEventData);

    const [addTicketErrorDataParsed, setaddTicketErrorDataParsed] = useState(null);
    const [showFullSizeToggle, setShowFullSizeToggle] = useState(false);
    const [updateTicketErrorDataParsed, setupdateTicketErrorDataParsed] = useState(null);

    const [trigger, { data: eventData, isSuccess: isEventSuccess }] = useLazyGetEventQuery();

    const addEventSchema = object({
        name: string().min(1, 'Name are required'),
        seatNumber: string()
    });

    var defaultValues = {
        name: '',
        seatNumber: ''
    };

    const methods = useForm({
        resolver: zodResolver(addEventSchema),
        defaultValues
    });

    const onSubmitHandler = (values) => {
        if (operationType === 'edit') {
            updateTicket({
                eventId: selectedTicketData[0]?.event?.id,
                ticketId: selectedTicketData[0].id,
                ...values
            });
        } else if (operationType === 'add') {
            if (selectedTicketData[0]?.event?.id) {
                addTicket({ eventId: selectedTicketData[0]?.event?.id, ...values });
            } else {
                addTicket({ eventId: selectedEventData[0]?.id, ...values });
            }
        }
    };

    useEffect(() => {
        if (operationType != null && operationType === 'edit') {
            if (selectedTicketData) {
                methods.setValue('name', selectedTicketData[0]?.name);
                methods.setValue('seatNumber', selectedTicketData[0]?.seatNumber);
            }
        }
    }, [operationType, selectedTicketData]);

    const [
        addTicket,
        {
            data: addTicketData,
            isSuccess: isAddTicketSuccess,
            isError: isAddTicketError,
            error: addTicketErrorData,
            isLoading: isAddTicketLoading
        }
    ] = useAddTicketMutation();
    const [
        updateTicket,
        {
            data: updateTicketData,
            isSuccess: isUpdateTicketSuccess,
            isError: isUpdateTicketError,
            error: updateTicketErrorData,
            isLoading: isUpdateTicketLoading
        }
    ] = useUpdateTicketMutation();

    useEffect(() => {
        if (updateTicketData && selectedEventData) {
            trigger(selectedEventData[0].id);
        }
    }, [updateTicketData, selectedEventData]);

    useEffect(() => {
        if (updateTicketData) {
            dispatch(
                ticketApi.util.updateQueryData('getAllTicketByAuthUser', undefined, (allTickets) => {
                    if (eventData && isEventSuccess) {
                        //console.log(eventData);
                        dispatch(sendSelectedTicketData({ ...updateTicketData, event: eventData }));
                        setSelectedProp([]);
                        return allTickets?.map((el) =>
                            el.id === updateTicketData?.id ? { ...updateTicketData, event: eventData } : el
                        );
                    }
                })
            );
        }
    }, [updateTicketData, eventData]);

    useEffect(() => {
        if (addTicketData && selectedEventData) {
            trigger(selectedEventData[0].id);
        }
    }, [addTicketData, selectedEventData]);

    useEffect(() => {
        if (addTicketData) {
            //console.log(addTicketData);
            //TODO  get event data than add to the ticket data and mutate AllTicket
            //TODO  mutate ticket.event.seat dont get all tickets again
            dispatch(
                ticketApi.util.updateQueryData('getAllTicketByAuthUser', undefined, (allTickets) => {
                    if (eventData && isEventSuccess) {
                        //console.log(eventData);
                        dispatch(sendSelectedTicketData({ ...addTicketData, event: eventData }));
                        //TODO setSelectedProp not a function error idk
                        //setSelectedProp([]);
                        return [...allTickets, { ...addTicketData, event: eventData }];
                    }
                })
            );
        }
    }, [addTicketData, eventData]);

    useEffect(() => {
        if (operationType != null && operationType === 'add') {
            if (isAddTicketSuccess) {
                setIsOpen(false);
                enqueueSnackbar('Ticket add successfull!', { variant: 'success' });
                navigate('/user-tickets');
            } else if (isAddTicketError && addTicketErrorData) {
                if (addTicketErrorData?.data?.status === 'FORBIDDEN') {
                    navigate('/login');
                    enqueueSnackbar('Please login first.', { variant: 'warning' });
                }
                //console.log(addTicketErrorData);
                enqueueSnackbar('Ticket add error!', { variant: 'error' });
            }
        } else if (operationType != null && operationType === 'edit') {
            if (isUpdateTicketSuccess) {
                setIsOpen(false);
                enqueueSnackbar('Ticket update successfull!', { variant: 'success' });
            } else if (isUpdateTicketError) {
                enqueueSnackbar('Ticket update error!', { variant: 'error' });
            }
        }
    }, [
        isAddTicketSuccess,
        isAddTicketError,
        isUpdateTicketSuccess,
        isUpdateTicketError,
        operationType,
        addTicketErrorData
    ]);

    useEffect(() => {
        if (isAddTicketError && addTicketErrorData) {
            //console.log(JSON.stringify(addTicketErrorData?.data['errors'][0]));
            setaddTicketErrorDataParsed(addTicketErrorData?.data['errors']);
        }
    }, [isAddTicketError, addTicketErrorData]);

    useEffect(() => {
        if (isUpdateTicketError && updateTicketErrorData) {
            setupdateTicketErrorDataParsed(updateTicketErrorData);
        }
    }, [isUpdateTicketError, updateTicketErrorData]);

    const renderErrorAlert = () => {
        if (operationType === 'edit' && updateTicketErrorData) {
            return (
                <>
                    <Alert sx={{ mt: '8px' }} severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {JSON.stringify(updateTicketErrorDataParsed)} — <strong>check it out!</strong>
                    </Alert>
                </>
            );
        } else if (operationType === 'add' && addTicketErrorData) {
            return (
                <>
                    <Alert sx={{ mt: '8px' }} severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {JSON.stringify(addTicketErrorDataParsed)} — — <strong>check it out!</strong>
                    </Alert>
                </>
            );
        }
    };

    return (
        <div>
            <FormProvider {...methods}>
                <Box
                    display="flex"
                    flexDirection="column"
                    component="form"
                    noValidate
                    autoComplete="off"
                    onSubmit={methods.handleSubmit(onSubmitHandler)}
                >
                    <FormInput
                        label="Enter name"
                        type="text"
                        name="name"
                        focused
                        required
                        sx={{ mb: '8px', mt: '16px' }}
                    />

                    <div style={{ position: 'relative' }}>
                        <FormSelect
                            id="seatNumber"
                            name="seatNumber"
                            label="Enter seat"
                            variant="outlined"
                            control={methods.control}
                            margin="normal"
                            focused={true}
                            sx={{ mb: '8px', mt: '8px', width: '55%' }}
                        >
                            {selectedEventData[0]?.seats.map((el) => (
                                <MenuItem
                                    key={el?.name}
                                    disabled={el.isReserved ? true : false}
                                    style={{ position: 'relative' }}
                                    value={el.name}
                                >
                                    {el.name}
                                    <ListItemIcon style={{ position: 'absolute', right: 0 }}>
                                        {' '}
                                        <EventSeat style={{ color: el.isReserved ? 'red' : 'green' }} />{' '}
                                    </ListItemIcon>
                                </MenuItem>
                            ))}
                        </FormSelect>

                        <Button
                            size="large"
                            style={{ position: 'absolute', right: 0, marginTop: '6px' }}
                            onClick={() => setShowFullSizeToggle(!showFullSizeToggle)}
                            variant="outlined"
                            startIcon={<ReduceCapacity />}
                        >
                            Seating
                        </Button>
                    </div>

                    <LoadingButton
                        loading={operationType === 'edit' ? isUpdateTicketLoading : isAddTicketLoading}
                        type="submit"
                        variant="contained"
                        sx={{
                            mt: '8px',
                            width: '100%',
                            marginInline: 'auto'
                        }}
                    >
                        {operationType && operationType === 'edit' ? 'update' : 'add'}
                    </LoadingButton>

                    {renderErrorAlert()}

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
                                src={selectedEventData[0].seatingImageReference}
                                alt={'eventSeating'}
                                sx={{ height: 'auto', width: 'auto' }}
                            />
                        }
                    />
                </Box>
            </FormProvider>
        </div>
    );
};

export default AddUpdateTicketForm;
