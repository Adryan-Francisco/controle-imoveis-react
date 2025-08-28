// src/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthProvider';

// --- Importações do Mantine e de Ícones ---
import {
  AppShell, Container, Title, Paper, TextInput, Select, NumberInput, Button,
  Table, Group, ActionIcon, Loader, Center, Text, Modal, Badge,
  useMantineTheme, SimpleGrid, Card, Stack, Divider, Grid, Box,
  Progress, RingProgress, Tooltip, ScrollArea
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { 
  IconPencil, IconTrash, IconPlus, IconSearch, IconSun, IconMoonStars, IconLogout,
  IconHome, IconUser, IconCalendar, IconCash, IconAlertTriangle, IconCheckCircle
} from '@tabler/icons-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';
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
      .eq('user_id', user.id)
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

  // Cálculos para estatísticas
  const totalImoveis = imoveis.length;
  const imoveisPagos = imoveis.filter(i => i.status_pagamento === 'PAGO').length;
  const imoveisPendentes = imoveis.filter(i => i.status_pagamento === 'PENDENTE').length;
  const imoveisAtrasados = imoveis.filter(i => i.status_pagamento === 'ATRASADO').length;
  const valorTotal = imoveis.reduce((sum, i) => sum + (i.valor || 0), 0);
  const valorPendente = imoveis
    .filter(i => i.status_pagamento !== 'PAGO')
    .reduce((sum, i) => sum + (i.valor || 0), 0);

  // Dados para gráficos
  const statusData = [
    { name: 'Pagos', value: imoveisPagos, color: theme.colors.green[6] },
    { name: 'Pendentes', value: imoveisPendentes, color: theme.colors.orange[6] },
    { name: 'Atrasados', value: imoveisAtrasados, color: theme.colors.red[6] },
  ];

  const monthlyData = imoveis
    .filter(i => i.data_vencimento)
    .reduce((acc, i) => {
      const month = new Date(i.data_vencimento).toLocaleDateString('pt-BR', { month: 'short' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

  const chartData = Object.entries(monthlyData).map(([month, count]) => ({
    month,
    count,
  }));

  return (
    <AppShell
      padding="md"
      header={
        <AppShell.Header height={70} p="md" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]}`,
          background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
          backdropFilter: 'blur(10px)',
          boxShadow: theme.shadows.sm
        }}>
          <Group>
            <IconHome size={28} color={theme.colors.blue[6]} />
            <Title order={2} style={{ color: theme.colors.blue[6] }}>Controle de Imóveis Rurais</Title>
          </Group>
          <Group>
            <Text size="sm" c="dimmed" style={{ fontWeight: 500 }}>Olá, {user.email}</Text>
            <ActionIcon 
              onClick={toggleColorScheme} 
              size="lg" 
              variant="light" 
              radius="md"
              style={{ 
                background: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
                border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`
              }}
            >
              {colorScheme === 'dark' ? <IconSun size="1.2rem" /> : <IconMoonStars size="1.2rem" />}
            </ActionIcon>
            <Button 
              onClick={signOut} 
              variant="light" 
              color="red" 
              leftSection={<IconLogout size={16} />}
              radius="md"
            >
              Sair
            </Button>
          </Group>
        </AppShell.Header>
      }
      styles={(theme) => ({ 
        main: { 
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
          backgroundImage: theme.colorScheme === 'dark' 
            ? 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)'
            : 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%)'
        } 
      })}
    >
      <Container size="xl" my="xl">
        {/* Cards de Estatísticas */}
        <Grid gutter="lg" mb="xl">
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder p="lg" radius="lg" style={{ 
              background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
              border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[3]}`,
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = theme.shadows.lg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = theme.shadows.sm;
            }}
            >
              <Group justify="space-between" align="flex-start">
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={500}>Total de Imóveis</Text>
                  <Text size="xl" fw={700} style={{ color: theme.colors.blue[6] }}>{totalImoveis}</Text>
                </div>
                <IconHome size={24} color={theme.colors.blue[6]} />
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder p="lg" radius="lg" style={{ 
              background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
              border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[3]}`,
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = theme.shadows.lg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = theme.shadows.sm;
            }}
            >
              <Group justify="space-between" align="flex-start">
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={500}>Valor Total</Text>
                  <Text size="xl" fw={700} style={{ color: theme.colors.green[6] }}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorTotal)}
                  </Text>
                </div>
                <IconCash size={24} color={theme.colors.green[6]} />
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder p="lg" radius="lg" style={{ 
              background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
              border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[3]}`,
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = theme.shadows.lg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = theme.shadows.sm;
            }}
            >
              <Group justify="space-between" align="flex-start">
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={500}>Pendente</Text>
                  <Text size="xl" fw={700} style={{ color: theme.colors.orange[6] }}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorPendente)}
                  </Text>
                </div>
                <IconAlertTriangle size={24} color={theme.colors.orange[6]} />
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder p="lg" radius="lg" style={{ 
              background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
              border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[3]}`,
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = theme.shadows.lg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = theme.shadows.sm;
            }}
            >
              <Group justify="space-between" align="flex-start">
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={500}>Taxa de Pagamento</Text>
                  <Text size="xl" fw={700} style={{ color: theme.colors.blue[6] }}>
                    {totalImoveis > 0 ? Math.round((imoveisPagos / totalImoveis) * 100) : 0}%
                  </Text>
                </div>
                <IconCheckCircle size={24} color={theme.colors.blue[6]} />
              </Group>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Gráficos */}
        <Grid gutter="lg" mb="xl">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card withBorder p="lg" radius="lg" style={{ 
              background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
              border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[3]}`,
              height: '300px'
            }}>
              <Title order={4} mb="md" style={{ color: theme.colors.blue[6] }}>Status dos Imóveis</Title>
              <ResponsiveContainer width="100%" height="200px">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
              <Group justify="center" mt="md">
                {statusData.map((item, index) => (
                  <Group key={index} gap="xs">
                    <Box style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: item.color }} />
                    <Text size="sm">{item.name}: {item.value}</Text>
                  </Group>
                ))}
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card withBorder p="lg" radius="lg" style={{ 
              background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
              border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[3]}`,
              height: '300px'
            }}>
              <Title order={4} mb="md" style={{ color: theme.colors.blue[6] }}>Vencimentos por Mês</Title>
              <ResponsiveContainer width="100%" height="200px">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="count" fill={theme.colors.blue[6]} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Modal de Formulário */}
        <Modal 
          opened={modalOpened} 
          onClose={closeModal} 
          title={
            <Title order={3} style={{ color: theme.colors.blue[6] }}>
              {form.values.id ? 'Editar Imóvel' : 'Adicionar Novo Imóvel'}
            </Title>
          }
          size="xl" 
          centered
          radius="lg"
          styles={{
            header: {
              background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
              borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[3]}`
            }
          }}
        >
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
              <TextInput 
                label="Proprietário" 
                placeholder="Nome do proprietário" 
                {...form.getInputProps('proprietario')}
                radius="md"
              />
              <TextInput 
                label="Sítio/Fazenda" 
                placeholder="Nome do imóvel" 
                {...form.getInputProps('sitio')}
                radius="md"
              />
            </SimpleGrid>
            <TextInput 
              mt="md" 
              label="Endereço" 
              placeholder="Endereço completo do imóvel" 
              {...form.getInputProps('endereco')}
              radius="md"
            />
            <SimpleGrid mt="md" cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
              <TextInput 
                label="CPF" 
                placeholder="000.000.000-00" 
                {...form.getInputProps('cpf')}
                radius="md"
              />
              <TextInput 
                label="Telefone" 
                placeholder="(00) 00000-0000" 
                {...form.getInputProps('telefone')}
                radius="md"
              />
            </SimpleGrid>
            <SimpleGrid mt="md" cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
              <TextInput 
                label="CCIR" 
                placeholder="Código do CCIR" 
                {...form.getInputProps('ccir')}
                radius="md"
              />
              <TextInput 
                label="ITR/CIB" 
                placeholder="Número do ITR/CIB" 
                {...form.getInputProps('itr')}
                radius="md"
              />
              <NumberInput
                label="Valor (R$)" 
                placeholder="1500.00" 
                precision={2} 
                step={50} 
                min={0}
                value={form.values.valor ?? ''}
                onChange={(value) => form.setFieldValue('valor', value === '' ? null : Number(value))}
                error={form.errors.valor}
                radius="md"
              />
            </SimpleGrid>
            <SimpleGrid mt="md" cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
              <Select 
                label="Status" 
                data={['PENDENTE', 'PAGO', 'ATRASADO']} 
                {...form.getInputProps('status_pagamento')}
                radius="md"
              />
              <DatePickerInput 
                locale="pt-br" 
                label="Data de Pagamento" 
                placeholder="Quando foi pago" 
                {...form.getInputProps('data_pagamento')}
                radius="md"
              />
              <DatePickerInput 
                locale="pt-br" 
                label="Data de Vencimento" 
                placeholder="Quando vence" 
                {...form.getInputProps('data_vencimento')}
                radius="md"
              />
            </SimpleGrid>
            <Group justify="flex-end" mt="xl">
              <Button variant="default" onClick={closeModal} radius="md">Cancelar</Button>
              <Button 
                type="submit" 
                loading={isSubmitting}
                radius="md"
                style={{ background: theme.colors.blue[6] }}
              >
                {form.values.id ? 'Atualizar' : 'Salvar'}
              </Button>
            </Group>
          </form>
        </Modal>

        {/* Modal de Confirmação de Exclusão */}
        <Modal 
          opened={deleteModalOpened} 
          onClose={closeDeleteModal} 
          title={
            <Title order={3} style={{ color: theme.colors.red[6] }}>Confirmar Exclusão</Title>
          }
          centered
          radius="lg"
          styles={{
            header: {
              background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
              borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[3]}`
            }
          }}
        >
          <Text size="lg" mb="xl">
            Tem certeza que deseja excluir o registro de <strong>{selectedImovel?.proprietario}</strong>?
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={closeDeleteModal} radius="md">Cancelar</Button>
            <Button 
              color="red" 
              onClick={handleDelete} 
              loading={isSubmitting}
              radius="md"
            >
              Excluir
            </Button>
          </Group>
        </Modal>
        
        {/* Tabela Principal */}
        <Card withBorder p="lg" radius="lg" style={{ 
          background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
          border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[3]}`,
          boxShadow: theme.shadows.md
        }}>
          <Group justify="space-between" mb="lg">
            <Title order={4} style={{ color: theme.colors.blue[6] }}>Lista de Imóveis</Title>
            <Group>
              <TextInput
                placeholder="Buscar por proprietário ou sítio..."
                icon={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                style={{ width: 300 }}
                radius="md"
              />
              <Button 
                onClick={openCreateModal} 
                leftSection={<IconPlus size={16} />}
                radius="md"
                style={{ background: theme.colors.blue[6] }}
              >
                Adicionar Imóvel
              </Button>
            </Group>
          </Group>
          
          <ScrollArea>
            <Table 
              striped 
              highlightOnHover 
              fontSize="sm" 
              verticalSpacing="sm"
              style={{
                '& thead th': {
                  background: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
                  fontWeight: 600,
                  color: theme.colorScheme === 'dark' ? theme.white : theme.colors.dark[7]
                }
              }}
            >
              <thead>
                <tr>
                  <th>Proprietário</th>
                  <th>Sítio</th>
                  <th>Telefone</th>
                  <th>Status</th>
                  <th>Vencimento</th>
                  <th>Valor</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7}>
                      <Center my="xl">
                        <Loader size="lg" color={theme.colors.blue[6]} />
                      </Center>
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <Center my="xl">
                        <Text size="lg" c="dimmed">Nenhum registro encontrado.</Text>
                      </Center>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((prop) => (
                    <tr key={prop.id} style={{ 
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = theme.colorScheme === 'dark' 
                        ? theme.colors.dark[6] 
                        : theme.colors.gray[1];
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                    >
                      <td style={{ fontWeight: 500 }}>{prop.proprietario}</td>
                      <td>{prop.sitio}</td>
                      <td>{prop.telefone}</td>
                      <td>
                        <Badge 
                          color={statusColors[prop.status_pagamento] || 'gray'} 
                          variant={theme.colorScheme === 'dark' ? 'light' : 'filled'}
                          radius="md"
                          size="sm"
                        >
                          {prop.status_pagamento}
                        </Badge>
                      </td>
                      <td>
                        {prop.data_vencimento 
                          ? new Date(prop.data_vencimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) 
                          : 'N/A'
                        }
                      </td>
                      <td style={{ fontWeight: 500 }}>
                        {prop.valor 
                          ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prop.valor) 
                          : 'N/A'
                        }
                      </td>
                      <td>
                        <Group spacing="xs" noWrap>
                          <ActionIcon 
                            title="Editar" 
                            color="blue" 
                            variant="light" 
                            onClick={() => openEditModal(prop)}
                            radius="md"
                            size="md"
                          >
                            <IconPencil size={16} />
                          </ActionIcon>
                          <ActionIcon 
                            title="Excluir" 
                            color="red" 
                            variant="light" 
                            onClick={() => openConfirmDeleteModal(prop)}
                            radius="md"
                            size="md"
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </ScrollArea>
        </Card>
      </Container>
    </AppShell>
  );
}