'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  AlertTriangle,
  Loader2
} from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning' | 'loading';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toast: (message: string, type?: Toast['type'], options?: Partial<Toast>) => void;
  success: (message: string, options?: Partial<Toast>) => void;
  error: (message: string, options?: Partial<Toast>) => void;
  info: (message: string, options?: Partial<Toast>) => void;
  warning: (message: string, options?: Partial<Toast>) => void;
  loading: (message: string, options?: Partial<Toast>) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast['type'] = 'info', options: Partial<Toast> = {}) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { 
      id, 
      message, 
      type,
      duration: type === 'loading' ? undefined : 5000,
      ...options
    };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after duration
    if (newToast.duration) {
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, newToast.duration);
    }

    return id; // Return id for manual dismissal
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const value: ToastContextType = {
    toast: addToast,
    success: (message: string, options?: Partial<Toast>) => addToast(message, 'success', options),
    error: (message: string, options?: Partial<Toast>) => addToast(message, 'error', options),
    info: (message: string, options?: Partial<Toast>) => addToast(message, 'info', options),
    warning: (message: string, options?: Partial<Toast>) => addToast(message, 'warning', options),
    loading: (message: string, options?: Partial<Toast>) => addToast(message, 'loading', options),
    dismiss
  };

  const getToastStyles = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white border-green-600';
      case 'error':
        return 'bg-red-500 text-white border-red-600';
      case 'warning':
        return 'bg-yellow-500 text-white border-yellow-600';
      case 'loading':
        return 'bg-blue-500 text-white border-blue-600';
      default:
        return 'bg-blue-500 text-white border-blue-600';
    }
  };

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'loading':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              className={`p-4 rounded-lg shadow-lg max-w-sm border ${getToastStyles(toast.type)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getIcon(toast.type)}
                  <span className="text-sm font-medium">{toast.message}</span>
                </div>
                <button
                  onClick={() => dismiss(toast.id)}
                  className="ml-2 hover:opacity-70 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {toast.action && (
                <div className="mt-3 pt-3 border-t border-white/20">
                  <button
                    onClick={toast.action.onClick}
                    className="text-sm underline hover:no-underline"
                  >
                    {toast.action.label}
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
} 