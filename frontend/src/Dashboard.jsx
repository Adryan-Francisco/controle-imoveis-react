// src/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthProvider';

// --- Importações do Mantine e de Ícones ---
import {
  AppShell, Container, Title, Paper, TextInput, Select, NumberInput, Button,
  Table, Group, ActionIcon, Loader, Center, Text, Modal, Badge,
  useMantineTheme, SimpleGrid
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { 
  IconPencil, IconTrash, IconPlus, IconSearch, IconSun, IconMoonStars, IconLogout
} from '@tabler/icons-react';
import 'dayjs/locale/pt-br';

export default function Dashboard({ toggleColorScheme, colorScheme }) {
  const theme = useMantineTheme();
  const { user, signOut } = useAuth();

  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [selectedImovel, setSelectedImovel] = useState(null);

  const form = useForm({
    // --- CORREÇÃO APLICADA AQUI ---
    initialValues: {
      id: null, proprietario: '', sitio: '', cpf: '', valor: null, data_vencimento: null,
      status_pagamento: 'PENDENTE', ccir: '', endereco: '', itr: '', telefone: '', data_pagamento: null
    },
    validate: {
      proprietario: (value) => (value.trim().length < 2 ? 'O nome do proprietário é obrigatório.' : null),
    },
  });

  async function fetchImoveis() {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('ControleImoveisRurais')
      .select('*')
      .eq('user_id', user.id) // Filtra pelo ID do usuário
      .order('id', { ascending: true });
    
    if (error) {
      notifications.show({ title: 'Erro', message: 'Não foi possível buscar seus dados.', color: 'red' });
    } else {
      setImoveis(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchImoveis();
  }, [user]);

  async function handleSubmit(values) {
    setIsSubmitting(true);
    const dataToSend = { ...values };
    
    if (dataToSend.valor === '') dataToSend.valor = null;
    if (dataToSend.data_vencimento === '') dataToSend.data_vencimento = null;
    if (dataToSend.data_pagamento === '') dataToSend.data_pagamento = null;
    
    const isEditing = !!form.values.id;
    
    if (isEditing) {
      const { id, user_id, ...dataToUpdate } = dataToSend;
      const { error } = await supabase.from('ControleImoveisRurais').update(dataToUpdate).eq('id', id);
      if (error) notifications.show({ title: 'Erro!', message: 'Falha ao atualizar o registro.', color: 'red' });
      else notifications.show({ title: 'Sucesso!', message: 'Registro atualizado com sucesso.', color: 'green' });
    } else {
      const { id, ...dataToInsert } = dataToSend;
      const { error } = await supabase
        .from('ControleImoveisRurais')
        .insert([{ ...dataToInsert, user_id: user.id }]);
      if (error) notifications.show({ title: 'Erro!', message: 'Falha ao criar o registro.', color: 'red' });
      else notifications.show({ title: 'Sucesso!', message: 'Registro criado com sucesso.', color: 'green' });
    }
    fetchImoveis();
    closeModal();
    setIsSubmitting(false);
  }

  async function handleDelete() {
    setIsSubmitting(true);
    const { error } = await supabase.from('ControleImoveisRurais').delete().eq('id', selectedImovel.id);
    if (error) notifications.show({ title: 'Erro!', message: 'Falha ao deletar o registro.', color: 'red' });
    else {
      notifications.show({ title: 'Sucesso!', message: 'Registro deletado com sucesso.', color: 'teal' });
      fetchImoveis();
    }
    closeDeleteModal();
    setSelectedImovel(null);
    setIsSubmitting(false);
  }

  const openCreateModal = () => { form.reset(); openModal(); };
  const openEditModal = (imovel) => {
    form.setValues({
      ...imovel,
      data_vencimento: imovel.data_vencimento ? new Date(imovel.data_vencimento) : null,
      data_pagamento: imovel.data_pagamento ? new Date(imovel.data_pagamento) : null,
    });
    openModal();
  };
  const openConfirmDeleteModal = (imovel) => { setSelectedImovel(imovel); openDeleteModal(); };

  const filteredData = imoveis.filter((item) =>
    item.proprietario?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sitio?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusColors = { PAGO: 'green', PENDENTE: 'orange', ATRASADO: 'red' };

  return (
    <AppShell
      padding="md"
      header={
        <AppShell.Header height={60} p="xs" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]}` }}>
          <Group><Title order={3}>Controle de Imóveis Rurais</Title></Group>
          <Group>
            <Text size="sm" c="dimmed">Olá, {user.email}</Text>
            <ActionIcon onClick={toggleColorScheme} size="lg" variant="default" radius="md">
              {colorScheme === 'dark' ? <IconSun size="1.2rem" /> : <IconMoonStars size="1.2rem" />}
            </ActionIcon>
            <Button onClick={signOut} variant="light" color="red" leftSection={<IconLogout size={16} />}>
              Sair
            </Button>
          </Group>
        </AppShell.Header>
      }
      styles={(theme) => ({ main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] } })}
    >
      <Container size="xl" my="md">
        <Modal opened={modalOpened} onClose={closeModal} title={form.values.id ? 'Editar Imóvel' : 'Adicionar Novo Imóvel'} size="xl" centered>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                <TextInput label="Proprietário" placeholder="Nome do proprietário" {...form.getInputProps('proprietario')} />
                <TextInput label="Sítio/Fazenda" placeholder="Nome do imóvel" {...form.getInputProps('sitio')} />
            </SimpleGrid>
            <TextInput mt="md" label="Endereço" placeholder="Endereço completo do imóvel" {...form.getInputProps('endereco')} />
            <SimpleGrid mt="md" cols={2} breakpoints={[{ maxWidth: 'sm', cols:1 }]}>
                <TextInput label="CPF" placeholder="000.000.000-00" {...form.getInputProps('cpf')} />
                <TextInput label="Telefone" placeholder="(00) 00000-0000" {...form.getInputProps('telefone')} />
            </SimpleGrid>
            <SimpleGrid mt="md" cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                <TextInput label="CCIR" placeholder="Código do CCIR" {...form.getInputProps('ccir')} />
                <TextInput label="ITR/CIB" placeholder="Número do ITR/CIB" {...form.getInputProps('itr')} />
                <NumberInput
                  label="Valor (R$)" placeholder="1500.00" precision={2} step={50} min={0}
                  value={form.values.valor ?? ''}
                  onChange={(value) => form.setFieldValue('valor', value === '' ? null : Number(value))}
                  error={form.errors.valor}
                />
            </SimpleGrid>
            <SimpleGrid mt="md" cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                <Select label="Status" data={['PENDENTE', 'PAGO', 'ATRASADO']} {...form.getInputProps('status_pagamento')} />
                <DatePickerInput locale="pt-br" label="Data de Pagamento" placeholder="Quando foi pago" {...form.getInputProps('data_pagamento')} />
                <DatePickerInput locale="pt-br" label="Data de Vencimento" placeholder="Quando vence" {...form.getInputProps('data_vencimento')} />
            </SimpleGrid>
            <Group position="right" mt="xl">
                <Button variant="default" onClick={closeModal}>Cancelar</Button>
                <Button type="submit" loading={isSubmitting}>{form.values.id ? 'Atualizar' : 'Salvar'}</Button>
            </Group>
          </form>
        </Modal>

        <Modal opened={deleteModalOpened} onClose={closeDeleteModal} title="Confirmar Exclusão" centered>
          <Text>Tem certeza que deseja excluir o registro de <strong>{selectedImovel?.proprietario}</strong>?</Text>
          <Group position="right" mt="xl">
            <Button variant="default" onClick={closeDeleteModal}>Cancelar</Button>
            <Button color="red" onClick={handleDelete} loading={isSubmitting}>Excluir</Button>
          </Group>
        </Modal>
        
        <Paper withBorder shadow="md" p="lg" radius="md">
          <Group position="apart" mb="lg">
            <TextInput
              placeholder="Buscar por proprietário ou sítio..."
              icon={<IconSearch size={14} />}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
              style={{ flex: 1 }}
            />
            <Button onClick={openCreateModal} leftSection={<IconPlus size={16} />}>
              Adicionar Imóvel
            </Button>
          </Group>
          <div style={{ overflowX: 'auto' }}>
            <Table striped highlightOnHover fontSize="sm" verticalSpacing="sm">
              <thead>
                <tr>
                  <th>Proprietário</th><th>Sítio</th><th>Telefone</th><th>Status</th>
                  <th>Vencimento</th><th>Valor</th><th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7}><Center my="xl"><Loader /></Center></td></tr>
                ) : filteredData.length === 0 ? (
                  <tr><td colSpan={7}><Center my="xl"><Text>Nenhum registro para este usuário.</Text></Center></td></tr>
                ) : 
                (filteredData.map((prop) => (
                  <tr key={prop.id}>
                    <td>{prop.proprietario}</td><td>{prop.sitio}</td><td>{prop.telefone}</td>
                    <td><Badge color={statusColors[prop.status_pagamento] || 'gray'} variant={theme.colorScheme === 'dark' ? 'light' : 'filled'}>{prop.status_pagamento}</Badge></td>
                    <td>{prop.data_vencimento ? new Date(prop.data_vencimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'N/A'}</td>
                    <td>{prop.valor ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prop.valor) : 'N/A'}</td>
                    <td>
                      <Group spacing="xs" noWrap>
                        <ActionIcon title="Editar" color="blue" variant="light" onClick={() => openEditModal(prop)}><IconPencil size={16} /></ActionIcon>
                        <ActionIcon title="Excluir" color="red" variant="light" onClick={() => openConfirmDeleteModal(prop)}><IconTrash size={16} /></ActionIcon>
                      </Group>
                    </td>
                  </tr>
                )))}
              </tbody>
            </Table>
          </div>
        </Paper>
      </Container>
    </AppShell>
  );
}