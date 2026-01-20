import { useState } from 'react';
import {
  Modal,
  Table,
  Badge,
  Group,
  Button,
  Stack,
  SimpleGrid,
  Card,
  Text,
  Tooltip,
  ActionIcon,
  Select,
  NumberInput,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import {
  IconCheck,
  IconX,
  IconClock,
  IconDownload,
  IconPlus,
} from '@tabler/icons-react';
import dayjs from 'dayjs';

const MONTHS = [
  { value: '01', label: 'Janeiro' },
  { value: '02', label: 'Fevereiro' },
  { value: '03', label: 'Março' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Maio' },
  { value: '06', label: 'Junho' },
  { value: '07', label: 'Julho' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
];

export function MonthlyFeeControl({ company, isOpened, onClose, onAddFee, onMarkAsPaid }) {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [feeAmount, setFeeAmount] = useState(company?.monthlyFee || 0);
  const [dueDate, setDueDate] = useState(null);

  if (!company) return null;

  // Gerar controle mensal para o ano atual
  const currentYear = dayjs().year();
  const monthlyFees = company.monthlyFees || {};

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pago':
        return <Badge color="green" leftSection={<IconCheck size={12} />}>Pago</Badge>;
      case 'pendente':
        return <Badge color="yellow" leftSection={<IconClock size={12} />}>Pendente</Badge>;
      case 'atrasado':
        return <Badge color="red" leftSection={<IconX size={12} />}>Atrasado</Badge>;
      default:
        return <Badge color="gray">-</Badge>;
    }
  };

  const handleAddFee = () => {
    if (selectedMonth && feeAmount && dueDate) {
      onAddFee(company.id, {
        month: selectedMonth,
        year: currentYear,
        amount: feeAmount,
        dueDate: dueDate.toISOString().split('T')[0],
        status: 'pendente',
        createdAt: new Date().toISOString(),
      });
      setSelectedMonth(null);
      setFeeAmount(company.monthlyFee);
      setDueDate(null);
    }
  };

  const handleMarkAsPaid = (month) => {
    onMarkAsPaid(company.id, month, currentYear);
  };

  return (
    <Modal opened={isOpened} onClose={onClose} title={`Controle de Mensalidades - ${company.name}`} size="lg">
      <Stack gap="md">
        {/* Adicionar Nova Mensalidade */}
        <Card withBorder padding="md" radius="md" bg="blue.0">
          <Stack gap="sm">
            <Text weight={500} size="sm">Adicionar Nova Mensalidade</Text>
            <Group grow>
              <Select
                label="Mês"
                placeholder="Selecione o mês"
                data={MONTHS}
                value={selectedMonth}
                onChange={setSelectedMonth}
                searchable
              />
              <NumberInput
                label="Valor (R$)"
                placeholder="0.00"
                value={feeAmount}
                onChange={setFeeAmount}
                decimalScale={2}
                fixedDecimalScale
                min={0}
              />
            </Group>
            <DateInput
              label="Data de Vencimento"
              placeholder="Selecione a data"
              value={dueDate}
              onChange={setDueDate}
            />
            <Group justify="flex-end">
              <Button
                onClick={handleAddFee}
                disabled={!selectedMonth || !feeAmount || !dueDate}
                leftSection={<IconPlus size={16} />}
              >
                Adicionar
              </Button>
            </Group>
          </Stack>
        </Card>

        {/* Tabela de Mensalidades */}
        <div style={{ overflowX: 'auto' }}>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Mês</Table.Th>
                <Table.Th>Valor</Table.Th>
                <Table.Th>Vencimento</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Ações</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {MONTHS.map((month) => {
                const fee = monthlyFees[month.value];
                const dueDate = fee?.dueDate ? dayjs(fee.dueDate) : null;
                const isPastDue = dueDate && dueDate.isBefore(dayjs()) && fee?.status === 'pendente';
                const status = isPastDue ? 'atrasado' : fee?.status || null;

                return (
                  <Table.Tr key={month.value}>
                    <Table.Td weight={500}>{month.label}</Table.Td>
                    <Table.Td>
                      {fee?.amount ? `R$ ${fee.amount.toFixed(2)}` : '-'}
                    </Table.Td>
                    <Table.Td>
                      {dueDate ? dueDate.format('DD/MM/YYYY') : '-'}
                    </Table.Td>
                    <Table.Td>
                      {status ? getStatusBadge(status) : <Badge color="gray">Sem registro</Badge>}
                    </Table.Td>
                    <Table.Td>
                      <Group gap={6} wrap="nowrap">
                        {fee?.status === 'pendente' && (
                          <Tooltip label="Marcar como pago">
                            <ActionIcon
                              size="sm"
                              variant="light"
                              color="green"
                              onClick={() => handleMarkAsPaid(month.value)}
                            >
                              <IconCheck size={14} />
                            </ActionIcon>
                          </Tooltip>
                        )}
                        {fee && (
                          <Tooltip label="Gerar boleto">
                            <ActionIcon
                              size="sm"
                              variant="light"
                              color="blue"
                              onClick={() => onAddFee(company.id, { ...fee, month: month.value })}
                            >
                              <IconDownload size={14} />
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </div>

        {/* Resumo */}
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          <Card withBorder>
            <Stack gap={4}>
              <Text size="sm" color="dimmed">Total Pago</Text>
              <Text size="lg" weight={500} color="green">
                R$ {
                  Object.values(monthlyFees)
                    .filter(f => f?.status === 'pago')
                    .reduce((acc, f) => acc + (f?.amount || 0), 0)
                    .toFixed(2)
                }
              </Text>
            </Stack>
          </Card>
          <Card withBorder>
            <Stack gap={4}>
              <Text size="sm" color="dimmed">Total Pendente</Text>
              <Text size="lg" weight={500} color="orange">
                R$ {
                  Object.values(monthlyFees)
                    .filter(f => f?.status === 'pendente' || (dayjs(f?.dueDate).isBefore(dayjs()) && f?.status === 'pendente'))
                    .reduce((acc, f) => acc + (f?.amount || 0), 0)
                    .toFixed(2)
                }
              </Text>
            </Stack>
          </Card>
          <Card withBorder>
            <Stack gap={4}>
              <Text size="sm" color="dimmed">Total Anual</Text>
              <Text size="lg" weight={500}>
                R$ {
                  Object.values(monthlyFees)
                    .reduce((acc, f) => acc + (f?.amount || 0), 0)
                    .toFixed(2)
                }
              </Text>
            </Stack>
          </Card>
        </SimpleGrid>

        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            Fechar
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
