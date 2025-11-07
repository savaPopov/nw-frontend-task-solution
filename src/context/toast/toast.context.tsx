import { createContext, useContext } from 'react'

export interface Toast {
    message: string
    type: 'success' | 'error'
}

export interface ToastContextType {
    showToast: (message: string, type?: 'success' | 'error') => void
}

export const ToastContext = createContext<ToastContextType>({
    showToast: (_message: string, _type?: 'success' | 'error') => {
    },
})

export function useToast() {
    return useContext(ToastContext)
}