// src/App.jsx

import { useState } from 'react';
import { AuthProvider, useAuth } from './AuthProvider';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import Auth from './Auth';
import Dashboard from './Dashboard';

function AppContent() {
  const { session } = useAuth();
  const [colorScheme, setColorScheme] = useState('light');
  const toggleColorScheme = () => setColorScheme((current) => (current === 'dark' ? 'light' : 'dark'));

  // A lógica do "porteiro" está aqui
  return (
    <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
      <Notifications position="top-right" />
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
