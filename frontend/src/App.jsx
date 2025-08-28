// src/App.jsx

import { useState } from 'react';
import { AuthProvider, useAuth } from './AuthProvider';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import Auth from './Auth';
import Dashboard from './Dashboard';

// Tema personalizado mais moderno
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
  },
});

function AppContent() {
  const { session } = useAuth();
  const [colorScheme, setColorScheme] = useState('light');
  const toggleColorScheme = () => setColorScheme((current) => (current === 'dark' ? 'light' : 'dark'));

  return (
    <MantineProvider theme={theme} defaultColorScheme={colorScheme} withGlobalStyles withNormalizeCSS>
      <Notifications position="top-right" />
      {/* Esta é a linha mais importante: ela decide qual página mostrar */}
      {!session ? <Auth /> : <Dashboard toggleColorScheme={toggleColorScheme} colorScheme={colorScheme} />}
    </MantineProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
