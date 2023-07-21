import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Alert, AlertTitle, Box, FormHelperText, IconButton, InputLabel, MenuItem, TextField } from '@mui/material';
import FormInput from 'components/mui-rhf/FormInput';
import FormInputAceEditor from 'components/mui-rhf/FormInputAceEditor';

import FormSelect from 'components/mui-rhf/FormSelect';
import FormSelectMultiple from 'components/mui-rhf/FormSelectMultiple';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { sendSelectedEventData } from 'redux/features/eventSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { useAddEventMutation, useUpdateEventMutation } from 'redux/services/eventApi';
import { useGetAllTagsQuery } from 'redux/services/tagApi';
import { any, object, string } from 'zod';
import { eventApi } from '../../redux/services/eventApi';
import { storage } from '../../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { AttachFile, CloudUpload, FullscreenExitOutlined, FullscreenOutlined } from '@mui/icons-material';
import { useTheme } from '@emotion/react';
import ModalBase from 'components/ModalBase';

const AddUpdateEventForm = (props) => {
    const { operationType, setIsOpen, setSelectedProp } = props;

    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();

    const selectedEventData = useAppSelector((state) => state?.event?.sendSelectedEventData);

    const [addEventErrorDataParsed, setaddEventErrorDataParsed] = useState(null);

    const [updateEventErrorDataParsed, setupdateEventErrorDataParsed] = useState(null);

    const [file, setFile] = useState('');
    const [percent, setPercent] = useState('0');
    const [showFullSizeToggle, setShowFullSizeToggle] = useState(false);
    const [seatingImageDownloadUrl, setseatingImageDownloadUrl] = useState(null);

    const addEventData = useAppSelector(
        (state) => Object.values(state?.eventApi?.mutations).filter((el) => el.endpointName === 'addEvent')[0]?.data
    );

    const updateEventData = useAppSelector(
        (state) => Object.values(state?.eventApi?.mutations).filter((el) => el.endpointName === 'updateEvent')[0]?.data
    );

    const { data: tagOptionsData, isError: tagOptionsIsError } = useGetAllTagsQuery();

    //rtk query mutation cash data update
    useEffect(() => {
        if (addEventData) {
            dispatch(sendSelectedEventData(updateEventData));
            setSelectedProp([]);
            dispatch(
                eventApi.util.updateQueryData('getAllEventByAuthUser', undefined, (allEvents) => {
                    return [...allEvents, addEventData];
                })
            );
        }
    }, [addEventData]);

    useEffect(() => {
        if (updateEventData) {
            dispatch(sendSelectedEventData(updateEventData));
            setSelectedProp([]);
            dispatch(
                eventApi.util.updateQueryData('getAllEventByAuthUser', undefined, (allEvents) => {
                    return allEvents?.map((el) => (el.id === updateEventData?.id ? { ...updateEventData } : el));
                })
            );
        }
    }, [updateEventData]);

    var defaultValues = {
        name: '',
        seats: '',
        seatingImageDownloadPath: '',
        description: '',
        startDate: '',
        endDate: '',
        ticketSellingStartDate: '',
        status: 'true',
        tags: []
    };

    useEffect(() => {
        if (tagOptionsIsError) {
            enqueueSnackbar('Getting tag options is failed!', { variant: 'error' });
        }
    }, [tagOptionsIsError]);

    //TODO ticketSellingStartDate must be at least 5 minutes before from startDate
    const addEventSchema = object({
        name: string().min(1, 'Required'),
        seats: string().min(1, 'Required'),
        description: string().min(1, 'Required'),
        startDate: string(),
        endDate: string(),
        ticketSellingStartDate: string(),
        tags: any(),
        status: string(),
        seatingImageDownloadPath: string().min(1, 'Required')
    })
        .refine((data) => data.endDate > data.startDate, {
            path: ['endDate'],
            message: 'End date must be after than startDate'
        })
        .refine((data) => dayjs(data.ticketSellingStartDate).add(5, 'minute').isBefore(dayjs(data.startDate)), {
            path: ['ticketSellingStartDate'],
            message: 'Ticket selling start date must be at least 5 minutes before than start date'
        });

    const methods = useForm({
        resolver: zodResolver(addEventSchema),
        defaultValues
    });

    useEffect(() => {
        if (operationType != null && operationType === 'edit') {
            const dayjsFormat = 'YYYY-MM-DDTHH:mm';
            if (selectedEventData) {
                methods.setValue('name', selectedEventData[0]?.name);
                methods.setValue('seats', JSON.stringify(selectedEventData[0]?.seats, null, '\t'));
                methods.setValue('description', selectedEventData[0]?.description);
                methods.setValue(
                    'startDate',
                    dayjs(new Date(selectedEventData[0]?.startDate).toString()).format(dayjsFormat)
                );
                methods.setValue(
                    'endDate',
                    dayjs(new Date(selectedEventData[0]?.endDate).toString()).format(dayjsFormat)
                );
                methods.setValue(
                    'ticketSellingStartDate',
                    dayjs(new Date(selectedEventData[0]?.ticketSellingStartDate).toString()).format(dayjsFormat)
                );

                methods.setValue('status', selectedEventData[0]?.status ? 'true' : 'false');
                methods.setValue('tags', selectedEventData[0]?.tags);
                methods.setValue('seatingImageDownloadPath', selectedEventData[0]?.seatingImageReference);
                setseatingImageDownloadUrl(selectedEventData[0]?.seatingImageReference);
            }
        }
    }, [operationType, selectedEventData]);

    const onSubmitHandler = (values) => {
        //console.log(values);

        const dayjsFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZ';

        const startDate = dayjs(values.startDate).format(dayjsFormat);
        const endDate = dayjs(values.endDate).format(dayjsFormat);
        const ticketSellingStartDate = dayjs(values.ticketSellingStartDate).format(dayjsFormat);

        const sendEventObj = {
            name: values.name,
            description: values.description,
            seats: JSON.parse(values.seats.replace(/\\/g, '\\\\')),
            startDate: startDate,
            endDate: endDate,
            ticketSellingStartDate: ticketSellingStartDate,
            status: values.status === 'true' ? true : false,
            tags: values.tags,
            seatingImageReference: values.seatingImageDownloadPath
        };

        if (operationType === 'edit') {
            //console.log(selectedEventData[0]?.id);

            updateEvent({ eventId: selectedEventData[0]?.id, ...sendEventObj });
        } else if (operationType === 'add') {
            addEvent({
                eventId: selectedEventData[0]?.id,
                ...sendEventObj
            });
        }
    };

    const [
        addEvent,
        {
            isSuccess: isAddEventSuccess,
            isError: isAddEventError,
            error: addEventErrorData,
            isLoading: isAddEventLoading
        }
    ] = useAddEventMutation();
    const [
        updateEvent,
        {
            isSuccess: isUpdateEventSuccess,
            isError: isUpdateEventError,
            error: updateEventErrorData,
            isLoading: isUpdateEventLoading
        }
    ] = useUpdateEventMutation();

    useEffect(() => {
        if (operationType != null && operationType === 'add') {
            if (isAddEventSuccess) {
                setIsOpen(false);
                enqueueSnackbar('Event add successfull!', { variant: 'success' });
            } else if (isAddEventError) {
                enqueueSnackbar('Event add error!', { variant: 'error' });
            }
        } else if (operationType != null && operationType === 'edit') {
            if (isUpdateEventSuccess) {
                setIsOpen(false);
                enqueueSnackbar('Event update successfull!', { variant: 'success' });
            } else if (isUpdateEventError) {
                enqueueSnackbar('Event update error!', { variant: 'error' });
            }
        }
    }, [isAddEventSuccess, isAddEventError, isUpdateEventSuccess, isUpdateEventError, operationType]);

    useEffect(() => {
        if (isAddEventError && addEventErrorData) {
            //console.log(JSON.stringify(addEventErrorData?.data['errors'][0]));
            setaddEventErrorDataParsed(addEventErrorData?.data['errors']);
        }
    }, [isAddEventError, addEventErrorData]);

    useEffect(() => {
        if (isUpdateEventError && updateEventErrorData) {
            setupdateEventErrorDataParsed(updateEventErrorData);
        }
    }, [isUpdateEventError, updateEventErrorData]);

    const renderErrorAlert = () => {
        if (operationType === 'edit' && updateEventErrorData) {
            return (
                <>
                    <Alert sx={{ mt: '8px' }} severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {JSON.stringify(updateEventErrorDataParsed)} — <strong>check it out!</strong>
                    </Alert>
                </>
            );
        } else if (operationType === 'add' && addEventErrorData) {
            return (
                <>
                    <Alert sx={{ mt: '8px' }} severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {JSON.stringify(addEventErrorDataParsed)} — — <strong>check it out!</strong>
                    </Alert>
                </>
            );
        }
    };

    const handleUpload = () => {
        if (!file) {
            alert('Please upload an image first!');
        }

        if (file.size > 1048576) {
            methods.setError('seatingImageDownloadPath', 'image size is bigger than 1mb');
        } else {
            const storageRef = ref(storage, `/eventSeating/${methods.getValues('name')}`);

            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

                    setPercent(percent);
                },
                (err) => {
                    enqueueSnackbar('Upload Image Error!', { variant: 'error' });
                    //console.log(err);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                        methods.setValue('seatingImageDownloadPath', url);
                        //console.log(url);
                    });
                }
            );
        }
    };

    return (
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
                    label="Enter event name"
                    type="text"
                    name="name"
                    focused
                    required
                    sx={{ mb: '8px', mt: '16px' }}
                />

                {seatingImageDownloadUrl !== '' ? (
                    <div style={{ position: 'relative' }}>
                        <Box
                            component="img"
                            src={seatingImageDownloadUrl}
                            alt={'eventSeating'}
                            sx={{ height: '100px', weight: 'auto' }}
                        />
                        <IconButton
                            variant="contained"
                            onClick={() => setShowFullSizeToggle(!showFullSizeToggle)}
                            sx={{ position: 'absolute', top: 0, left: 0, zIndex: 2000 }}
                        >
                            {showFullSizeToggle ? (
                                <FullscreenExitOutlined style={{ color: theme.palette.primary.main }} />
                            ) : (
                                <FullscreenOutlined style={{ color: theme.palette.primary.main }} />
                            )}
                        </IconButton>
                    </div>
                ) : null}

                <InputLabel
                    sx={{ mt: '8px', mb: '8px', color: theme.palette.primary.main }}
                    htmlFor="seats"
                    variant="standard"
                >
                    Upload Event Seating Image
                </InputLabel>

                <TextField
                    focused={true}
                    variant="outlined"
                    type="text"
                    value={methods.getValues('name') !== '' ? methods.getValues('name') : ''}
                    InputProps={{
                        endAdornment: (
                            <>
                                <span>{percent}% </span>
                                <IconButton component="label">
                                    <AttachFile />
                                    <input
                                        readOnly={true}
                                        style={{
                                            border: `2px solid ${theme.palette.primary.main} `,
                                            borderRadius: '10px'
                                        }}
                                        type="file"
                                        hidden
                                        accept="/image/*"
                                        onChange={(event) => {
                                            setPercent(0);
                                            setFile(event.target.files[0]);
                                        }}
                                    />
                                </IconButton>
                                <LoadingButton
                                    disabled={file ? false : true}
                                    loading={percent !== '100' && percent !== '0' ? true : false}
                                    onClick={handleUpload}
                                    variant="contained"
                                >
                                    <CloudUpload />
                                </LoadingButton>
                            </>
                        )
                    }}
                />

                {methods?.formState?.errors?.seatingImageDownloadPath?.message ? (
                    <FormHelperText sx={{ color: 'red' }} id="event-seating-upload-helper-id">
                        {methods?.formState?.errors?.seatingImageDownloadPath.message}
                    </FormHelperText>
                ) : null}

                <FormInputAceEditor
                    label="Enter seats"
                    type="text"
                    name="seats"
                    multiline
                    rows={4}
                    focused
                    required
                    sx={{ mb: '16px', mt: '8px' }}
                />
                <Alert sx={{ mt: '8px', p: '4px' }} severity="info">
                    Please use list of objects (Json) seperated values to enter seats, for example :
                    {`[{"name":"a1","isReserved":false}]`}
                </Alert>
                <FormInput
                    label="Enter description"
                    type="text"
                    name="description"
                    focused
                    required
                    sx={{ mb: '16px', mt: '16px' }}
                />
                <FormInput
                    label="Enter start date"
                    type="datetime-local"
                    name="startDate"
                    focused
                    required
                    sx={{ mb: '16px', mt: '8px' }}
                />
                <FormInput
                    label="Enter end date"
                    type="datetime-local"
                    name="endDate"
                    focused
                    required
                    sx={{ mb: '16px', mt: '8px' }}
                />
                <FormInput
                    label="Enter ticket selling start date"
                    type="datetime-local"
                    name="ticketSellingStartDate"
                    focused
                    required
                    sx={{ mb: '8px', mt: '8px' }}
                />
                <FormSelect
                    id="status"
                    name="status"
                    label="Enter status"
                    variant="outlined"
                    control={methods.control}
                    margin="normal"
                    focused={true}
                    sx={{ mb: '8px', mt: '16px' }}
                >
                    <MenuItem value="true">true</MenuItem>
                    <MenuItem value="false">false</MenuItem>
                </FormSelect>
                <FormSelectMultiple
                    id="tag"
                    name="tags"
                    label="Enter tags"
                    control={methods.control}
                    variant="outlined"
                    margin="normal"
                    focused={true}
                    sx={{ mb: '8px', mt: '8px' }}
                    items={tagOptionsData}
                >
                    {tagOptionsData
                        ? tagOptionsData.map((e) => (
                              <MenuItem key={e.id} value={e.id}>
                                  {e.name}
                              </MenuItem>
                          ))
                        : null}
                </FormSelectMultiple>
                <LoadingButton
                    loading={operationType === 'edit' ? isUpdateEventLoading : isAddEventLoading}
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
                            src={methods.getValues('seatingImageDownloadPath')}
                            alt={'eventSeating'}
                            sx={{ height: 'auto', width: 'auto' }}
                        />
                    }
                />
            </Box>
        </FormProvider>
    );
};

export default AddUpdateEventForm;
