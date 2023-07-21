import React, { useState } from 'react';
import { Box, Typography, TextField, TextareaAutosize, Button, Card } from '@mui/material';

const ContactUs = () => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const submitForm = (e) => {
        e.preventDefault();
        //console.log({ email, firstName, subject, message });
    };

    return (
        <Box className={'mformContainer'}>
            <Card style={{ padding: '16px' }}>
                <Typography variant="h4" className={'mformHeading'}>
                    Contact Us
                </Typography>
                <Box className={'mform'} component="form" noValidate autoComplete="off">
                    <TextField
                        label="Full Name"
                        variant="outlined"
                        fullWidth
                        className={'minputField'}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />

                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        className={'minputField'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <TextField
                        label="Subject"
                        variant="outlined"
                        fullWidth
                        className={'minputField'}
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />

                    <TextareaAutosize
                        aria-label="minimum height"
                        minRows={6}
                        placeholder="Enter a message"
                        className={'mtextArea'}
                        spellCheck
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    <Button
                        variant="contained"
                        type="submit"
                        color="primary"
                        sx={{ width: '200px', fontSize: '16px' }}
                        onClick={submitForm}
                    >
                        Submit
                    </Button>
                </Box>
            </Card>
        </Box>
    );
};

export default ContactUs;
