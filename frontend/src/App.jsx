// src/App.jsx

import { useState } from 'react';
import { AuthProvider, useAuth } from './AuthProvider';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ErrorBoundary from './components/ErrorBoundary';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { usePWA } from './hooks/usePWA';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { PWAUpdatePrompt } from './components/PWAUpdatePrompt';
import { OfflineIndicator } from './components/OfflineIndicator';
import { LoginForm } from './components/LoginForm';
import Dashboard from './Dashboard';

// Tema personalizado mais moderno com melhor acessibilidade
const theme = createTheme({
  primaryColor: 'blue',
  primaryShade: { light: 6, dark: 4 },
  colors: {
    brand: [
      '#f0f9ff',
      '#e0f2fe',
      '#bae6fd',
      '#7dd3fc',
      '#38bdf8',
      '#0ea5e9',
      '#0284c7',
      '#0369a1',
      '#075985',
      '#0c4a6e',
    ],
  },
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  fontFamilyMonospace: 'JetBrains Mono, Monaco, Consolas, monospace',
  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    fontWeight: '600',
  },
  defaultRadius: 'md',
  shadows: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        root: {
          fontWeight: 500,
          '&:focus': {
            outline: '2px solid #0ea5e9',
            outlineOffset: '2px',
          },
        },
      },
    },
    Paper: {
      defaultProps: {
        radius: 'lg',
        shadow: 'md',
      },
    },
    Card: {
      defaultProps: {
        radius: 'lg',
        shadow: 'sm',
      },
    },
    TextInput: {
      styles: {
        input: {
          '&:focus': {
            outline: '2px solid #0ea5e9',
            outlineOffset: '2px',
          },
        },
      },
    },
    Select: {
      styles: {
        input: {
          '&:focus': {
            outline: '2px solid #0ea5e9',
            outlineOffset: '2px',
          },
        },
      },
    },
    NumberInput: {
      styles: {
        input: {
          '&:focus': {
            outline: '2px solid #0ea5e9',
            outlineOffset: '2px',
          },
        },
      },
    },
    DatePickerInput: {
      styles: {
        input: {
          '&:focus': {
            outline: '2px solid #0ea5e9',
            outlineOffset: '2px',
          },
        },
      },
    },
  },
});

function AppContent({ colorScheme, toggleColorScheme }) {
  const { session } = useAuth();
  
  // Enable keyboard navigation
  useKeyboardNavigation();
  
  // PWA functionality
  const { isOnline, canInstall, needRefresh, installApp, updateApp, dismissUpdate } = usePWA();

  return (
    <>
      <Notifications position="top-right" />
      
      {/* PWA Components */}
      <OfflineIndicator isOnline={isOnline} />
      {needRefresh && <PWAUpdatePrompt onUpdate={updateApp} onDismiss={dismissUpdate} />}
      {canInstall && <PWAInstallPrompt onInstall={installApp} onDismiss={() => {}} />}
      
      {/* Esta é a linha mais importante: ela decide qual página mostrar */}
      {!session ? <LoginForm /> : <Dashboard toggleColorScheme={toggleColorScheme} colorScheme={colorScheme} />}
    </>
  );
}

// Configuração do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

export default function App() {
  const [colorScheme, setColorScheme] = useState('light');
  const toggleColorScheme = () => setColorScheme((current) => (current === 'dark' ? 'light' : 'dark'));
  
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme={colorScheme} withGlobalStyles withNormalizeCSS>
        <ErrorBoundary>
          <AuthProvider>
            <AppContent colorScheme={colorScheme} toggleColorScheme={toggleColorScheme} />
          </AuthProvider>
        </ErrorBoundary>
      </MantineProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
