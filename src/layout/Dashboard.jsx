import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Button, Container, Avatar, IconButton, Tooltip } from '@mui/material';
import { Router, People, ReceiptLong, Logout } from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/Auth';
import ConfirmDialog from '../components/Confirm'; 

const DashboardLayout = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [logoutOpen, setLogoutOpen] = useState(false);
    const isActive = (path) => location.pathname === path;

    const handleConfirmLogout = () => {
        logout();
        setLogoutOpen(false);
        navigate('/login');
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppBar position="sticky" color="inherit" elevation={0} sx={{
                borderBottom: '1px solid #eee',
                bgcolor: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(10px)'
            }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 5 }}>
                            <Box sx={{
                                p: 0.8,
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                                borderRadius: '12px',
                                mr: 1.5,
                                display: 'flex',
                                boxShadow: '0 4px 10px rgba(139, 92, 246, 0.3)'
                            }}>
                                <Router sx={{ color: 'white', fontSize: 20 }} />
                            </Box>
                            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 800, letterSpacing: '-0.5px' }}>
                                Telco<span style={{ color: '#8b5cf6' }}>Admin</span>
                            </Typography>
                        </Box>

                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1.5 }}>
                            <Button
                                onClick={() => navigate('/customer')} startIcon={<People />}
                                sx={{
                                    px: 2.5,
                                    color: isActive('/customer') ? 'primary.main' : 'text.secondary',
                                    bgcolor: isActive('/customer') ? 'rgba(139, 92, 246, 0.08)' : 'transparent',
                                    fontWeight: isActive('/customer') ? 700 : 500
                                }}
                            >
                                Customers
                            </Button>
                            <Button
                                onClick={() => navigate('/transaction')} startIcon={<ReceiptLong />}
                                sx={{
                                    px: 2.5,
                                    color: isActive('/transaction') ? 'primary.main' : 'text.secondary',
                                    bgcolor: isActive('/transaction') ? 'rgba(139, 92, 246, 0.08)' : 'transparent',
                                    fontWeight: isActive('/transaction') ? 700 : 500
                                }}
                            >
                                Transactions
                            </Button>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#333' }}>
                                    {user?.username}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
                                    Administrator
                                </Typography>
                            </Box>
                            <Avatar sx={{
                                background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                                width: 40, height: 40,
                                boxShadow: '0 4px 8px rgba(244, 63, 94, 0.25)'
                            }}>
                                {user?.username?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Tooltip title="Logout">
                                <IconButton
                                    onClick={() => setLogoutOpen(true)} 
                                    sx={{ color: '#94a3b8', '&:hover': { color: '#ef4444', bgcolor: '#fef2f2' } }}
                                >
                                    <Logout />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Container maxWidth="xl" sx={{ mt: 4, pb: 4 }}>
                <Outlet />
            </Container>

            <ConfirmDialog
                open={logoutOpen}
                title="Confirm Logout"
                content="Are you sure you want to log out from the application?"
                confirmText="Logout"
                danger={true} 
                onCancel={() => setLogoutOpen(false)}
                onConfirm={handleConfirmLogout}
            />
        </Box>
    );
};

export default DashboardLayout;