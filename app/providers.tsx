'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'white',
              border: '1px solid #e5e7eb',
              color: '#374151',
            },
          }}
        />
      </AuthProvider>
    </SessionProvider>
  );
} 