import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
    return (
        <Box sx={{ flexGrow: 1 }} className={'mfooterContainer'}>
            <Typography className={'mfooterText'}>
                Provided by{' '}
                <Link href="" target="_blank" underline="none">
                    Ticket Generator
                </Link>
            </Typography>
        </Box>
    );
};

export default Footer;
