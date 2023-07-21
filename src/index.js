import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './root/App.jsx';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './root/App.css';

import { setupStore } from './redux/store.js';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material';
import { SnackbarProvider } from 'notistack';

const root = ReactDOM.createRoot(document.getElementById('root'));

const theme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#f5f5f5'
        },

        primary: {
            main: '#ab47bc'
        },
        secondary: {
            main: '#ff9800'
        }
    },

    components: {
        MuiButtonBase: {
            defaultProps: {
                disableRipple: true
            }
        },

        MuiButton: {
            defaultProps: {
                size: 'small'
            }
        },
        MuiButtonGroup: {
            defaultProps: {
                size: 'small'
            }
        },
        MuiCheckbox: {
            defaultProps: {
                size: 'small'
            }
        },

        MuiFormControl: {
            defaultProps: {
                size: 'small'
            }
        },

        MuiIconButton: {
            defaultProps: {
                size: 'small'
            }
        },

        MuiInputBase: {
            defaultProps: {
                margin: 'dense'
            }
        },

        MuiInputLabel: {
            defaultProps: {
                margin: 'dense'
            }
        },
        MuiRadio: {
            defaultProps: {
                size: 'small'
            }
        },

        MuiSwitch: {
            defaultProps: {
                size: 'small'
            }
        },

        MuiTextField: {
            defaultProps: {
                size: 'small'
            }
        },

        MuiList: {
            styleOverrides: {
                dense: true
            }
        },

        MuiMenuItem: {
            styleOverrides: {
                dense: true
            }
        },
        MuiTable: {
            defaultProps: {
                size: 'small'
            }
        },

        MuiTooltip: {
            styleOverrides: {
                arrow: true
            }
        }
    },

    typography: {
        fontFamily: 'Open Sans',
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontSize: 14,
        htmlFontSize: 16
    },
    shape: {
        borderRadius: 10
    },
    spacing: 8
});

//TODO uncomment react strict mode tag when code goes to production

root.render(
    //<React.StrictMode>
    <Provider store={setupStore}>
        <BrowserRouter>
            <CssBaseline>
                <ThemeProvider theme={theme}>
                    <SnackbarProvider>
                        <App />
                    </SnackbarProvider>
                </ThemeProvider>
            </CssBaseline>
        </BrowserRouter>
    </Provider>
    //</React.StrictMode>
);
