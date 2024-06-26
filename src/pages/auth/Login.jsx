import { Container, Grid, Box, Typography, Stack, InputAdornment, IconButton, Alert, AlertTitle } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useForm, FormProvider } from 'react-hook-form';
import { object, string } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinkItem, OauthMuiLink } from './Register';
import FormInput from 'components/mui-rhf/FormInput';
import { useNavigate } from 'react-router-dom';
import { useLoginUserMutation } from 'redux/services/authApi';
import { useEffect, useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import TopBar from 'components/TopBar';
import Footer from 'components/Footer';
import { sendAuthUserData } from 'redux/features/authSlice';
import { useDispatch } from 'react-redux';

const Login = (props) => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();

    const [showPassword, setShowPassword] = useState(false);
    const [loginUserErrorData, setloginUserErrorData] = useState(null);

    const [
        loginUser,
        {
            data: loginData,
            isSuccess: isLoginSuccess,
            isError: isLoginError,
            error: loginErrorData,
            isLoading: isLoginLoading
        }
    ] = useLoginUserMutation();

    useEffect(() => {
        if (isLoginError && loginErrorData) {
            setloginUserErrorData(loginErrorData?.data?.errors);
        }
    }, [isLoginError, loginErrorData]);

    useEffect(() => {
        if (isLoginSuccess) {
            //console.log('User login successfull!', loginData);
            enqueueSnackbar('User login successfull!', { variant: 'success' });
            localStorage.setItem('eg-auth-infos', loginData.email);
            dispatch(sendAuthUserData(loginData));
            navigate('/dashboard');
        } else if (isLoginError) {
            //console.log('User login error!', JSON.stringify(loginErrorData));
            enqueueSnackbar('User login error!', { variant: 'error' });
        }
    }, [isLoginSuccess, isLoginError]);

    const onSubmitHandler = (values) => {
        loginUser({
            email: values.email,
            name: 'onur1234',
            password: values.password
        });
        //console.log(values);
    };

    const defaultValues = {
        email: '',
        password: ''
    };

    const loginSchema = object({
        email: string().min(1, 'Email is required').email('Email is invalid'),
        password: string()
            .min(1, 'Password is required')
            .min(10, 'Password must be more than 8 characters')
            .max(32, 'Password must be less than 32 characters')
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
                                    <Grid item xs={12} sm={6} sx={{ borderRight: { sm: '1px solid #ddd' } }}>
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
                                                Log into your account
                                            </Typography>
                                            <FormInput
                                                label="Enter your email"
                                                type="email"
                                                name="email"
                                                focused
                                                required
                                                sx={{ mb: '16px' }}
                                            />
                                            <FormInput
                                                label="Password"
                                                name="password"
                                                required
                                                focused
                                                type={showPassword ? 'text' : 'password'}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={() => {
                                                                    setShowPassword((show) => !show);
                                                                }}
                                                                onMouseDown={(event) => {
                                                                    event.preventDefault();
                                                                }}
                                                            >
                                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                            <LoadingButton
                                                loading={isLoginLoading}
                                                type="submit"
                                                variant="contained"
                                                sx={{
                                                    mt: '8px',
                                                    width: '100%',
                                                    marginInline: 'auto'
                                                }}
                                            >
                                                Login
                                            </LoadingButton>
                                            {loginUserErrorData ? (
                                                <Alert sx={{ mt: '8px' }} severity="error">
                                                    <AlertTitle>Error</AlertTitle>
                                                    {JSON.stringify(loginUserErrorData)}
                                                    <strong>check it out!</strong>
                                                </Alert>
                                            ) : null}{' '}
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography
                                            variant="h6"
                                            component="p"
                                            sx={{
                                                paddingLeft: { sm: '3rem' },
                                                mb: '1.5rem',
                                                textAlign: 'center'
                                            }}
                                        >
                                            Log in with another provider:
                                        </Typography>
                                        <Box
                                            display="flex"
                                            flexDirection="column"
                                            sx={{ paddingLeft: { sm: '3rem' }, rowGap: '1rem' }}
                                        >
                                            <OauthMuiLink href="">Google</OauthMuiLink>
                                            <OauthMuiLink href="">GitHub</OauthMuiLink>
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Grid container justifyContent="center">
                                    <Stack sx={{ mt: '3rem', textAlign: 'center' }}>
                                        <Typography sx={{ fontSize: '0.9rem', mb: '1rem' }}>
                                            Need an account? <LinkItem to="/register">Sign up here</LinkItem>
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.9rem' }}>
                                            Forgot your <LinkItem to="/forgotPassword">password?</LinkItem>
                                        </Typography>
                                    </Stack>
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

export default Login;
