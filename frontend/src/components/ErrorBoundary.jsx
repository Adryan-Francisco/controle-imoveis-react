// src/components/ErrorBoundary.jsx
import React from 'react';
import { Alert, Button, Container, Title, Text, Group, useMantineTheme } from '@mantine/core';
import { IconAlertTriangle, IconRefresh } from '@tabler/icons-react';
import { logger } from '../utils/logger';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0,
      maxRetries: 3
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(errorCaught, errorInfo) {
    this.setState({
      error: errorCaught,
      errorInfo: errorInfo
    });

    // Log error usando o logger centralizado
    logger.error('ErrorBoundary capturou um erro', {
      message: errorCaught.toString(),
      componentStack: errorInfo.componentStack,
      retryCount: this.state.retryCount
    });
  }

  handleReset = () => {
    const { retryCount, maxRetries } = this.state;
    
    if (retryCount < maxRetries) {
      this.setState({ 
        hasError: false, 
        error: null, 
        errorInfo: null,
        retryCount: retryCount + 1
      });
      logger.info(`Tentativa de recuperação ${retryCount + 1}/${maxRetries}`);
    } else {
      logger.warn('Número máximo de tentativas de recuperação atingido');
      this.setState({ 
        hasError: false, 
        error: null, 
        errorInfo: null,
        retryCount: 0 // Reset para tentar novamente após recarga
      });
    }
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback 
        error={this.state.error} 
        errorInfo={this.state.errorInfo}
        retryCount={this.state.retryCount}
        maxRetries={this.state.maxRetries}
        onReset={this.handleReset}
        theme={this.props.theme}
      />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ error, errorInfo, retryCount, maxRetries, onReset, theme }) {
  const mantineTheme = useMantineTheme();
  const currentTheme = theme || mantineTheme;
  const canRetry = retryCount < maxRetries;
  
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

        {!canRetry && (
          <Alert title="Limite de tentativas" color="orange" mb="md" variant="light">
            Você atingiu o número máximo de tentativas. Por favor, recarregue a página.
          </Alert>
        )}
        
        {import.meta.env.MODE === 'development' && error && (
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
              overflow: 'auto',
              maxHeight: '300px'
            }}>
              {error.toString()}
              {errorInfo?.componentStack && `\n\nComponent Stack:\n${errorInfo.componentStack}`}
            </pre>
          </details>
        )}
        
        <Group mt="md">
          <Button 
            leftSection={<IconRefresh size={16} />}
            onClick={onReset}
            variant="light"
            color="blue"
            disabled={!canRetry}
            title={!canRetry ? 'Máximo de tentativas atingido' : 'Tentar novamente'}
          >
            {canRetry ? `Tentar novamente (${retryCount}/${maxRetries})` : 'Limite atingido'}
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
