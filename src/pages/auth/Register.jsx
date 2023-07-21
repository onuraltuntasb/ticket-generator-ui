import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterUserMutation } from '../../redux/services/authApi';
import { object, string } from 'zod';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from 'components/mui-rhf/FormInput';
import {
    Container,
    Grid,
    Box,
    Typography,
    Stack,
    Link as MuiLink,
    Alert,
    AlertTitle,
    InputAdornment,
    IconButton
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import Footer from 'components/Footer';
import TopBar from 'components/TopBar';
import { sendAuthUserData } from 'redux/features/authSlice';
import { useDispatch } from 'react-redux';

// ? Styled React Route Dom Link Component
export const LinkItem = styled(Link)`
    text-decoration: none;
    color: #3683dc;
    &:hover {
        text-decoration: underline;
        color: #5ea1b6;
    }
`;

// ? Styled Material UI Link Component
export const OauthMuiLink = styled(MuiLink)`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f5f6f7;
    border-radius: 1;
    padding: 0.6rem 0;
    column-gap: 1rem;
    text-decoration: none;
    color: #393e45;
    font-weight: 500;
    cursor: pointer;

    &:hover {
        background-color: #fff;
        box-shadow: 0 1px 13px 0 rgb(0 0 0 / 15%);
    }
`;

const Register = (props) => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();

    const [registerUserErrorData, setregisterUserErrorData] = useState(null);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setshowConfirmPassword] = useState(false);

    const signupSchema = object({
        name: string().min(8, 'Name is required').max(70),
        email: string().min(1, 'Email is required').email('Email is invalid'),
        password: string()
            .min(1, 'Password is required')
            .min(10, 'Password must be more than 8 characters')
            .max(32, 'Password must be less than 32 characters'),
        passwordConfirm: string().min(1, 'Please confirm your password')
    }).refine((data) => data.password === data.passwordConfirm, {
        path: ['passwordConfirm'],
        message: 'Passwords do not match'
    });

    const defaultValues = {
        name: '',
        email: '',
        password: '',
        passwordConfirm: ''
    };

    const methods = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues
    });

    const onSubmitHandler = (values) => {
        registerUser({
            email: values.email,
            name: values.name,
            password: values.password
        });
    };

    const [
        registerUser,
        {
            data: registerData,
            isSuccess: isRegisterSuccess,
            isError: isRegisterError,
            error: registerErrorData,
            isLoading: isRegisterLoading
        }
    ] = useRegisterUserMutation();

    useEffect(() => {
        if (isRegisterError && registerErrorData) {
            //console.log(registerErrorData);
            setregisterUserErrorData(registerErrorData?.data?.errors);
        }
    }, [isRegisterError, registerErrorData]);

    useEffect(() => {
        if (isRegisterSuccess) {
            //console.log('User login successfull!', registerData);
            enqueueSnackbar('User login successfull!', { variant: 'success' });
            localStorage.setItem('eg-auth-infos', registerData.email);
            dispatch(sendAuthUserData(registerData));
            navigate('/dashboard');
        } else if (isRegisterError) {
            //console.log('User register error!', registerData);
            enqueueSnackbar('User login error!', { variant: 'error' });
        }
    }, [isRegisterSuccess, isRegisterError]);

    return (
        <div>
            <TopBar isAuthenticated={props.isAuthenticated} />

            <Container
                maxWidth={false}
                sx={{
                    height: '83vh',
                    backgroundColor: { xs: '#fff', md: '#f4f4f4' }
                }}
            >
                <Grid container justifyContent="center" alignItems="center" sx={{ width: '100%', height: '100%' }}>
                    <Grid
                        item
                        sx={{
                            maxWidth: '70rem',
                            width: '100%',
                            backgroundColor: '#fff'
                        }}
                    >
                        <Grid
                            container
                            sx={{
                                boxShadow: { sm: '0 0 5px #ddd' },
                                py: '6rem',
                                px: '1rem',
                                borderRadius: '10px'
                            }}
                        >
                            <FormProvider {...methods}>
                                <Typography
                                    variant="h4"
                                    component="h1"
                                    sx={{
                                        textAlign: 'center',
                                        width: '100%',
                                        mb: '1.5rem',
                                        pb: { sm: '3rem' }
                                    }}
                                >
                                    Welcome To Event Generator App
                                </Typography>
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
                                                Create new account
                                            </Typography>
                                            <FormInput
                                                label="Name"
                                                type="text"
                                                name="name"
                                                focused
                                                required
                                                sx={{ mb: '16px' }}
                                            />
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
                                                sx={{ mb: '16px' }}
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
                                                                onClick={() => {
                                                                    setshowConfirmPassword((show) => !show);
                                                                }}
                                                                onMouseDown={(event) => {
                                                                    event.preventDefault();
                                                                }}
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
                                                loading={isRegisterLoading}
                                                type="submit"
                                                variant="contained"
                                                sx={{
                                                    mt: '8px',
                                                    width: '100%',
                                                    marginInline: 'auto'
                                                }}
                                            >
                                                Sign Up
                                            </LoadingButton>
                                            {registerUserErrorData ? (
                                                <Alert sx={{ mt: '8px' }} severity="error">
                                                    <AlertTitle>Error</AlertTitle>
                                                    {JSON.stringify(registerUserErrorData)} —{' '}
                                                    <strong>check it out!</strong>
                                                </Alert>
                                            ) : null}{' '}
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6} sx={{}}>
                                        <Typography
                                            variant="h6"
                                            component="p"
                                            sx={{
                                                paddingLeft: { sm: '3rem' },
                                                mb: '1.5rem',
                                                textAlign: 'center'
                                            }}
                                        >
                                            Sign up using another provider
                                        </Typography>
                                        <Box
                                            display="flex"
                                            flexDirection="column"
                                            sx={{ paddingLeft: { sm: '3rem' }, rowGap: '1rem' }}
                                        >
                                            <OauthMuiLink href="">
                                                {/* <GoogleLogo style={{ height: '2rem' }} /> */}
                                                Google
                                            </OauthMuiLink>
                                            <OauthMuiLink href="">
                                                {/* <GitHubLogo style={{ height: '2rem' }} /> */}
                                                GitHub
                                            </OauthMuiLink>
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Grid container justifyContent="center">
                                    <Stack sx={{ mt: '3rem', textAlign: 'center' }}>
                                        <Typography sx={{ fontSize: '0.9rem', mb: '1rem' }}>
                                            Already have an account? <LinkItem to="/login">Login</LinkItem>
                                        </Typography>
                                    </Stack>
                                </Grid>
                            </FormProvider>
                        </Grid>
                    </Grid>
                </Grid>
                <Footer />
            </Container>
        </div>
    );
};

export default Register;
