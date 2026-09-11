import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-stone-900 text-white rounded-xl shadow-lg shadow-stone-900/20 text-xs sm:text-sm font-medium animate-in slide-in-from-bottom-5 duration-200">
      <CheckCircle className="w-4 h-4 text-orange-400" />
      <span>{message}</span>
    </div>
  );
};
