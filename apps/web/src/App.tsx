import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/auth-context';
import { ThemeProvider } from './context/theme-context';
import { queryClient } from './lib/query-client';
import { router } from './router';
import './styles.css';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#0f172a',
                border: '1px solid #1e293b',
                color: '#f1f5f9',
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                fontWeight: '600',
              },
            }}
            richColors
          />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
