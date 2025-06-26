'use client';

import { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'loading';
}

const ToastContext = createContext<{
  success: (message: string) => void;
  error: (message: string) => void;
  loading: (message: string) => void;
} | null>(null);

export function SimpleToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: Toast['type']) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    
    if (type !== 'loading') {
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, 5000);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{
      success: (message) => addToast(message, 'success'),
      error: (message) => addToast(message, 'error'),
      loading: (message) => addToast(message, 'loading')
    }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className={`p-4 rounded-lg shadow-lg max-w-sm border ${
                toast.type === 'success' ? 'bg-green-500 text-white' :
                toast.type === 'error' ? 'bg-red-500 text-white' :
                'bg-blue-500 text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {toast.type === 'success' ? <CheckCircle className="h-4 w-4" /> :
                   toast.type === 'error' ? <AlertCircle className="h-4 w-4" /> :
                   <Loader2 className="h-4 w-4 animate-spin" />}
                  <span className="text-sm font-medium">{toast.message}</span>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="ml-2 hover:opacity-70"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useSimpleToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useSimpleToast must be used within a SimpleToastProvider');
  }
  return context;
} 