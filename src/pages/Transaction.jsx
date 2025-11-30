import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Chip, IconButton, Snackbar, Alert, Tooltip
} from '@mui/material';
import { History, Delete } from '@mui/icons-material';
import api from '../api/Instance';
import ConfirmDialog from '../components/Confirm';

const TransactionPage = () => {
    const [trxs, setTrxs] = useState([]);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [trxRes, custRes, pkgRes] = await Promise.all([
                api.get('/transactions'),
                api.get('/customers'),
                api.get('/packages')
            ]);

            const transactions = trxRes.data;
            const customers = custRes.data;
            const packages = pkgRes.data;

            const mergedData = transactions.map(trx => {
                const customer = customers.find(c => c.id === trx.customerId);
                const pkg = packages.find(p => p.id === trx.packageId);

                return {
                    ...trx,
                    customerName: customer ? customer.name : 'Unknown User',
                    packageName: pkg ? pkg.name : 'Unknown Pkg'
                };
            });

            setTrxs(mergedData.reverse());

        } catch (err) {
            console.error("Gagal mengambil data:", err);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleString('id-ID', {
            dateStyle: 'medium', timeStyle: 'short'
        });
    };

    const onDeleteClick = (id) => {
        setDeleteId(id);
        setDeleteOpen(true);
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/transactions/${deleteId}`);
            setTrxs(prev => prev.filter(t => t.id !== deleteId)); 
            setSnackbar({ open: true, message: 'Transaction deleted successfully', severity: 'success' });
        } catch (err) {
            setSnackbar({ open: true, message: 'Failed to delete transaction', severity: 'error' });
        } finally {
            setDeleteOpen(false);
        }
    };

    const closeSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

    return (
        <Box>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <History color="primary" />
                <Typography variant="h5" color="text.primary">Transaction History</Typography>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>DATE</TableCell>
                            <TableCell>CUSTOMER</TableCell>
                            <TableCell>PACKAGE</TableCell>
                            <TableCell>TOTAL PRICE</TableCell>
                            <TableCell align="right">ACTION</TableCell> {/* Tambah kolom Action */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {trxs.map((trx) => (
                            <TableRow key={trx.id}>
                                <TableCell>{formatDate(trx.date)}</TableCell>

                                <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>
                                    {trx.customerName}
                                </TableCell>

                                <TableCell>
                                    <Chip
                                        label={trx.packageName}
                                        size="small"
                                        color="secondary"
                                        variant="outlined"
                                    />
                                </TableCell>

                                <TableCell sx={{ fontWeight: 'bold' }}>
                                    Rp {parseInt(trx.total || 0).toLocaleString()}
                                </TableCell>

                                <TableCell align="right">
                                    <Tooltip title="Delete History">
                                        <IconButton color="error" size="small" onClick={() => onDeleteClick(trx.id)}>
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                        {trxs.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                    No transactions found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <ConfirmDialog
                open={deleteOpen}
                title="Delete Transaction"
                content="Are you sure you want to delete this transaction history? This action cannot be undone."
                danger={true}
                onCancel={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
            />

            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={closeSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={closeSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default TransactionPage;