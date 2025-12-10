import React, { useState } from 'react';
import {
    Box, CssBaseline, AppBar, Toolbar, IconButton, Typography,
    Drawer, Divider, List, ListItem, ListItemButton, ListItemIcon,
    ListItemText, Avatar, Container
} from '@mui/material';
import {
    Menu as MenuIcon,
    People,
    ReceiptLong,
    Logout,
    Router as RouterIcon
} from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/Auth';
import ConfirmDialog from '../components/Confirm';

const drawerWidth = 240;

const DashboardLayout = (props) => {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [logoutOpen, setLogoutOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuth();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleConfirmLogout = () => {
        logout();
        setLogoutOpen(false);
        navigate('/login');
    };

    const menuItems = [
        { text: 'Customers', icon: <People />, path: '/customer' },
        { text: 'Transactions', icon: <ReceiptLong />, path: '/transaction' },
    ];

    const drawer = (
        <div>
            <Toolbar sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'primary.main', color: 'white' }}>
                <Box sx={{
                    p: 0.5,
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    display: 'flex'
                }}>
                    <RouterIcon sx={{ color: 'white', fontSize: 20 }} />
                </Box>
                <Typography variant="h6" noWrap component="div" fontWeight="bold">
                    InetAdmin
                </Typography>
            </Toolbar>
            <Divider />

            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#f8fafc', mb: 1 }}>
                <Avatar sx={{
                    background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                    width: 40, height: 40, fontSize: 18, fontWeight: 'bold'
                }}>
                    {user?.username ? user.username.charAt(0).toUpperCase() : 'A'}
                </Avatar>
                <Box sx={{ overflow: 'hidden' }}>
                    <Typography variant="subtitle2" fontWeight="bold" noWrap>
                        {user?.username || 'Admin'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                        Administrator
                    </Typography>
                </Box>
            </Box>
            <Divider />

            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => {
                                navigate(item.path);
                                setMobileOpen(false);
                            }}
                            sx={{
                                '&.Mui-selected': {
                                    bgcolor: 'rgba(139, 92, 246, 0.1)',
                                    color: 'primary.main',
                                    borderRight: '4px solid',
                                    borderColor: 'primary.main',
                                    '& .MuiListItemIcon-root': { color: 'primary.main' }
                                },
                                '&:hover': { bgcolor: '#f1f5f9' },
                                py: 1.5
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 500 }} />
                        </ListItemButton>
                    </ListItem>
                ))}

                <Divider sx={{ my: 2, opacity: 0.5 }} />

                <ListItem disablePadding>
                    <ListItemButton onClick={() => setLogoutOpen(true)}>
                        <ListItemIcon sx={{ minWidth: 40 }}><Logout color="error" /></ListItemIcon>
                        <ListItemText primary="Logout" sx={{ color: 'error.main', fontWeight: 500 }} />
                    </ListItemButton>
                </ListItem>
            </List>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: 'white',
                    color: 'text.primary',
                    boxShadow: 1,
                    display: { sm: 'none' }
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        InetAdmin
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>

                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    mt: { xs: 7, sm: 0 },
                    bgcolor: '#f8fafc',
                    minHeight: '100vh'
                }}
            >
                <Container maxWidth="xl" disableGutters>
                    <Outlet />
                </Container>
            </Box>

            <ConfirmDialog
                open={logoutOpen}
                title="Confirm Logout"
                content="Are you sure you want to log out?"
                confirmText="Logout"
                danger={true}
                onCancel={() => setLogoutOpen(false)}
                onConfirm={handleConfirmLogout}
            />
        </Box>
    );
};

export default DashboardLayout;