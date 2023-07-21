import { useTheme } from '@emotion/react';
import TopBar from 'components/TopBar';
import React from 'react';

const NoMatch = () => {
    const theme = useTheme();

    return (
        <div>
            <TopBar />
            <div style={{ display: 'flex', 'justify-content': 'center' }}>
                <span style={{ fontSize: '128px', color: theme.palette.primary.main }}>¯\_(ツ)_/¯</span>
            </div>
            <div style={{ display: 'flex', 'justify-content': 'center' }}>
                <span style={{ fontSize: '24px' }}>Page is not in this server</span>
            </div>
        </div>
    );
};

export default NoMatch;
