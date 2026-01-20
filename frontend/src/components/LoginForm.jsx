// src/components/LoginForm.jsx
import React, { useState } from 'react';
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Group,
  Alert,
  Stack,
  useMantineTheme,
  Box,
  Divider,
  Anchor
} from '@mantine/core';
import { IconMail, IconLock, IconAlertCircle } from '@tabler/icons-react';
import { useAuth } from '../AuthProvider';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { validateLoginData, VALIDATION_RULES } from '../utils';
import { logger } from '../utils/logger';

export function LoginForm() {
  const theme = useMantineTheme();
  const { signIn, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [forgotPasswordOpened, setForgotPasswordOpened] = useState(false);

  const handleInputChange = (field) => (event) => {
    const value = event.currentTarget.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro de validação quando o usuário começar a digitar
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const validation = validateLoginData(formData);
    setValidationErrors(validation.errors);
    return validation.isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await signIn(formData.email, formData.password);
    } catch (err) {
      logger.error('Erro no login', err);
    }
  };

  const handleForgotPassword = () => {
    setForgotPasswordOpened(true);
  };

  return (
    <Box
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.colors.blue[0]} 0%, ${theme.colors.violet[0]} 100%)`,
        padding: '1rem'
      }}
    >
      <Paper
        shadow="xl"
        radius="lg"
        p="xl"
        style={{
          width: '100%',
          maxWidth: '400px',
          background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
          border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[3]}`,
        }}
      >
        <Stack spacing="lg">
          {/* Header */}
          <Box style={{ textAlign: 'center' }}>
            <Box
              style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 1rem',
                background: `linear-gradient(135deg, ${theme.colors.blue[6]} 0%, ${theme.colors.violet[6]} 100%)`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
              }}
            >
              🏡
            </Box>
            <Title order={2} style={{ 
              background: `linear-gradient(135deg, ${theme.colors.blue[6]} 0%, ${theme.colors.violet[6]} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '0.5rem'
            }}>
              Controle de Imóveis
            </Title>
            <Text size="sm" c="dimmed">
              Faça login para acessar o sistema
            </Text>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Erro no Login"
              color="red"
              variant="light"
            >
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <Stack spacing="md">
              <TextInput
                label="Email"
                placeholder="seu@email.com"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                leftSection={<IconMail size={16} />}
                error={validationErrors.email}
                required
                autoComplete="email"
                size="md"
                radius="md"
              />

              <PasswordInput
                label="Senha"
                placeholder="Sua senha"
                value={formData.password}
                onChange={handleInputChange('password')}
                leftSection={<IconLock size={16} />}
                error={validationErrors.password}
                required
                autoComplete="current-password"
                size="md"
                radius="md"
                visible={showPassword}
                onVisibilityChange={setShowPassword}
              />

              <Group justify="space-between" mt="sm">
                <Anchor
                  size="sm"
                  onClick={handleForgotPassword}
                  style={{ cursor: 'pointer' }}
                >
                  Esqueceu a senha?
                </Anchor>
              </Group>

              <Button
                type="submit"
                fullWidth
                size="md"
                radius="md"
                loading={loading}
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.blue[6]} 0%, ${theme.colors.violet[6]} 100%)`,
                  border: 'none',
                  marginTop: '1rem'
                }}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </Stack>
          </form>

          <Divider label="ou" labelPosition="center" />

          {/* Additional Info */}
          <Box style={{ textAlign: 'center' }}>
            <Text size="sm" c="dimmed">
              Não tem uma conta?{' '}
              <Anchor
                size="sm"
                onClick={() => logger.info('Tentativa de registro - em contato com admin')}
                style={{ cursor: 'pointer' }}
              >
                Entre em contato com o administrador
              </Anchor>
            </Text>
          </Box>
        </Stack>
      </Paper>

      <ForgotPasswordModal
        opened={forgotPasswordOpened}
        onClose={() => setForgotPasswordOpened(false)}
      />
    </Box>
  );
}
