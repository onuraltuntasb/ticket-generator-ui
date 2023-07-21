import React from 'react';
import { Grid, Typography, Button, Box } from '@mui/material';
import myteam from '../images/myteam.jpg';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from 'redux/hooks';
import { useSnackbar } from 'notistack';

const Hero = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const authUserData = useAppSelector((state) => state?.auth?.sendAuthUserData);

    return (
        <Box className="mheroBox">
            <Grid container spacing={6} className="mgridContainer">
                <Grid item xs={12} md={7}>
                    <Typography variant="h3" fontWeight={700} className="mtitle">
                        Let's create your first event
                    </Typography>
                    <Typography variant="h6" className="msubtitle">
                        We can help you to create your events then everyone reach event details and buy a ticket for
                        spesific event. No headache, seamless integration.
                    </Typography>
                    {/* isAuth slice  */}
                    <Button
                        onClick={() => {
                            if (!authUserData?.isAuth) {
                                navigate('/login');
                                enqueueSnackbar('Please first login.', { variant: 'success' });
                            } else {
                                navigate('/events');
                            }
                        }}
                        variant="contained"
                        color="primary"
                        sx={{ width: '200px', fontSize: '16px' }}
                    >
                        Create event
                    </Button>
                </Grid>
                <Grid item xs={12} md={5}>
                    <img src={myteam} alt="My Team" className="mlargeImage" />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Hero;
