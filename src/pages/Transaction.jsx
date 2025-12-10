import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Chip, IconButton, Snackbar, Alert, Tooltip,
    TextField, MenuItem, Select, FormControl, InputLabel, Button, InputAdornment, CircularProgress 
} from '@mui/material';
import { History, Delete, Search } from '@mui/icons-material';
import api from '../api/Instance';
import ConfirmDialog from '../components/Confirm';

const TransactionPage = () => {
    const [trxs, setTrxs] = useState([]);
    const [allPackages, setAllPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterPackage, setFilterPackage] = useState('all');
    const [sortOrder, setSortOrder] = useState('newest');
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true); 
        try {
            const [trxRes, custRes, pkgRes] = await Promise.all([
                api.get('/transactions'),
                api.get('/customers'),
                api.get('/packages')
            ]);

            const transactions = trxRes.data;
            const customers = custRes.data;
            const packages = pkgRes.data;

            setAllPackages(packages);

            const mergedData = transactions.map(trx => {
                const customer = customers.find(c => c.id === trx.customerId);
                const pkg = packages.find(p => p.id === trx.packageId);

                return {
                    ...trx,
                    customerName: customer ? customer.name : 'Unknown User',
                    packageName: pkg ? pkg.name : 'Unknown Pkg'
                };
            });

            setTrxs(mergedData);
        } catch (err) {
            console.error("Gagal mengambil data:", err);
            setSnackbar({ open: true, message: 'Failed to load data', severity: 'error' });
        } finally {
            setLoading(false);
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
            setSnackbar({ open: true, message: 'Transaction deleted', severity: 'success' });
        } catch (err) {
            setSnackbar({ open: true, message: 'Failed to delete', severity: 'error' });
        } finally {
            setDeleteOpen(false);
        }
    };

    const closeSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

    const processedTrxs = trxs
        .filter((t) => {
            const matchSearch = t.customerName.toLowerCase().includes(search.toLowerCase());
            const matchDate = filterDate ? t.date.startsWith(filterDate) : true;
            const matchPackage = filterPackage === 'all' ? true : t.packageName === filterPackage;
            return matchSearch && matchDate && matchPackage;
        })
        .sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            switch (sortOrder) {
                case 'newest': return dateB - dateA;
                case 'oldest': return dateA - dateB;
                case 'nameAsc': return a.customerName.localeCompare(b.customerName);
                case 'nameDesc': return b.customerName.localeCompare(a.customerName);
                case 'highPrice': return b.total - a.total;
                case 'lowPrice': return a.total - b.total;
                default: return 0;
            }
        });

    const handleReset = () => {
        setSearch('');
        setFilterDate('');
        setFilterPackage('all');
        setSortOrder('newest');
    };

    return (
        <Box>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <History color="primary" />
                <Typography variant="h5" color="text.primary">Transaction History</Typography>
            </Box>

            <Paper sx={{ p: 2, mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                    label="Search Customer Name"
                    variant="outlined"
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search fontSize="small" sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ flexGrow: 1, minWidth: '200px' }}
                />
                <TextField
                    label="Date"
                    type="date"
                    size="small"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: 140 }}
                />
                <FormControl size="small" sx={{ width: 160 }}>
                    <InputLabel>Package Type</InputLabel>
                    <Select value={filterPackage} label="Package Type" onChange={(e) => setFilterPackage(e.target.value)}>
                        <MenuItem value="all">All Packages</MenuItem>
                        {allPackages.map((pkg) => (
                            <MenuItem key={pkg.id} value={pkg.name}>{pkg.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ width: 160 }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select value={sortOrder} label="Sort By" onChange={(e) => setSortOrder(e.target.value)}>
                        <MenuItem value="newest">Newest Date</MenuItem>
                        <MenuItem value="oldest">Oldest Date</MenuItem>
                        <MenuItem value="nameAsc">Customer (A-Z)</MenuItem>
                        <MenuItem value="nameDesc">Customer (Z-A)</MenuItem>
                        <MenuItem value="highPrice">Highest Price</MenuItem>
                        <MenuItem value="lowPrice">Lowest Price</MenuItem>
                    </Select>
                </FormControl>
                {(search || filterDate || filterPackage !== 'all' || sortOrder !== 'newest') && (
                    <Button size="small" color="error" onClick={handleReset}>Reset</Button>
                )}
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>DATE</TableCell>
                            <TableCell>CUSTOMER</TableCell>
                            <TableCell>PACKAGE</TableCell>
                            <TableCell>TOTAL PRICE</TableCell>
                            <TableCell align="right">ACTION</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                                    <CircularProgress />
                                    <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>Loading history...</Typography>
                                </TableCell>
                            </TableRow>
                        ) : processedTrxs.map((trx) => (
                            <TableRow key={trx.id}>
                                <TableCell>{formatDate(trx.date)}</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>{trx.customerName}</TableCell>
                                <TableCell><Chip label={trx.packageName} size="small" color="secondary" variant="outlined" /></TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Rp {parseInt(trx.total || 0).toLocaleString()}</TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Delete History">
                                        <IconButton color="error" size="small" onClick={() => onDeleteClick(trx.id)}><Delete /></IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                        {!loading && processedTrxs.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>No transactions found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <ConfirmDialog open={deleteOpen} title="Delete Transaction" content="Are you sure?" danger={true} onCancel={() => setDeleteOpen(false)} onConfirm={handleDelete} />
            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={closeSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={closeSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
};

export default TransactionPage;