import React, { useEffect, useState } from 'react';
import LoadingToRedirect from './LoginToRedirect';
import { sendAuthUserData } from 'redux/features/authSlice';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';

const PrivateRoute = (props) => {
    const { children, notRedirect } = props;

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const [isTokenValid, setisTokenValid] = useState(false);

    async function fetchText() {
        try {
            let response = await fetch('/api/user/check');
            if (response.status === 200) {
                const result = await response.json();
                dispatch(sendAuthUserData(result));
                setisTokenValid(true);
            }
        } catch (error) {
            dispatch(sendAuthUserData(null));
            enqueueSnackbar('Authentication failed!', { variant: 'error' });
            //console.log(error);
        }
    }

    useEffect(() => {
        fetchText();
    }, []);

    const childrenWithProps = React.Children.map(children, (child) =>
        React.cloneElement(child, {
            isAuthenticated: isTokenValid
        })
    );

    const renderReturn = () => {
        if (isTokenValid) {
            return childrenWithProps;
        } else {
            if (notRedirect) {
                return childrenWithProps;
            } else {
                return <LoadingToRedirect />;
            }
        }
    };

    return renderReturn();
};

export default PrivateRoute;
