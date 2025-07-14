'use client';

import { Toaster } from 'react-hot-toast';
import { useChatStore } from '@/store';

export function ToastProvider() {
  const { darkMode } = useChatStore();
  
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: darkMode ? '#374151' : '#ffffff',
          color: darkMode ? '#ffffff' : '#000000',
          border: darkMode ? '1px solid #4B5563' : '1px solid #E5E7EB',
        },
      }}
    />
  );
}
