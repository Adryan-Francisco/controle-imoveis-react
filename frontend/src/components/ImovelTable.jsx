// src/components/ImovelTable.jsx
import React, { memo } from 'react';
import {
  Card, Group, Title, Button, Table, Center, Text, ScrollArea,
  ActionIcon, Badge, useMantineTheme
} from '@mantine/core';
import { IconPlus, IconPencil, IconTrash } from '@tabler/icons-react';
import { TableLoadingSpinner } from './LoadingSpinner';

export const ImovelTable = memo(function ImovelTable({ 
  imoveis, 
  loading, 
  onAddClick, 
  onEditClick, 
  onDeleteClick 
}) {
  const theme = useMantineTheme();

  const statusColors = { PAGO: 'green', PENDENTE: 'orange', ATRASADO: 'red' };

  // Ordenar imóveis por proprietário em ordem alfabética
  const sortedImoveis = React.useMemo(() => {
    return [...imoveis].sort((a, b) => {
      const nomeA = (a.proprietario || '').toUpperCase();
      const nomeB = (b.proprietario || '').toUpperCase();
      return nomeA.localeCompare(nomeB, 'pt-BR');
    });
  }, [imoveis]);

  return (
    <Card 
      withBorder 
      p="lg" 
      radius="lg" 
      style={{ 
        background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[3]}`,
        boxShadow: theme.shadows.md
      }}
    >
      <Group justify="space-between" mb="lg">
        <Title order={4} style={{ color: theme.colors.blue[6] }}>
          Lista de Imóveis
        </Title>
        <Button 
          onClick={onAddClick} 
          leftSection={<IconPlus size={16} />}
          radius="md"
          style={{ background: theme.colors.blue[6] }}
        >
          Adicionar Imóvel
        </Button>
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
              color: theme.colorScheme === 'dark' ? theme.white : theme.colors.dark[7],
              whiteSpace: 'nowrap'
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
                  <TableLoadingSpinner />
                </td>
              </tr>
            ) : sortedImoveis.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <Center my="xl">
                    <Text size="lg" c="dimmed">Nenhum registro encontrado.</Text>
                  </Center>
                </td>
              </tr>
            ) : (
              sortedImoveis.map((imovel) => (
                <tr 
                  key={imovel.id} 
                  style={{ 
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
                  <td style={{ fontWeight: 500 }}>{imovel.proprietario}</td>
                  <td>{imovel.sitio}</td>
                  <td>{imovel.telefone}</td>
                  <td>
                    <Badge 
                      color={statusColors[imovel.status_pagamento] || 'gray'} 
                      variant={theme.colorScheme === 'dark' ? 'light' : 'filled'}
                      radius="md"
                      size="sm"
                    >
                      {imovel.status_pagamento}
                    </Badge>
                  </td>
                  <td>
                    {imovel.data_vencimento 
                      ? new Date(imovel.data_vencimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) 
                      : 'N/A'
                    }
                  </td>
                  <td style={{ fontWeight: 500 }}>
                    {imovel.valor 
                      ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(imovel.valor) 
                      : 'N/A'
                    }
                  </td>
                  <td>
                    <Group spacing="xs" wrap="nowrap">
                      <ActionIcon 
                        title="Editar" 
                        color="blue" 
                        variant="light" 
                        onClick={() => onEditClick(imovel)}
                        radius="md"
                        size="md"
                        aria-label={`Editar imóvel de ${imovel.proprietario}`}
                      >
                        <IconPencil size={16} />
                      </ActionIcon>
                      <ActionIcon 
                        title="Excluir" 
                        color="red" 
                        variant="light" 
                        onClick={() => onDeleteClick(imovel)}
                        radius="md"
                        size="md"
                        aria-label={`Excluir imóvel de ${imovel.proprietario}`}
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
  );
});
