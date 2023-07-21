import { Box, Container, CssBaseline, Paper } from '@mui/material';
import AboutUs from 'components/AboutUs';
import ContactUs from 'components/ContactUs';
import Footer from 'components/Footer';
import Header from 'components/Header';
import Hero from 'components/Hero';
import Section from 'components/Sections';
import Testimonial from 'components/Testimonial';
import TopBar from 'components/TopBar';
import React from 'react';

const MainPage = () => {
    return (
        <>
            <CssBaseline />
            <TopBar styleProp={{ position: 'fixed', zIndex: '100' }} />
            <Hero />
            <Section />
            <AboutUs />
            <Testimonial />
            <ContactUs />
            <Footer />
        </>
    );
};

export default MainPage;
