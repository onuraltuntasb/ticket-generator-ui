import { zodResolver } from '@hookform/resolvers/zod';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Alert, AlertTitle, Box, Container, IconButton, InputAdornment, Paper } from '@mui/material';
import TopBar from 'components/TopBar';
import FormInput from 'components/mui-rhf/FormInput';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { object, string } from 'zod';
import { useUpdateUserMutation } from 'redux/services/userSettingsApi';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';

const UserSettings = (props) => {
    const { enqueueSnackbar } = useSnackbar();

    const [userEmail, setuserEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showOldpassword, setShowOldPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [userUpdateError, setUserUpdateError] = useState(null);

    const [updateUser, { isSuccess: isUserUpdateSuccess, isError: isUserUpdateError, error: userUpdateErrorData }] =
        useUpdateUserMutation();

    useEffect(() => {
        var item = localStorage.getItem('eg-auth-infos');
        if (item) {
            setuserEmail(item);
        }
    }, []);

    useEffect(() => {
        if (isUserUpdateError && userUpdateErrorData) {
            //console.log(userUpdateErrorData?.data?.errors);
            setUserUpdateError(userUpdateErrorData?.data?.errors);
        }
    }, [userUpdateErrorData, isUserUpdateError]);

    useEffect(() => {
        if (isUserUpdateSuccess) {
            //console.log('User update successfull!', userUpdateData);
            enqueueSnackbar('User update successfull!', { variant: 'success' });
        } else if (isUserUpdateError) {
            //console.log('User update error!', JSON.stringify(userUpdateErrorData));
            enqueueSnackbar('User update error!', { variant: 'error' });
        }
    }, [isUserUpdateSuccess, isUserUpdateError]);

    const onSubmitHandler = (values) => {
        updateUser({
            email: userEmail,
            name: 'onur1234',
            oldPassword: values.oldPassword,
            password: values.password
        });
        //console.log(values);
    };

    const userUpdateSchema = object({
        oldPassword: string()
            .min(1, 'Old password is required')
            .min(10, 'Old password must be more than 10 characters')
            .max(32, 'Old password must be less than 32 characters'),
        password: string()
            .min(1, 'Password is required')
            .min(10, 'Password must be more than 10 characters')
            .max(32, 'Password must be less than 32 characters'),
        passwordConfirm: string().min(1, 'Please confirm your password')
    }).refine((data) => data.password === data.passwordConfirm, {
        path: ['passwordConfirm'],
        message: 'Passwords do not match'
    });

    const defaultValues = {
        oldPassword: '',
        password: '',
        passwordConfirm: ''
    };

    const methods = useForm({
        resolver: zodResolver(userUpdateSchema),
        defaultValues
    });

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
                        onSubmit={methods.handleSubmit(onSubmitHandler)}
                    >
                        <FormProvider {...methods}>
                            <FormInput
                                label="Your email"
                                type="email"
                                name="email"
                                sx={{ mb: '16px' }}
                                InputProps={{
                                    readOnly: true
                                }}
                                value={userEmail}
                                focused
                            />

                            <FormInput
                                label="Old Password"
                                name="oldPassword"
                                required
                                focused
                                sx={{ mb: '16px' }}
                                type={showOldpassword ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowOldPassword(!showOldpassword)}
                                                onMouseDown={(event) => event.preventDefault}
                                            >
                                                {showOldpassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />

                            <FormInput
                                label="Password"
                                name="password"
                                required
                                focused
                                sx={{ mb: '16px' }}
                                type={showPassword ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword(!showPassword)}
                                                onMouseDown={(event) => event.preventDefault}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />

                            <FormInput
                                label="Confirm Password"
                                name="passwordConfirm"
                                required
                                focused
                                type={showConfirmPassword ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                onMouseDown={(event) => event.preventDefault}
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />

                            <LoadingButton
                                loading={false}
                                type="submit"
                                variant="contained"
                                sx={{
                                    mt: '8px',
                                    width: '100%',
                                    marginInline: 'auto'
                                }}
                            >
                                Update User
                            </LoadingButton>

                            {isUserUpdateError ? (
                                <Alert sx={{ mt: '8px' }} severity="error">
                                    <AlertTitle>Error</AlertTitle>
                                    {JSON.stringify(userUpdateError)} — <strong>check it out!</strong>
                                </Alert>
                            ) : null}
                        </FormProvider>
                    </Box>
                </Paper>
            </Container>
        </div>
    );
};

export default UserSettings;
