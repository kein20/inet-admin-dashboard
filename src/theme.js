import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#8b5cf6',
            light: '#a78bfa',
            dark: '#7c3aed',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#f43f5e',
        },
        background: {
            default: '#faf9f6',
            paper: '#ffffff',
        },
        text: {
            primary: '#333333',
            secondary: '#64748b',
        },
    },
    typography: {
        fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
        h5: { fontWeight: 700 },
        h6: { fontWeight: 600 },
        button: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '10px',
        },
    },
    shape: {
        borderRadius: 16,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(45deg, #8b5cf6 30%, #7c3aed 90%)',
                }
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #f0f0f0',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 700,
                    backgroundColor: '#f3f0ff',
                    color: '#7c3aed',
                    borderBottom: 'none',
                },
                body: {
                    borderBottom: '1px solid #f8f8f8',
                }
            },
        },
    },
});

export default theme;