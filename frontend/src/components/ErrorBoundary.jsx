// src/components/ErrorBoundary.jsx
import React from 'react';
import { Alert, Button, Container, Title, Text, Group, useMantineTheme } from '@mantine/core';
import { IconAlertTriangle, IconRefresh } from '@tabler/icons-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Here you could send error to logging service
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback 
        error={this.state.error} 
        onReset={this.handleReset}
        theme={this.props.theme}
      />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ error, onReset, theme }) {
  const mantineTheme = useMantineTheme();
  const currentTheme = theme || mantineTheme;
  
  return (
    <Container size="sm" py="xl">
      <Alert
        icon={<IconAlertTriangle size="1rem" />}
        title="Algo deu errado!"
        color="red"
        variant="light"
        radius="md"
        mb="md"
      >
        <Text size="sm" mb="md">
          Ocorreu um erro inesperado. Nossa equipe foi notificada e está trabalhando para resolver o problema.
        </Text>
        
        {process.env.NODE_ENV === 'development' && error && (
          <details style={{ marginTop: '1rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              Detalhes do erro (desenvolvimento)
            </summary>
            <pre style={{ 
              marginTop: '0.5rem', 
              padding: '0.5rem', 
              background: currentTheme.colorScheme === 'dark' ? currentTheme.colors.dark[6] : currentTheme.colors.gray[1],
              borderRadius: '4px',
              fontSize: '12px',
              overflow: 'auto'
            }}>
              {error.toString()}
            </pre>
          </details>
        )}
        
        <Group mt="md">
          <Button 
            leftSection={<IconRefresh size={16} />}
            onClick={onReset}
            variant="light"
            color="blue"
          >
            Tentar novamente
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Recarregar página
          </Button>
        </Group>
      </Alert>
    </Container>
  );
}

export default ErrorBoundary;
