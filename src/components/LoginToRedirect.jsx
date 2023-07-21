import { useTheme } from '@emotion/react';
import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoadingToRedirect = () => {
    const [count, setCount] = useState(5);
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((currentCount) => currentCount - 1);
        }, 1000);

        count === 0 && navigate('/login');

        return () => clearInterval(interval);
    }, [count, navigate]);

    return (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
            <CircularProgress size={150} style={{ color: theme.palette.primary.main }} />
        </div>
    );
};

export default LoadingToRedirect;
