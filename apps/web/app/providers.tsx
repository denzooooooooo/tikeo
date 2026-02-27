'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CookieProvider } from './context/CookieContext';
import { GeolocationProvider } from './context/GeolocationContext';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <GeolocationProvider>
        <CookieProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </CookieProvider>
      </GeolocationProvider>
    </QueryClientProvider>
  );
}
