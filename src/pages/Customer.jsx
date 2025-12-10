import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Tooltip, Dialog, DialogTitle,
    DialogContent, TextField, DialogActions, Snackbar, Alert, CircularProgress 
} from '@mui/material';
import { PersonAdd, Edit, Delete, Search, Refresh } from '@mui/icons-material';
import api from '../api/Instance';
import ConfirmDialog from '../components/Confirm';

const CustomerPage = () => {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ id: '', name: '', phone: '', email: '' });
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true); 
        try {
            const res = await api.get('/customers');
            setCustomers(res.data);
        } catch (err) {
            console.error("Error fetching customers:", err);
            setSnackbar({ open: true, message: 'Gagal memuat data', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = (customer = null) => {
        if (customer) {
            setEditMode(true);
            setFormData(customer);
        } else {
            setEditMode(false);
            setFormData({ id: '', name: '', phone: '', email: '' });
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.phone || !formData.email) {
            setSnackbar({ open: true, message: 'Please fill all fields', severity: 'warning' });
            return;
        }

        try {
            if (editMode) {
                await api.put(`/customers/${formData.id}`, formData);
                setCustomers(prev => prev.map(c => c.id === formData.id ? formData : c));
                setSnackbar({ open: true, message: 'Customer updated!', severity: 'success' });
            } else {
                const res = await api.post('/customers', { ...formData, id: Date.now().toString() });
                setCustomers([...customers, res.data]);
                setSnackbar({ open: true, message: 'Customer added!', severity: 'success' });
            }
            handleClose();
        } catch (err) {
            setSnackbar({ open: true, message: 'Operation failed', severity: 'error' });
        }
    };

    const onDeleteClick = (id) => {
        setSelectedId(id);
        setDeleteOpen(true);
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/customers/${selectedId}`);
            setCustomers(prev => prev.filter(c => c.id !== selectedId));
            setSnackbar({ open: true, message: 'Customer deleted!', severity: 'success' });
        } catch (err) {
            setSnackbar({ open: true, message: 'Delete failed', severity: 'error' });
        } finally {
            setDeleteOpen(false);
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Customer Data
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<PersonAdd />}
                    onClick={() => handleOpen()}
                    sx={{ borderRadius: '12px', px: 3 }}
                >
                    Add Customer
                </Button>
            </Box>

            <Paper sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Search sx={{ color: 'text.secondary' }} />
                <TextField
                    placeholder="Search by name..."
                    variant="standard"
                    fullWidth
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{ disableUnderline: true }}
                />
                <Tooltip title="Refresh Data">
                    <IconButton onClick={fetchData}>
                        <Refresh />
                    </IconButton>
                </Tooltip>
            </Paper>

            <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell>NAME</TableCell>
                            <TableCell>PHONE</TableCell>
                            <TableCell>EMAIL</TableCell>
                            <TableCell align="right">ACTION</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                                    <CircularProgress />
                                    <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                                        Loading data...
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : filteredCustomers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                                    No customers found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredCustomers.map((customer) => (
                                <TableRow key={customer.id} hover>
                                    <TableCell sx={{ fontWeight: 600 }}>{customer.name}</TableCell>
                                    <TableCell>{customer.phone}</TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Edit">
                                            <IconButton color="primary" size="small" onClick={() => handleOpen(customer)}>
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton color="error" size="small" onClick={() => onDeleteClick(customer.id)}>
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editMode ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField label="Full Name" name="name" value={formData.name} onChange={handleChange} fullWidth />
                        <TextField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} fullWidth />
                        <TextField label="Email Address" name="email" value={formData.email} onChange={handleChange} fullWidth />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog
                open={deleteOpen}
                title="Delete Customer"
                content="Are you sure? This action cannot be undone."
                onCancel={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
                danger
            />

            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
};

export default CustomerPage;