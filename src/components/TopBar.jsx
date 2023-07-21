import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { AccountCircleOutlined, Celebration, EventSeat, HowToRegRounded, LoginRounded } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useSnackbar } from 'notistack';
import { Tooltip } from '@mui/material';
import { useAppSelector } from 'redux/hooks';
import { sendAuthUserData } from 'redux/features/authSlice';
import { useDispatch } from 'react-redux';

/* const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto'
    }
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch'
        }
    }
})); */

export default function TopBar(props) {
    const { styleProp } = props;

    const dispatch = useDispatch();

    const authUserData = useAppSelector((state) => state?.auth?.sendAuthUserData);

    const theme = useTheme();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };
    const { enqueueSnackbar } = useSnackbar();
    async function fetchLogout() {
        try {
            let response = await fetch('/api/user/logout');
            if (response.status === 200) {
                let data = await response.text();
                if (data === 'true') {
                    dispatch(sendAuthUserData(null));
                    navigate('/login');
                    enqueueSnackbar('Log out successfull!', { variant: 'success' });
                    localStorage.removeItem('eg-auth-infos');
                }
            }
        } catch (error) {
            enqueueSnackbar('Log out error!', { variant: 'error' });
            //console.log(error);
        }
    }

    const handleLogout = () => {
        fetchLogout();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem
                onClick={() => {
                    handleMenuClose();
                    navigate('/user-settings');
                }}
            >
                My account
            </MenuItem>
            <MenuItem onClick={handleLogout}>Log out</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="error">
                        <MailIcon />
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem>
                <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
                    <Badge badgeContent={17} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List
                sx={{
                    // selected and (selected + hover) states
                    '&& .Mui-selected, && .Mui-selected:hover': {
                        bgcolor: theme.palette.primary.main,
                        '&, & .MuiListItemIcon-root': {
                            color: '#fffc'
                        }
                    },
                    // hover states
                    '& .MuiListItemButton-root:hover': {
                        bgcolor: theme.palette.primary.main,
                        '&, & .MuiListItemIcon-root': {
                            color: '#fffc'
                        }
                    }
                }}
            >
                <ListItem style={{ color: '#fffc' }} onClick={() => navigate('/')} key={'MenuToggle'} disablePadding>
                    <ListItemButton>
                        <ListItemIcon style={{ color: '#fffc' }}>
                            <MenuIcon
                                onClick={() => {
                                    toggleDrawer('top', false);
                                }}
                            />
                        </ListItemIcon>
                        <ListItemText primary={'Event Generator'} />
                    </ListItemButton>
                </ListItem>

                <ListItem
                    style={{ color: '#fffc' }}
                    onClick={() => navigate('/user-events')}
                    key={'UserEvents'}
                    disablePadding
                >
                    <ListItemButton>
                        <ListItemIcon style={{ color: '#fffc' }}>
                            <Celebration />
                        </ListItemIcon>
                        <ListItemText primary={'User Events'} />
                        <ListItemIcon style={{ color: '#fffc' }}>
                            <AccountCircleOutlined />
                        </ListItemIcon>
                    </ListItemButton>
                </ListItem>

                <ListItem onClick={() => navigate('/events')} key={'Events'} disablePadding>
                    <ListItemButton>
                        <ListItemIcon style={{ color: '#fffc' }}>
                            <Celebration />
                        </ListItemIcon>
                        <ListItemText primary={'Events'} />
                    </ListItemButton>
                </ListItem>

                {/*  <ListItem key={'Tickets'} disablePadding>
                    <ListItemButton>
                        <ListItemIcon style={{ color: '#fffc' }}>
                            <EventSeat />
                        </ListItemIcon>
                        <ListItemText primary={'Tickets'} />
                    </ListItemButton>
                </ListItem> */}

                <ListItem onClick={() => navigate('/user-tickets')} key={'UserTickets'} disablePadding>
                    <ListItemButton>
                        <ListItemIcon style={{ color: '#fffc' }}>
                            <EventSeat />
                        </ListItemIcon>
                        <ListItemText primary={'User Tickets'} />
                        <ListItemIcon style={{ color: '#fffc' }}>
                            <AccountCircleOutlined />
                        </ListItemIcon>
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
        </Box>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar style={styleProp} position="static">
                <Toolbar>
                    {
                        <IconButton
                            onClick={toggleDrawer('left', true)}
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    }

                    <Drawer
                        PaperProps={{
                            sx: {
                                backgroundColor: '#55235E',
                                color: '#fffc'
                            }
                        }}
                        anchor={'left'}
                        open={state['left']}
                        onClose={toggleDrawer('left', false)}
                    >
                        {list('left')}
                    </Drawer>

                    <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
                        Event Generator
                    </Typography>

                    {/*   {authUserData?.isAuth ? (
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
                        </Search>
                    ) : null} */}
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        {authUserData?.isAuth ? (
                            <>
                                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                                    <Badge badgeContent={4} color="error">
                                        <MailIcon />
                                    </Badge>
                                </IconButton>
                                <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
                                    <Badge badgeContent={17} color="error">
                                        <NotificationsIcon />
                                    </Badge>
                                </IconButton>
                                <IconButton
                                    size="large"
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-controls={menuId}
                                    aria-haspopup="true"
                                    onClick={handleProfileMenuOpen}
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton>
                            </>
                        ) : (
                            <div>
                                <Tooltip title="register">
                                    <IconButton
                                        component={Link}
                                        to="/register"
                                        size="large"
                                        aria-label="sign in"
                                        color="inherit"
                                    >
                                        <HowToRegRounded />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="login">
                                    <IconButton
                                        component={Link}
                                        to="/login"
                                        size="large"
                                        aria-label="login in"
                                        color="inherit"
                                    >
                                        <LoginRounded />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        )}
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </Box>
    );
}
