import { useState, useEffect, useCallback } from 'react';
import api from '../api/Instance'; 
import { v4 as uuidv4 } from 'uuid';

export const useCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);

    const [openDialog, setOpenDialog] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({ id: '', name: '', phone: '', email: '' });

    const [errors, setErrors] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };
    const closeSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/customers');
            setCustomers(res.data);
        } catch (err) {
            console.error("Gagal ambil data:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const validateField = (name, value) => {
        let errorMsg = '';
        if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) errorMsg = 'Email is required';
            else if (!emailRegex.test(value)) errorMsg = 'Invalid email format';
        }
        if (name === 'phone') {
            if (!value) errorMsg = 'Phone is required';
            else if (value.length < 10) errorMsg = 'Min 10 digits';
        }
        if (name === 'name' && !value.trim()) errorMsg = 'Name is required';
        return errorMsg;
    };

    const handleFormChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        const errorMsg = validateField(field, value);
        setErrors(prev => {
            const newErrors = { ...prev };
            if (errorMsg) newErrors[field] = errorMsg;
            else delete newErrors[field];
            return newErrors;
        });
    };

    const handleSave = async () => {
        const newErrors = {};
        ['name', 'email', 'phone'].forEach(field => {
            const msg = validateField(field, formData[field]);
            if (msg) newErrors[field] = msg;
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return false;
        }

        try {
            if (isEditMode) {
                await api.put(`/customers/${formData.id}`, formData);
                showSnackbar('Customer updated successfully');
            } else {
                await api.post('/customers', { ...formData, id: uuidv4() });
                showSnackbar('Customer created successfully');
            }
            setOpenDialog(false);
            fetchCustomers();
            return true;
        } catch (error) {
            console.error(error);
            showSnackbar('Failed to save data', 'error');
            return false;
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/customers/${id}`);
            showSnackbar('Customer deleted');
            fetchCustomers();
        } catch {
            showSnackbar('Failed to delete', 'error');
        }
    };

    return {
        customers, loading, openDialog, isEditMode, formData, errors, snackbar,
        setOpenDialog, showSnackbar, closeSnackbar,
        handleOpenAdd: () => { setIsEditMode(false); setFormData({ id: '', name: '', phone: '', email: '' }); setErrors({}); setOpenDialog(true); },
        handleOpenEdit: (cust) => { setIsEditMode(true); setFormData(cust); setErrors({}); setOpenDialog(true); },
        handleCloseDialog: () => setOpenDialog(false),
        handleFormChange, handleSave, handleDelete
    };
};