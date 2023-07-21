import { Alert, AlertTitle, LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { sendSelectedEventData } from 'redux/features/eventSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { eventApi, useDeleteEventMutation } from 'redux/services/eventApi';

const DeleteEventForm = (props) => {
    const { setIsOpen, setSelected } = props;

    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useAppDispatch();

    const selectedEventData = useAppSelector((state) => state?.event?.sendSelectedEventData);

    const [
        deleteEvent,
        {
            isSuccess: isDeleteEventSuccess,
            isError: isDeleteEventError,
            error: deleteEventErrorData,
            isLoading: isDeleteEventLoading
        }
    ] = useDeleteEventMutation();

    const [selectedEventId, setselectedEventId] = useState(null);
    const [selectedEventName, setselectedEventName] = useState('');
    const [deleteEventErrorDataParsed, setdeleteEventErrorDataParsed] = useState(null);

    useEffect(() => {
        if (selectedEventData) {
            setselectedEventName(selectedEventData[0]?.name);
            setselectedEventId(selectedEventData[0]?.id);
        }
    }, [selectedEventData]);

    useEffect(() => {
        if (isDeleteEventError && deleteEventErrorData) {
            setdeleteEventErrorDataParsed(deleteEventErrorData?.data?.errors);
        }
    }, [isDeleteEventError, deleteEventErrorData]);

    useEffect(() => {
        if (isDeleteEventSuccess) {
            setIsOpen(false);
            enqueueSnackbar('Delete event successfull!', { variant: 'success' });
        }
    }, [isDeleteEventSuccess]);

    useEffect(() => {
        if (isDeleteEventSuccess && selectedEventId) {
            dispatch(sendSelectedEventData([]));
            setSelected([]);
            dispatch(
                eventApi.util.updateQueryData('getAllEventByAuthUser', undefined, (allEvents) => {
                    //console.log(allEvents);
                    //allEvents?.push(updateEventData)
                    return allEvents?.filter((el) => el.id !== selectedEventId);
                })
            );
        }
    }, [isDeleteEventSuccess, selectedEventId]);

    return (
        <div>
            <Alert sx={{ mt: '16px' }} severity="info">
                {'Are you sure you want to delete ' + selectedEventName} — check it out!
            </Alert>
            <LoadingButton
                loading={isDeleteEventLoading}
                type="submit"
                variant="contained"
                sx={{ mt: '8px', width: '100%', marginInline: 'auto' }}
                onClick={() => {
                    deleteEvent(selectedEventId);
                }}
            >
                Delete
            </LoadingButton>
            {deleteEventErrorDataParsed ? (
                <Alert sx={{ mt: '8px' }} severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {JSON.stringify(deleteEventErrorDataParsed)}
                    <strong>check it out!</strong>
                </Alert>
            ) : null}{' '}
        </div>
    );
};

export default DeleteEventForm;
