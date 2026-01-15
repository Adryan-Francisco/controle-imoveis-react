// src/test/utils/test-utils.jsx
import React from 'react';
import { render } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { AuthProvider } from '../../AuthProvider';

// Custom render function that includes providers
export function renderWithProviders(ui, { theme = {}, ...renderOptions } = {}) {
  function Wrapper({ children }) {
    return (
      <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
        <Notifications />
        <AuthProvider>
          {children}
        </AuthProvider>
      </MantineProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';







