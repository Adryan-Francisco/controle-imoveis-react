// src/Auth.jsx

import { useState } from 'react';
import { supabase } from './supabaseClient';
import { 
  Container, Title, Paper, TextInput, PasswordInput, Button, Group, Alert, Text,
  Card, Stack, Divider, Box, useMantineTheme, BackgroundImage, Center
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconHome, IconShieldLock, IconUser, IconKey } from '@tabler/icons-react';

export default function Auth() {
  const theme = useMantineTheme();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      notifications.show({
        title: 'Cadastro realizado!',
        message: 'Agora você já pode fazer o login com as suas credenciais.',
        color: 'green',
      });
    }
    setLoading(false);
  };

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: theme.colorScheme === 'dark'
          ? `linear-gradient(135deg, ${theme.colors.dark[9]} 0%, ${theme.colors.dark[7]} 50%, ${theme.colors.dark[8]} 100%)`
          : `linear-gradient(135deg, ${theme.colors.blue[0]} 0%, ${theme.colors.gray[0]} 50%, ${theme.colors.blue[1]} 100%)`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Elementos decorativos de fundo */}
      <Box
        style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: theme.colorScheme === 'dark'
            ? `radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%)`
            : `radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%)`,
          animation: 'float 20s ease-in-out infinite'
        }}
      />
      
      <Container size={420} py={60}>
        <Center mb={40}>
          <Stack align="center" spacing="xs">
            <Box
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.colors.blue[6]} 0%, ${theme.colors.blue[8]} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: theme.shadows.lg,
                marginBottom: theme.spacing.md
              }}
            >
              <IconHome size={40} color="white" />
            </Box>
            <Title 
              order={1} 
              align="center" 
              style={{ 
                color: theme.colorScheme === 'dark' ? theme.white : theme.colors.dark[7],
                fontSize: '2.5rem',
                fontWeight: 700,
                textShadow: theme.colorScheme === 'dark' ? '0 2px 4px rgba(0,0,0,0.3)' : 'none'
              }}
            >
              Bem-vindo!
            </Title>
            <Text 
              c="dimmed" 
              size="lg" 
              align="center" 
              style={{ 
                fontWeight: 500,
                maxWidth: 300
              }}
            >
              Faça login ou crie uma conta para acessar o sistema de controle de imóveis rurais.
            </Text>
          </Stack>
        </Center>

        <Card 
          withBorder 
          shadow="xl" 
          p={40} 
          radius="xl"
          style={{
            background: theme.colorScheme === 'dark' 
              ? `linear-gradient(135deg, ${theme.colors.dark[7]} 0%, ${theme.colors.dark[6]} 100%)`
              : `linear-gradient(135deg, ${theme.white} 0%, ${theme.colors.gray[0]} 100%)`,
            border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[3]}`,
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Elemento decorativo no card */}
          <Box
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 100,
              height: 100,
              background: `linear-gradient(135deg, ${theme.colors.blue[6]} 0%, transparent 100%)`,
              borderRadius: '0 0 0 100%',
              opacity: 0.1
            }}
          />

          <form>
            <Stack spacing="lg">
              <TextInput 
                label="Email" 
                placeholder="seu@email.com" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                icon={<IconUser size={18} />}
                radius="md"
                size="md"
                styles={{
                  input: {
                    border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
                    background: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.white,
                    '&:focus': {
                      borderColor: theme.colors.blue[6],
                      boxShadow: `0 0 0 1px ${theme.colors.blue[6]}`
                    }
                  },
                  label: {
                    fontWeight: 600,
                    color: theme.colorScheme === 'dark' ? theme.white : theme.colors.dark[7]
                  }
                }}
              />
              
              <PasswordInput 
                label="Senha" 
                placeholder="Sua senha" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                icon={<IconKey size={18} />}
                radius="md"
                size="md"
                styles={{
                  input: {
                    border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
                    background: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.white,
                    '&:focus': {
                      borderColor: theme.colors.blue[6],
                      boxShadow: `0 0 0 1px ${theme.colors.blue[6]}`
                    }
                  },
                  label: {
                    fontWeight: 600,
                    color: theme.colorScheme === 'dark' ? theme.white : theme.colors.dark[7]
                  }
                }}
              />
              
              {error && (
                <Alert 
                  icon={<IconAlertCircle size="1rem" />} 
                  title="Erro!" 
                  color="red" 
                  radius="md"
                  variant="light"
                >
                  {error}
                </Alert>
              )}

              <Divider 
                my="md" 
                label="ou" 
                labelPosition="center"
                styles={{
                  label: {
                    color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
                    fontWeight: 500
                  }
                }}
              />

              <Group justify="space-between" grow>
                <Button 
                  onClick={handleLogin} 
                  loading={loading}
                  size="md"
                  radius="md"
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors.blue[6]} 0%, ${theme.colors.blue[7]} 100%)`,
                    boxShadow: theme.shadows.md,
                    fontWeight: 600
                  }}
                  leftSection={<IconShieldLock size={18} />}
                >
                  Entrar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleSignUp} 
                  loading={loading}
                  size="md"
                  radius="md"
                  style={{
                    borderColor: theme.colors.blue[6],
                    color: theme.colors.blue[6],
                    fontWeight: 600,
                    '&:hover': {
                      background: theme.colors.blue[6],
                      color: theme.white
                    }
                  }}
                  leftSection={<IconUser size={18} />}
                >
                  Cadastrar
                </Button>
              </Group>
            </Stack>
          </form>
        </Card>

        {/* Footer */}
        <Center mt={40}>
          <Text 
            size="sm" 
            c="dimmed" 
            align="center"
            style={{ fontWeight: 500 }}
          >
            Sistema de Controle de Imóveis Rurais
          </Text>
        </Center>
      </Container>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(1deg); }
          66% { transform: translateY(10px) rotate(-1deg); }
        }
      `}</style>
    </Box>
  );
}
