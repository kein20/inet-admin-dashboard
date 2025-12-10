import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Snackbar, Alert, Chip, InputAdornment,
    MenuItem, Select, FormControl, InputLabel, CircularProgress
} from '@mui/material';
import { Add, Edit, Delete, ShoppingCart, Search } from '@mui/icons-material';
import { useCustomers } from '../hooks/useCustomers';
import TransactionModal from '../components/TransactionModal';
import ConfirmDialog from '../components/Confirm';
import api from '../api/Instance';

const CustomerPage = () => {
    const {
        customers, openDialog, isEditMode, formData, errors, snackbar,
        setOpenDialog, handleCloseDialog, handleFormChange, handleSave, handleDelete,
        handleOpenAdd, handleOpenEdit, showSnackbar, closeSnackbar
    } = useCustomers();

    const [trxModalOpen, setTrxModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [search, setSearch] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        api.get('/transactions')
            .then(res => {
                setTransactions(res.data);
            })
            .catch(err => console.error("Gagal ambil transaksi", err))
            .finally(() => {
                setLoading(false);
            });
    }, [customers, trxModalOpen]);

    const onBuyClick = (cust) => {
        setSelectedCustomer(cust);
        setTrxModalOpen(true);
    };

    const onDeleteClick = (id) => {
        setDeleteId(id);
        setDeleteOpen(true);
    };

    const getStatus = (customerId) => {
        const hasTransaction = transactions.some(t => t.customerId === customerId);
        return hasTransaction ? 'Active' : 'Inactive';
    };

    const processedCustomers = customers
        .filter(c => {
            const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.email.toLowerCase().includes(search.toLowerCase()) ||
                c.phone.includes(search);

            const status = getStatus(c.id);
            const matchStatus = statusFilter === 'all'
                ? true
                : status.toLowerCase() === statusFilter;

            return matchSearch && matchStatus;
        })
        .sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            }
        });

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
                <Typography variant="h5" color="text.primary">Customer Management</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={handleOpenAdd}>
                    New Customer
                </Button>
            </Box>

            <Paper sx={{
                p: 2, mb: 3,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2,
                alignItems: 'center'
            }}>
                <TextField
                    size="small"
                    placeholder="Search by Name, Email, Phone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (<InputAdornment position="start"><Search fontSize="small" /></InputAdornment>),
                    }}
                    sx={{ width: { xs: '100%', md: 'auto' }, flexGrow: 1 }}
                />

                <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', md: 'auto' } }}>
                    <FormControl size="small" fullWidth sx={{ minWidth: 120 }}>
                        <InputLabel>Status</InputLabel>
                        <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="inactive">Inactive</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" fullWidth sx={{ minWidth: 120 }}>
                        <InputLabel>Sort</InputLabel>
                        <Select value={sortOrder} label="Sort" onChange={(e) => setSortOrder(e.target.value)}>
                            <MenuItem value="asc">A-Z</MenuItem>
                            <MenuItem value="desc">Z-A</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>NAME</TableCell>
                            <TableCell>EMAIL</TableCell>
                            <TableCell>PHONE</TableCell>
                            <TableCell>STATUS</TableCell>
                            <TableCell align="right">ACTIONS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                                    <CircularProgress />
                                    <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                                        Loading customer data...
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : processedCustomers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                    No customer found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            processedCustomers.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{row.name}</Typography>
                                    </TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{row.phone}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={getStatus(row.id)}
                                            size="small"
                                            color={getStatus(row.id) === 'Active' ? "success" : "default"}
                                            variant={getStatus(row.id) === 'Active' ? "filled" : "outlined"}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button size="small" startIcon={<ShoppingCart />} onClick={() => onBuyClick(row)} sx={{ mr: 1 }}>
                                            Buy
                                        </Button>
                                        <Button size="small" startIcon={<Edit />} onClick={() => handleOpenEdit(row)} sx={{ mr: 1 }}>
                                            Edit
                                        </Button>
                                        <Button size="small" startIcon={<Delete />} color="error" onClick={() => onDeleteClick(row.id)}>
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{isEditMode ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
                <DialogContent>
                    <TextField margin="dense" label="Name" fullWidth value={formData.name} onChange={(e) => handleFormChange('name', e.target.value)} error={!!errors.name} helperText={errors.name} />
                    <TextField margin="dense" label="Phone" fullWidth value={formData.phone} onChange={(e) => handleFormChange('phone', e.target.value)} error={!!errors.phone} helperText={errors.phone} />
                    <TextField margin="dense" label="Email" fullWidth value={formData.email} onChange={(e) => handleFormChange('email', e.target.value)} error={!!errors.email} helperText={errors.email} />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
                    <Button onClick={handleSave} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>

            {selectedCustomer && (
                <TransactionModal
                    open={trxModalOpen} onClose={() => setTrxModalOpen(false)}
                    customer={selectedCustomer}
                    onSuccess={(msg) => showSnackbar(msg)}
                />
            )}

            <ConfirmDialog
                open={deleteOpen} title="Delete Customer" content="Are you sure you want to delete this customer?" danger={true}
                onCancel={() => setDeleteOpen(false)}
                onConfirm={async () => { await handleDelete(deleteId); setDeleteOpen(false); }}
            />

            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={closeSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={closeSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
};

export default CustomerPage;