import { ReactNode, useState, useCallback } from 'react'
import { ToastContext, Toast } from './toast.context.tsx'
import { Snackbar, Alert } from '@mui/joy'

export function ToastProvider(props: { children: ReactNode }) {
    const [toast, setToast] = useState<Toast & { open: boolean }>({
        open: false,
        message: '',
        type: 'success'
    })

    const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
        setToast({
            open: true,
            message,
            type
        })
    }, [])

    const closeToast = () => {
        setToast(prev => ({ ...prev, open: false }))
    }

    return (
        <ToastContext.Provider value={{ showToast }}>
            {props.children}
            <Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={closeToast}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                sx={{
                    width: { xs: '90%', sm: '400px' },
                    bottom: { xs: 16, sm: 24 }
                }}
            >
                <Alert
                    color={toast.type === 'success' ? 'success' : 'danger'}
                    variant="soft"
                    sx={{ width: '100%' }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </ToastContext.Provider>
    )
}