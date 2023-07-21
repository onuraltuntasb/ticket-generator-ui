import { Alert, AlertTitle, LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { sendSelectedTicketData } from 'redux/features/ticketSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { useDeleteTicketMutation, useLazyGetAllTicketByAuthUserQuery } from 'redux/services/ticketApi';

const DeleteTicketForm = (props) => {
    const { setIsOpen, setselected } = props;
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useAppDispatch();

    const selectedTicketData = useAppSelector((state) => state?.ticket?.sendSelectedTicketData);

    const selectedEventData = useAppSelector((state) => state?.event?.sendSelectedEventData);

    const [trigger] = useLazyGetAllTicketByAuthUserQuery();

    const [
        deleteTicket,
        {
            isSuccess: isDeleteTicketSuccess,
            isError: isDeleteTicketError,
            error: deleteTicketErrorData,
            isLoading: isDeleteTicketLoading
        }
    ] = useDeleteTicketMutation();

    const [selectedTicketId, setselectedTicketId] = useState(null);
    const [selectedTicketName, setselectedTicketName] = useState('');
    const [selectedEventName, setselectedEventName] = useState('');
    const [deleteTicketErrorDataParsed, setdeleteTicketErrorDataParsed] = useState(null);

    useEffect(() => {
        if (selectedTicketData) {
            setselectedEventName(selectedTicketData[0]?.event?.name);
            setselectedTicketName(selectedTicketData[0]?.name);
            setselectedTicketId(selectedTicketData[0]?.id);
        }
    }, [selectedTicketData]);

    useEffect(() => {
        if (isDeleteTicketError && deleteTicketErrorData) {
            setdeleteTicketErrorDataParsed(deleteTicketErrorData?.data?.errors);
        }
    }, [isDeleteTicketError, deleteTicketErrorData]);

    useEffect(() => {
        //console.log(isDeleteTicketSuccess);
        if (isDeleteTicketSuccess) {
            setselected([]);
            dispatch(sendSelectedTicketData([]));
            setIsOpen(false);
            enqueueSnackbar('Delete ticket successfull!', { variant: 'success' });
        }
    }, [isDeleteTicketSuccess]);

    useEffect(() => {
        if (isDeleteTicketSuccess && selectedTicketId) {
            trigger();
            //TODO mutate ticket.event.seat dont get all tickets again
            /*  //console.log(isDeleteTicketSuccess);
            dispatch(
                ticketApi.util.updateQueryData('getAllTicketByAuthUser', undefined, (allTickets) => {
                  
                    return allTickets?.filter((el) => el.id !== selectedTicketId);
                })
            ); */
        }
    }, [isDeleteTicketSuccess, selectedTicketId]);

    return (
        <div>
            <Alert sx={{ mt: '16px' }} severity="info">
                {'Are you sure you want to delete ticket : ' + selectedTicketName + ' event : ' + selectedEventName} —
                check it out!
            </Alert>
            <LoadingButton
                loading={isDeleteTicketLoading}
                type="submit"
                variant="contained"
                sx={{
                    mt: '8px',
                    width: '100%',
                    marginInline: 'auto'
                }}
                onClick={() => {
                    deleteTicket({
                        ticketId: selectedTicketId,
                        eventId: selectedEventData[0]?.id
                    });
                }}
            >
                Delete
            </LoadingButton>
            {deleteTicketErrorDataParsed ? (
                <Alert sx={{ mt: '8px' }} severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {JSON.stringify(deleteTicketErrorDataParsed)}
                    <strong>check it out!</strong>
                </Alert>
            ) : null}{' '}
        </div>
    );
};

export default DeleteTicketForm;
