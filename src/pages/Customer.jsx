import React, { useState } from 'react';
import {
    Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Snackbar, Alert, Chip
} from '@mui/material';
import { Add, Edit, Delete, ShoppingCart } from '@mui/icons-material';
import { useCustomers } from '../hooks/useCustomers';
import TransactionModal from '../components/TransactionModal';
import ConfirmDialog from '../components/Confirm';

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

    const onBuyClick = (cust) => {
        setSelectedCustomer(cust);
        setTrxModalOpen(true);
    };

    const onDeleteClick = (id) => {
        setDeleteId(id);
        setDeleteOpen(true);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
                <Typography variant="h5" color="text.primary">Customer Management</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={handleOpenAdd}>
                    New customer
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>NAME</TableCell>
                            <TableCell>CONTACT INFO</TableCell>
                            <TableCell>STATUS</TableCell>
                            <TableCell align="right">ACTIONS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {customers.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{row.name}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">{row.email}</Typography>
                                    <Typography variant="caption" color="text.secondary">{row.phone}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip label="Active" size="small" color="success" variant="outlined" />
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
                        ))}
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