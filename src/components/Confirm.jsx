import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';

const ConfirmDialog = ({ open, title, content, onConfirm, onCancel, confirmText = "Yes", cancelText = "Cancel", danger = false }) => {
    return (
        <Dialog
            open={open} onClose={onCancel} maxWidth="xs" fullWidth
            PaperProps={{
                sx: { bgcolor: '#161b22', color: '#c9d1d9', border: '1px solid #30363d' }
            }}
        >
            <DialogTitle sx={{ borderBottom: '1px solid #30363d', fontSize: '1rem', fontWeight: 600 }}>
                {title}
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
                <Typography variant="body2">{content}</Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2, borderTop: '1px solid #30363d' }}>
                <Button onClick={onCancel} size="small" sx={{ color: '#8b949e', textTransform: 'none', border: '1px solid #30363d' }}>
                    {cancelText}
                </Button>
                <Button
                    onClick={onConfirm}
                    size="small"
                    variant="contained"
                    sx={{
                        bgcolor: danger ? '#da3633' : '#238636',
                        color: 'white', textTransform: 'none', fontWeight: 'bold',
                        '&:hover': { bgcolor: danger ? '#b62324' : '#2ea043' }
                    }}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;