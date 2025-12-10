import React, { useState } from 'react';
import {
    Box, Typography, TextField, Button, Paper, Alert, InputAdornment, Tooltip, CircularProgress
} from '@mui/material'; 
import { Login as LoginIcon, Person, Lock } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../api/Instance';
import { useAuth } from '../context/Auth';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError('Mohon isi username dan password terlebih dahulu.');
            return;
        }

        setIsLoading(true);
        setError(''); 

        try {
            const res = await api.get(`/users?username=${username}&password=${password}`);

            if (res.data.length > 0) {
                login(res.data[0]);
                navigate('/');
            } else {
                setError('Username atau password salah.');
            }
        } catch (err) {
            console.error(err);
            setError('Gagal terhubung ke server. Backend mungkin sedang "tidur", coba lagi dalam beberapa detik.');
        } finally {
            setIsLoading(false);
        }
    };

    const isButtonDisabled = !username || !password;

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #fdfbf7 0%, #e0e7ff 100%)',
            position: 'relative',
            overflow: 'hidden',
            p: 2
        }}>
            <Box sx={{
                position: 'absolute', top: -100, left: -100, width: 300, height: 300,
                borderRadius: '50%', bgcolor: '#8b5cf6', opacity: 0.1, filter: 'blur(60px)'
            }} />
            <Box sx={{
                position: 'absolute', bottom: -50, right: -50, width: 400, height: 400,
                borderRadius: '50%', bgcolor: '#ec4899', opacity: 0.1, filter: 'blur(80px)'
            }} />

            <Paper elevation={0} sx={{
                p: 5, width: '100%', maxWidth: 400, borderRadius: 4, textAlign: 'center',
                bgcolor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.9)',
                boxShadow: '0 20px 40px rgba(139, 92, 246, 0.15)'
            }}>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{
                        p: 2,
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                        borderRadius: '20px',
                        color: 'white',
                        boxShadow: '0 8px 16px rgba(139, 92, 246, 0.3)'
                    }}>
                        <LoginIcon fontSize="large" />
                    </Box>
                </Box>

                <Typography variant="h4" gutterBottom sx={{ fontWeight: 800, color: '#4c1d95' }}>
                    Hello!
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Welcome back, Admin.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

                <form onSubmit={handleLogin}>
                    <TextField
                        fullWidth
                        label="Username"
                        variant="outlined"
                        margin="normal"
                        value={username}
                        disabled={isLoading} 
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setError('');
                        }}
                        sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#f8fafc' } }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Person sx={{ color: '#8b5cf6' }} />
                                </InputAdornment>
                            )
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        variant="outlined"
                        margin="normal"
                        value={password}
                        disabled={isLoading} 
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError('');
                        }}
                        sx={{ mb: 4, '& .MuiOutlinedInput-root': { bgcolor: '#f8fafc' } }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock sx={{ color: '#8b5cf6' }} />
                                </InputAdornment>
                            )
                        }}
                    />

                    <Tooltip
                        title={isButtonDisabled && !isLoading ? "Masukkan username dan password terlebih dahulu" : ""}
                        arrow
                        placement="top"
                    >
                        <Box sx={{ width: '100%', position: 'relative' }}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={isButtonDisabled || isLoading}
                                sx={{
                                    py: 1.8,
                                    fontSize: '1rem',
                                    borderRadius: 3,
                                    '&.Mui-disabled': {
                                        bgcolor: isLoading ? '#a78bfa' : '#e2e8f0', 
                                        color: '#94a3b8',
                                    }
                                }}
                            >
                                {isLoading ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CircularProgress size={24} sx={{ color: 'white' }} />
                                        <span>Connecting...</span>
                                    </Box>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </Box>
                    </Tooltip>

                </form>
            </Paper>
        </Box>
    );
};

export default LoginPage;