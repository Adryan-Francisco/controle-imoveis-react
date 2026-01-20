import {
  Modal,
  Table,
  Badge,
  Group,
  Button,
  Stack,
  Text,
  ActionIcon,
  Menu,
  Tooltip,
  Alert,
  Card,
  Grid,
  useMantineTheme,
  Progress,
  ThemeIcon,
  CopyButton,
  Paper,
  Modal as MantineModal,
  TextInput,
  NumberInput,
  Select,
  SimpleGrid,
  Loader,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import {
  IconAlertCircle,
  IconCheck,
  IconDownload,
  IconDots,
  IconCopy,
  IconCheck as IconCheckmark,
  IconFileText,
  IconClock,
  IconPlus,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useBoleto } from '../hooks/useBoleto';
import { useDisclosure } from '@mantine/hooks';

export function BoletoListModal({
  opened,
  onClose,
  company,
  onMarkAsPaid
}) {
  const theme = useMantineTheme();
  const { gerarBoleto, loading, baixarBoletoPDF } = useBoleto();
  const [gerandoBoleto, { open: abrirGerador, close: fecharGerador }] = useDisclosure(false);
  const [formData, setFormData] = useState({
    valor: '',
    vencimento: null,
    descricao: 'Pagamento de Mensalidade'
  });

  if (!company) return null;

  const boletos = company.boletos || [];
  const pendingBoletos = boletos.filter((b) => b.status === 'pendente');
  const paidBoletos = boletos.filter((b) => b.status === 'pago');
  
  const totalValue = boletos.reduce((acc, b) => acc + (b.amount || 0), 0);
  const pendingValue = pendingBoletos.reduce((acc, b) => acc + (b.amount || 0), 0);
  const paidValue = paidBoletos.reduce((acc, b) => acc + (b.amount || 0), 0);
  
  const progressValue = totalValue > 0 ? (paidValue / totalValue) * 100 : 0;

  const getStatusColor = (status) => {
    return status === 'pago' ? 'green' : 'yellow';
  };

  const getStatusLabel = (status) => {
    return status === 'pago' ? 'Pago' : 'Pendente';
  };
  
  const isOverdue = (dueDate) => {
    return dayjs(dueDate).isBefore(dayjs(), 'day');
  };

  const handleGerarBoleto = async () => {
    if (!formData.valor || !formData.vencimento) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const resultado = await gerarBoleto({
      empresa: company,
      valor: formData.valor,
      vencimento: formData.vencimento,
      descricao: formData.descricao
    });

    if (resultado.success) {
      setFormData({ valor: '', vencimento: null, descricao: 'Pagamento de Mensalidade' });
      fecharGerador();
      // Aqui você pode atualizar a lista de boletos
    }
  };

  const handleBaixarBoleto = async (boleto) => {
    await baixarBoletoPDF(boleto.id, `boleto-${boleto.id}.pdf`);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Boletos - ${company.name}`}
      size="xl"
      centered
      styles={{
        header: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
          borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[3]}`
        }
      }}
    >
      <Stack gap="lg">
        {/* Cards de Resumo */}
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder p="md" radius="lg" style={{
              background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
              borderColor: theme.colors.blue[4]
            }}>
              <Stack gap="xs" align="center">
                <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                  <IconFileText size={20} />
                </ThemeIcon>
                <div style={{ textAlign: 'center' }}>
                  <Text size="xs" c="dimmed">Total de Boletos</Text>
                  <Text fw={700} size="xl">{boletos.length}</Text>
                </div>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder p="md" radius="lg" style={{
              background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
              borderColor: theme.colors.yellow[4]
            }}>
              <Stack gap="xs" align="center">
                <ThemeIcon size="lg" radius="md" variant="light" color="yellow">
                  <IconClock size={20} />
                </ThemeIcon>
                <div style={{ textAlign: 'center' }}>
                  <Text size="xs" c="dimmed">Pendentes</Text>
                  <Text fw={700} size="xl">{pendingBoletos.length}</Text>
                </div>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder p="md" radius="lg" style={{
              background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
              borderColor: theme.colors.green[4]
            }}>
              <Stack gap="xs" align="center">
                <ThemeIcon size="lg" radius="md" variant="light" color="green">
                  <IconCheckmark size={20} />
                </ThemeIcon>
                <div style={{ textAlign: 'center' }}>
                  <Text size="xs" c="dimmed">Pagos</Text>
                  <Text fw={700} size="xl">{paidBoletos.length}</Text>
                </div>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder p="md" radius="lg" style={{
              background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
            }}>
              <Stack gap="xs" align="center">
                <ThemeIcon size="lg" radius="md" variant="light" color="violet">
                  <IconCheck size={20} />
                </ThemeIcon>
                <div style={{ textAlign: 'center' }}>
                  <Text size="xs" c="dimmed">% Pago</Text>
                  <Text fw={700} size="xl">{Math.round(progressValue)}%</Text>
                </div>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Barra de Progresso */}
        <Card withBorder p="md" radius="lg" style={{
          background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        }}>
          <Stack gap="xs">
            <Group justify="space-between">
              <Text fw={500} size="sm">Progresso de Pagamento</Text>
              <Text size="sm" c="dimmed">
                R$ {paidValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} de R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </Group>
            <Progress value={progressValue} color={progressValue === 100 ? 'green' : 'blue'} size="md" radius="md" />
          </Stack>
        </Card>

        {/* Alertas */}
        {pendingBoletos.length > 0 && (
          <Alert icon={<IconAlertCircle size={16} />} color="yellow" title="Aviso">
            Você tem {pendingBoletos.length} boleto(s) pendente(s) no valor de R$ {pendingValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Alert>
        )}

        {boletos.some(b => isOverdue(b.dueDate) && b.status === 'pendente') && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" title="Atenção">
            Você tem boleto(s) vencido(s)!
          </Alert>
        )}

        {boletos.length === 0 ? (
          <Stack align="center" justify="center" py={40}>
            <Text fw={500} c="dimmed">
              Nenhum boleto gerado
            </Text>
          </Stack>
        ) : (
          <Paper withBorder p="md" radius="lg" style={{
            background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
            overflow: 'auto'
          }}>
            <Table striped highlightOnHover size="sm">
              <Table.Thead style={{
                background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0]
              }}>
                <Table.Tr>
                  <Table.Th>Data</Table.Th>
                  <Table.Th>Vencimento</Table.Th>
                  <Table.Th>Valor</Table.Th>
                  <Table.Th>Código</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Ações</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {boletos.map((boleto) => (
                  <Table.Tr 
                    key={boleto.id}
                    style={{
                      background: isOverdue(boleto.dueDate) && boleto.status === 'pendente' 
                        ? (theme.colorScheme === 'dark' ? theme.colors.red[9] : theme.colors.red[0])
                        : undefined
                    }}
                  >
                    <Table.Td>
                      <Text size="sm">
                        {dayjs(boleto.createdAt).format('DD/MM/YYYY')}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Text size="sm">
                          {dayjs(boleto.dueDate).format('DD/MM/YYYY')}
                        </Text>
                        {isOverdue(boleto.dueDate) && boleto.status === 'pendente' && (
                          <Badge color="red" size="xs">Vencido</Badge>
                        )}
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text fw={500}>
                        R${' '}
                        {boleto.amount.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Text size="xs" ff="monospace" c="dimmed">
                          {boleto.barcode?.slice(0, 10)}...
                        </Text>
                        <CopyButton value={boleto.barcode || ''}>
                          {({ copied, copy }) => (
                            <Tooltip label={copied ? 'Copiado!' : 'Copiar código'} withArrow position="right">
                              <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                                {copied ? <IconCheckmark size={14} /> : <IconCopy size={14} />}
                              </ActionIcon>
                            </Tooltip>
                          )}
                        </CopyButton>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getStatusColor(boleto.status)}>
                        {getStatusLabel(boleto.status)}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Menu position="bottom-end">
                        <Menu.Target>
                          <ActionIcon variant="subtle" color="gray">
                            <IconDots size={14} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={<IconDownload size={14} />}
                          onClick={() => handleBaixarBoleto(boleto)}
                          >
                            Baixar PDF
                          </Menu.Item>
                          {boleto.status === 'pendente' && (
                            <Menu.Item
                              leftSection={<IconCheck size={14} />}
                              onClick={() => onMarkAsPaid(boleto.id)}
                              color="green"
                            >
                              Marcar Pago
                            </Menu.Item>
                          )}
                        </Menu.Dropdown>
                      </Menu>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        )}

        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            Total: {boletos.length} boleto(s) | Valor Total: R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          <Group gap="xs">
            <Button variant="default" onClick={onClose} radius="md">
              Fechar
            </Button>
            <Button 
              variant="light" 
              color="green"
              radius="md"
              leftSection={<IconPlus size={16} />}
              onClick={abrirGerador}
              disabled={paidBoletos.length === boletos.length}
            >
              Gerar Novo Boleto
            </Button>
          </Group>
        </Group>
      </Stack>

      {/* Modal para Gerar Boleto */}
      <MantineModal
        opened={gerandoBoleto}
        onClose={fecharGerador}
        title="Gerar Novo Boleto no Cora"
        centered
        size="md"
      >
        <Stack gap="md">
          <NumberInput
            label="Valor (R$)"
            placeholder="1000.00"
            precision={2}
            step={100}
            min={0}
            value={formData.valor}
            onChange={(value) => setFormData({ ...formData, valor: value })}
            required
          />

          <DateInput
            label="Data de Vencimento"
            placeholder="Selecione a data"
            value={formData.vencimento}
            onChange={(value) => setFormData({ ...formData, vencimento: value })}
            minDate={new Date()}
            required
          />

          <TextInput
            label="Descrição"
            placeholder="Pagamento de Mensalidade"
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.currentTarget.value })}
          />

          <Group justify="flex-end">
            <Button variant="default" onClick={fecharGerador}>
              Cancelar
            </Button>
            <Button 
              onClick={handleGerarBoleto}
              loading={loading}
              color="green"
            >
              Gerar Boleto
            </Button>
          </Group>
        </Stack>
      </MantineModal>
    </Modal>
  );
}
