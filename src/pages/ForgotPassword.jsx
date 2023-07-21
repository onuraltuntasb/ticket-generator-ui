import { Container, Grid, Box, Typography, Stack, InputAdornment, IconButton, Alert, AlertTitle } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useForm, FormProvider } from 'react-hook-form';
import { object, string } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from 'components/mui-rhf/FormInput';
import { useNavigate } from 'react-router-dom';
import { useForgotPasswordMutation } from 'redux/services/authApi';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import TopBar from 'components/TopBar';
import Footer from 'components/Footer';

const ForgotPassword = (props) => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [forgotErrorData, setforgotErrorData] = useState(null);

    const [
        forgotPassword,
        {
            data: forgotData,
            isSuccess: isForgotSuccess,
            isError: isForgotError,
            error: forgotError,
            isLoading: isForgotLoading
        }
    ] = useForgotPasswordMutation();

    useEffect(() => {
        if (isForgotError && forgotErrorData) {
            setforgotErrorData(forgotErrorData?.data?.errors);
        }
    }, [isForgotError, forgotErrorData]);

    useEffect(() => {
        if (isForgotSuccess) {
            enqueueSnackbar('Forgot password link send successfully', { variant: 'success' });
        } else if (isForgotError) {
            enqueueSnackbar('Forgot password link send fail!', { variant: 'error' });
        }
    }, [isForgotSuccess, isForgotError]);

    const onSubmitHandler = (values) => {
        forgotPassword({
            email: values.email
        });
        //console.log(values);
    };

    const defaultValues = {
        email: ''
    };

    const loginSchema = object({
        email: string().min(1, 'Email is required').email('Email is invalid')
    });

    const methods = useForm({
        resolver: zodResolver(loginSchema),
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
                                                label="Enter your email"
                                                type="email"
                                                name="email"
                                                focused
                                                required
                                                sx={{ mb: '16px' }}
                                            />
                                            <LoadingButton
                                                loading={isForgotLoading}
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
                                            {isForgotError ? (
                                                <Alert sx={{ mt: '8px' }} severity="error">
                                                    <AlertTitle>Error</AlertTitle>
                                                    {JSON.stringify(forgotErrorData)}
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

export default ForgotPassword;
