import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-16 lg:bottom-6 right-6 z-50 flex items-center gap-2.5 bg-stone-900 text-white px-4 py-3 rounded-lg shadow-xl text-xs sm:text-sm animate-in slide-in-from-bottom-2 fade-in duration-200">
      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
      <span className="font-medium font-sans">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-stone-400 hover:text-white p-0.5"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
