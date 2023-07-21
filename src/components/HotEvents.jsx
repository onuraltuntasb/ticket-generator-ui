import { useTheme } from '@emotion/react';
import { Check, Clear, MoreVert, Share } from '@mui/icons-material';

import {
    Avatar,
    Box,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Container,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Typography
} from '@mui/material';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useLazyGetAllEventQuery } from 'redux/services/eventApi';

const HotEvents = () => {
    const theme = useTheme();

    const [trigger, { data: eventListData }] = useLazyGetAllEventQuery();

    const [dateInterval, setdateInterval] = useState('Today');

    useEffect(() => {
        trigger();
    }, []);

    return (
        <div>
            <Container sx={{ mt: 2 }} maxWidth="xl">
                <Box sx={{ width: '100%' }}>
                    <Paper sx={{ width: '100%', mb: 2, p: 2 }} elevation={1}>
                        <Grid container justifyContent="center" spacing={2}>
                            <Grid item xs={10}>
                                <h3>Hot Events</h3>
                            </Grid>
                            <Grid item xs={2}>
                                <FormControl fullWidth>
                                    <InputLabel id="choose-interval-select-label">Choose Interval</InputLabel>
                                    <Select
                                        labelId="choose-interval-select-label"
                                        id="choose-interval-select"
                                        value={dateInterval}
                                        label="choose interval"
                                        onChange={(event) => {
                                            setdateInterval(event.target.value);
                                        }}
                                    >
                                        <MenuItem value={'Today'}>Today</MenuItem>
                                        <MenuItem value={'Week'}>Week</MenuItem>
                                        <MenuItem value={'Month'}>Month</MenuItem>
                                        <MenuItem value={'All'}>All</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid sx={{ flexGrow: 1 }} container spacing={2}>
                            <Grid item xs={12}>
                                <Grid container justifyContent="center" spacing={2}>
                                    {[0, 1, 2, 3].map((value) => (
                                        <Grid key={value} item>
                                            {eventListData &&
                                                eventListData.map((el) => (
                                                    <Card key={el?.id} sx={{ maxWidth: 345 }}>
                                                        <CardHeader
                                                            avatar={
                                                                <Avatar
                                                                    sx={{ bgcolor: theme.palette.primary.main }}
                                                                    aria-label="recipe"
                                                                >
                                                                    EG
                                                                </Avatar>
                                                            }
                                                            action={
                                                                <IconButton aria-label="settings">
                                                                    <MoreVert />
                                                                </IconButton>
                                                            }
                                                            title={el?.name}
                                                            subheader={
                                                                <div>
                                                                    {'Start : ' +
                                                                        new Date(el?.startDate).toLocaleString()}{' '}
                                                                    <br />
                                                                    {'End : ' + new Date(el?.endDate).toLocaleString()}
                                                                    <br />
                                                                    {'Ticket S : ' +
                                                                        new Date(el?.endDate).toLocaleString()}{' '}
                                                                    <br />
                                                                </div>
                                                            }
                                                        />
                                                        <CardMedia
                                                            component="img"
                                                            height="194"
                                                            image="https://mui.com/static/images/cards/paella.jpg"
                                                            alt="Event Image"
                                                        />
                                                        <CardContent>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Description : {el?.description}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Status :{' '}
                                                                {el?.status ? (
                                                                    <Check style={{ color: 'green' }} />
                                                                ) : (
                                                                    <Clear style={{ color: 'red' }} />
                                                                )}
                                                            </Typography>
                                                        </CardContent>

                                                        <CardActions>
                                                            <IconButton aria-label="share">
                                                                <Share />
                                                            </IconButton>
                                                        </CardActions>
                                                    </Card>
                                                ))}
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
            </Container>
        </div>
    );
};

export default HotEvents;
