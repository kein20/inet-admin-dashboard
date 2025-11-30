import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Card, CardContent, Typography, Grid, Box } from '@mui/material';
import api from '../api/Instance';
import { v4 as uuidv4 } from 'uuid';
import ConfirmDialog from './Confirm';

const TransactionModal = ({ open, onClose, customer, onSuccess }) => {
    const [products, setProducts] = useState([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        api.get('/packages').then(res => setProducts(res.data)).catch(console.error);
    }, []);

    const onBuyClick = (product) => {
        setSelectedProduct(product);
        setConfirmOpen(true);
    };

    const handleConfirmBuy = async () => {
        try {
            const transaction = {
                id: uuidv4(),
                customerId: customer.id,
                packageId: selectedProduct.id,
                date: new Date().toISOString(),
                total: selectedProduct.price
            };
            await api.post('/transactions', transaction);
            setConfirmOpen(false);
            onClose();
            onSuccess(`Successfully purchased ${selectedProduct.name}!`);
        } catch (err) {
            alert('Transaction failed');
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>Select Package for <b>{customer.name}</b></DialogTitle>
                <DialogContent sx={{ mt: 1 }}>
                    <Grid container spacing={2}>
                        {products.map((product) => (
                            <Grid item xs={12} md={4} key={product.id}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', '&:hover': { borderColor: 'primary.main', transform: 'translateY(-2px)', transition: 'all 0.2s' } }} variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6" color="primary" gutterBottom>
                                            {product.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            {product.description}
                                        </Typography>
                                        <Typography variant="h5" fontWeight="bold">
                                            Rp {product.price.toLocaleString()}
                                        </Typography>
                                    </CardContent>
                                    <Box sx={{ p: 2, pt: 0 }}>
                                        <Button fullWidth variant="contained" onClick={() => onBuyClick(product)}>
                                            Buy Package
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={onClose} color="inherit">Close</Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog
                open={confirmOpen}
                title="Confirm Purchase"
                content={`Are you sure you want to buy ${selectedProduct?.name}?`}
                confirmText="Confirm"
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleConfirmBuy}
            />
        </>
    );
};

export default TransactionModal;