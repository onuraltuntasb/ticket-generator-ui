import { Container, Grid, Box, Typography, Stack, InputAdornment, IconButton, Alert, AlertTitle } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useForm, FormProvider } from 'react-hook-form';
import { object, string } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from 'components/mui-rhf/FormInput';
import { useNavigate } from 'react-router-dom';
import { useResetPasswordMutation } from 'redux/services/authApi';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import TopBar from 'components/TopBar';
import Footer from 'components/Footer';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const PasswordReset = (props) => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [resetPasswordErrorData, setresetPasswordErrorData] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [
        resetPassword,
        {
            isSuccess: isResetPasswordSuccess,
            isError: isResetPasswordError,
            error: resetPasswordError,
            isLoading: isResetPasswordLoading
        }
    ] = useResetPasswordMutation();

    useEffect(() => {
        if (isResetPasswordError && resetPasswordError) {
            setresetPasswordErrorData(resetPasswordError?.data?.errors);
        }
    }, [isResetPasswordError, resetPasswordError]);

    useEffect(() => {
        if (isResetPasswordSuccess) {
            navigate('/login');
            enqueueSnackbar('Password reset successfully', { variant: 'success' });
        } else if (isResetPasswordError) {
            enqueueSnackbar('Password reset fail', { variant: 'error' });
        }
    }, [isResetPasswordSuccess, isResetPasswordError]);

    const onSubmitHandler = (values) => {
        const queryString = window.location.href;
        var output = queryString.split('/');
        var token = output[output.length - 1];

        console.log('bastım');

        resetPassword({
            token: token,
            newPassword: values.newPassword,
            confirmNewPassword: values.confirmNewPassword
        });
        //console.log(values);
    };

    const defaultValues = {
        token: '',
        newPassword: '',
        confirmNewPassword: ''
    };

    const resetPasswordSchema = object({
        newPassword: string()
            .min(1, 'newPassword is required')
            .min(10, 'newPassword must be more than 10 characters')
            .max(32, 'newPassword must be less than 32 characters'),
        confirmNewPassword: string()
            .min(1, 'Please confirm your password')
            .min(10, 'newPassword must be more than 10 characters')
            .max(32, 'newPassword must be less than 32 characters')
    }).refine((data) => data.password === data.passwordConfirm, {
        path: ['confirmNewPassword'],
        message: 'Confirm new password do not match'
    });

    const methods = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues
    });

    return (
        <div>
            <TopBar isAuthenticated={props.isAuthenticated} />
            <Container maxWidth={false} sx={{ height: '83vh', backgroundColor: { xs: '#fff', md: '#f4f4f4' } }}>
                <Grid container justifyContent="center" alignItems="center" sx={{ width: '100%', height: '100%' }}>
                    <Grid item sx={{ maxWidth: '70rem', width: '100%', backgroundColor: '#fff' }}>
                        <FormProvider {...methods}>
                            <Grid
                                container
                                sx={{
                                    boxShadow: { sm: '0 0 5px #ddd' },
                                    py: '6rem',
                                    px: '1rem'
                                }}
                            >
                                <Grid
                                    item
                                    container
                                    justifyContent="space-between"
                                    rowSpacing={5}
                                    sx={{
                                        maxWidth: { sm: '45rem' },
                                        marginInline: 'auto'
                                    }}
                                >
                                    <Grid item xs={12}>
                                        <Box
                                            display="flex"
                                            flexDirection="column"
                                            component="form"
                                            noValidate
                                            autoComplete="off"
                                            sx={{ paddingRight: { sm: '3rem' } }}
                                            onSubmit={methods.handleSubmit(onSubmitHandler)}
                                        >
                                            <Typography
                                                variant="h6"
                                                component="h1"
                                                sx={{ textAlign: 'center', mb: '1.5rem' }}
                                            >
                                                Password Reset
                                            </Typography>
                                            <FormInput
                                                label="New Password"
                                                name="newPassword"
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
                                                name="confirmNewPassword"
                                                required
                                                focused
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={() =>
                                                                    setShowConfirmPassword(!showConfirmPassword)
                                                                }
                                                                onMouseDown={(event) => event.preventDefault}
                                                            >
                                                                {showConfirmPassword ? (
                                                                    <VisibilityOff />
                                                                ) : (
                                                                    <Visibility />
                                                                )}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                            <LoadingButton
                                                loading={isResetPasswordLoading}
                                                type="submit"
                                                variant="contained"
                                                sx={{
                                                    mt: '8px',
                                                    width: '100%',
                                                    marginInline: 'auto'
                                                }}
                                            >
                                                Reset password
                                            </LoadingButton>
                                            {isResetPasswordError ? (
                                                <Alert sx={{ mt: '8px' }} severity="error">
                                                    <AlertTitle>Error</AlertTitle>
                                                    {JSON.stringify(resetPasswordErrorData)}
                                                    <strong>check it out!</strong>
                                                </Alert>
                                            ) : null}{' '}
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Box
                                            display="flex"
                                            flexDirection="column"
                                            sx={{ paddingLeft: { sm: '3rem' }, rowGap: '1rem' }}
                                        ></Box>
                                    </Grid>
                                </Grid>
                                <Grid container justifyContent="center">
                                    <Stack sx={{ mt: '3rem', textAlign: 'center' }}></Stack>
                                </Grid>
                            </Grid>
                        </FormProvider>
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </div>
    );
};

export default PasswordReset;
