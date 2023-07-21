import HotEvents from 'components/HotEvents';
import TopBar from 'components/TopBar';
import React from 'react';

const Dashboard = (props) => {
    return (
        <div>
            <TopBar isAuthenticated={props.isAuthenticated} />
            <HotEvents />
        </div>
    );
};

export default Dashboard;
