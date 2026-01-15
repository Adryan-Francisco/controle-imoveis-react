import { useState } from 'react';
import {
  Table,
  Group,
  Button,
  Badge,
  ActionIcon,
  Menu,
  Text,
  Tooltip,
  Modal,
  Stack,
} from '@mantine/core';
import {
  IconEdit,
  IconTrash,
  IconFileText,
  IconEye,
  IconDots,
} from '@tabler/icons-react';
import dayjs from 'dayjs';

export function CompanyTable({
  companies,
  onEdit,
  onDelete,
  onGenerateBoleto,
  onViewBoletos,
}) {
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const handleDelete = (id) => {
    onDelete(id);
    setDeleteConfirmId(null);
  };

  const getRegimeLabel = (regime) => {
    return regime === 'mei' ? 'MEI' : 'Simples Nacional';
  };

  const getRegimeColor = (regime) => {
    return regime === 'mei' ? 'blue' : 'green';
  };

  if (companies.length === 0) {
    return (
      <Stack align="center" justify="center" py={60}>
        <Text fw={500} c="dimmed">
          Nenhuma empresa cadastrada
        </Text>
        <Text size="sm" c="dimmed">
          Clique em "Nova Empresa" para começar
        </Text>
      </Stack>
    );
  }

  return (
    <>
      <Table striped highlightOnHover responsive>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Empresa</Table.Th>
            <Table.Th>CNPJ</Table.Th>
            <Table.Th>Regime</Table.Th>
            <Table.Th>Mensalidade</Table.Th>
            <Table.Th>Ult. Boleto</Table.Th>
            <Table.Th>Boletos</Table.Th>
            <Table.Th>Ações</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {companies.map((company) => (
            <Table.Tr key={company.id}>
              <Table.Td>
                <Stack gap={0}>
                  <Text fw={500}>{company.name}</Text>
                  <Text size="xs" c="dimmed">
                    {company.responsibleName || 'N/A'}
                  </Text>
                </Stack>
              </Table.Td>
              <Table.Td>
                <Text size="sm" ff="monospace">
                  {company.cnpj}
                </Text>
              </Table.Td>
              <Table.Td>
                <Badge color={getRegimeColor(company.regimeType)}>
                  {getRegimeLabel(company.regimeType)}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Text fw={500}>
                  R${' '}
                  {company.monthlyFee.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm">
                  {company.lastBoletoDate
                    ? dayjs(company.lastBoletoDate).format('DD/MM/YYYY')
                    : '-'}
                </Text>
              </Table.Td>
              <Table.Td>
                <Tooltip label="Visualizar boletos">
                  <ActionIcon
                    variant="light"
                    onClick={() => onViewBoletos(company)}
                  >
                    <IconEye size={16} />
                  </ActionIcon>
                </Tooltip>
              </Table.Td>
              <Table.Td>
                <Menu position="bottom-end">
                  <Menu.Target>
                    <ActionIcon variant="subtle" color="gray">
                      <IconDots size={16} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={<IconFileText size={14} />}
                      onClick={() => onGenerateBoleto(company)}
                    >
                      Gerar Boleto
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconEdit size={14} />}
                      onClick={() => onEdit(company)}
                    >
                      Editar
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                      leftSection={<IconTrash size={14} />}
                      color="red"
                      onClick={() => setDeleteConfirmId(company.id)}
                    >
                      Deletar
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      {/* Modal de confirmação de exclusão */}
      <Modal
        opened={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirmar Exclusão"
        centered
      >
        <Stack gap="md">
          <Text>
            Tem certeza que deseja deletar esta empresa? Esta ação não pode ser
            desfeita.
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setDeleteConfirmId(null)}>
              Cancelar
            </Button>
            <Button
              color="red"
              onClick={() => handleDelete(deleteConfirmId)}
            >
              Deletar
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
