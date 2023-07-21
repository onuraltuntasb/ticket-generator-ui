import * as React from 'react';
import PropTypes from 'prop-types';
import { Box, styled } from '@mui/system';
import Modal from '@mui/base/Modal';
import Fade from '@mui/material/Fade';
import { useEffect } from 'react';
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

export default function ModalBase(props) {
    let { isOpen, setIsOpen, modalHeader, childComp, modalTop, modalWidth, modalHeight } = props;

    var style = (theme) => ({
        position: 'absolute',
        top: modalTop,
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: modalWidth ? modalWidth : 400,
        height: modalHeight ? modalHeight : 'auto',
        borderRadius: '12px',
        padding: '16px 32px 24px 32px',
        backgroundColor: theme.palette.mode === 'dark' ? '#0A1929' : 'white',
        boxShadow: `0px 2px 24px ${theme.palette.mode === 'dark' ? '#000' : '#383838'}`,
        maxHeight: '80vh',
        overflowY: 'scroll'
    });

    const [open, setOpen] = React.useState(false);
    const handleClose = (event, reason) => {
        if (reason && reason === 'backdropClick' && 'escapeKeyDown') return;
        setOpen(false);
        setIsOpen(false);
    };

    useEffect(() => {
        if (isOpen !== null && isOpen !== undefined) {
            setOpen(isOpen);
        }
    }, [isOpen]);

    return (
        <div>
            <StyledModal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                disableScrollLock={false}
                slots={{ backdrop: StyledBackdrop }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        {modalHeader ? (
                            <span style={{ marginTop: 16, fontSize: '20px' }} id="transition-modal-title">
                                {modalHeader}
                            </span>
                        ) : null}

                        <IconButton onClick={() => setIsOpen(false)} sx={{ position: 'absolute', top: 0, right: 0 }}>
                            <Close />
                        </IconButton>

                        {childComp}
                    </Box>
                </Fade>
            </StyledModal>
        </div>
    );
}

const Backdrop = React.forwardRef((props, ref) => {
    const { open, ...other } = props;
    return (
        <Fade in={open}>
            <div ref={ref} {...other} />
        </Fade>
    );
});

Backdrop.propTypes = {
    open: PropTypes.bool
};

const StyledModal = styled(Modal)`
    position: fixed;
    z-index: 1300;
    inset: 0;
    display: block;
    align-items: center;
    justify-content: center;
`;

const StyledBackdrop = styled(Backdrop)`
    z-index: -1;
    position: fixed;
    inset: 0;
    background-color: rgb(0 0 0 / 0.5);
    -webkit-tap-highlight-color: transparent;
`;
