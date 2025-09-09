// src/components/ForgotPasswordModal.jsx
import React, { useState } from 'react';
import {
  Modal,
  TextInput,
  Button,
  Text,
  Stack,
  Alert,
  Group,
  useMantineTheme
} from '@mantine/core';
import { IconMail, IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { useAuth } from '../AuthProvider';
import { validateEmail } from '../utils';

export function ForgotPasswordModal({ opened, onClose }) {
  const theme = useMantineTheme();
  const { resetPassword, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error);
      return;
    }

    try {
      await resetPassword(email);
      setEmailSent(true);
      setError('');
    } catch (err) {
      setError(err.message || 'Erro ao enviar email');
    }
  };

  const handleClose = () => {
    setEmail('');
    setEmailSent(false);
    setError('');
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Recuperar Senha"
      centered
      size="sm"
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing="md">
          {emailSent ? (
            <Alert
              icon={<IconCheck size={16} />}
              title="Email Enviado!"
              color="green"
              variant="light"
            >
              <Text size="sm">
                Enviamos um link para redefinir sua senha para <strong>{email}</strong>.
                Verifique sua caixa de entrada e siga as instruções.
              </Text>
            </Alert>
          ) : (
            <>
              <Text size="sm" c="dimmed">
                Digite seu email e enviaremos um link para redefinir sua senha.
              </Text>

              {error && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  title="Erro"
                  color="red"
                  variant="light"
                >
                  {error}
                </Alert>
              )}

              <TextInput
                label="Email"
                placeholder="seu@email.com"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
                leftSection={<IconMail size={16} />}
                required
                autoComplete="email"
                size="md"
                radius="md"
              />

              <Group justify="flex-end" mt="md">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors.blue[6]} 0%, ${theme.colors.violet[6]} 100%)`,
                    border: 'none'
                  }}
                >
                  Enviar Email
                </Button>
              </Group>
            </>
          )}

          {emailSent && (
            <Group justify="center" mt="md">
              <Button
                onClick={handleClose}
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.blue[6]} 0%, ${theme.colors.violet[6]} 100%)`,
                  border: 'none'
                }}
              >
                Fechar
              </Button>
            </Group>
          )}
        </Stack>
      </form>
    </Modal>
  );
}
