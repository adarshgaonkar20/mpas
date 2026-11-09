import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none no-print">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg text-sm transition-all duration-200 ${
            toast.type === 'success'
              ? 'bg-white dark:bg-neutral-900 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
              : toast.type === 'error'
              ? 'bg-white dark:bg-neutral-900 border-rose-500/30 text-rose-900 dark:text-rose-200'
              : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            ) : (
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            )}
          </div>
          <div className="flex-1 font-medium leading-snug">{toast.message}</div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="shrink-0 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors p-0.5"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
