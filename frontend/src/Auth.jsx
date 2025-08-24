// src/Auth.jsx

import { useState } from 'react';
import { supabase } from './supabaseClient';
import { Container, Title, Paper, TextInput, PasswordInput, Button, Group, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else alert('Cadastro realizado! Verifique seu e-mail para confirmação (se habilitado).');
    setLoading(false);
  };

  return (
    <Container size={420} my={40}>
      <Title align="center">Bem-vindo!</Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form>
          <TextInput label="Email" placeholder="seu@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <PasswordInput label="Senha" placeholder="Sua senha" required mt="md" value={password} onChange={(e) => setPassword(e.target.value)} />

          {error && <Alert icon={<IconAlertCircle size="1rem" />} title="Erro!" color="red" mt="lg">{error}</Alert>}

          <Group position="apart" mt="lg">
            <Button onClick={handleLogin} loading={loading}>Entrar</Button>
            <Button variant="outline" onClick={handleSignUp} loading={loading}>Cadastrar</Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}