// src/components/ImovelTable.jsx
import React, { memo } from 'react';
import {
  Card, Group, Title, Button, Table, Center, Text, ScrollArea,
  ActionIcon, Badge, useMantineTheme
} from '@mantine/core';
import { IconPlus, IconPencil, IconTrash } from '@tabler/icons-react';
import { TableLoadingSpinner } from './LoadingSpinner';
import { useAccessibility } from '../hooks/useAccessibility';

export const ImovelTable = memo(function ImovelTable({ 
  imoveis, 
  loading, 
  onAddClick, 
  onEditClick, 
  onDeleteClick 
}) {
  const theme = useMantineTheme();
  const { generateId, announce } = useAccessibility();
  const tableId = generateId('imoveis-table');

  const statusColors = { PAGO: 'green', PENDENTE: 'orange', ATRASADO: 'red' };

  // Ordenar imóveis por proprietário em ordem alfabética com memoização otimizada
  const sortedImoveis = React.useMemo(() => {
    if (!imoveis || imoveis.length === 0) return [];
    
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
          aria-label="Adicionar novo imóvel"
        >
          Adicionar Imóvel
        </Button>
      </Group>
      
      <ScrollArea>
        <Table 
          id={tableId}
          striped 
          highlightOnHover 
          fontSize="sm" 
          verticalSpacing="sm"
          role="table"
          aria-label="Lista de imóveis"
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
            <tr role="row">
              <th scope="col" role="columnheader">Proprietário</th>
              <th scope="col" role="columnheader">Sítio</th>
              <th scope="col" role="columnheader">Telefone</th>
              <th scope="col" role="columnheader">Status</th>
              <th scope="col" role="columnheader">Vencimento</th>
              <th scope="col" role="columnheader">Valor</th>
              <th scope="col" role="columnheader">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr role="row">
                <td colSpan={7} role="cell">
                  <TableLoadingSpinner />
                </td>
              </tr>
            ) : sortedImoveis.length === 0 ? (
              <tr role="row">
                <td colSpan={7} role="cell">
                  <Center my="xl">
                    <Text size="lg" c="dimmed">Nenhum registro encontrado.</Text>
                  </Center>
                </td>
              </tr>
            ) : (
              sortedImoveis.map((imovel, index) => (
                <tr 
                  key={imovel.id}
                  role="row"
                  aria-rowindex={index + 2} // +2 porque o cabeçalho é linha 1
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
                  <td role="cell" style={{ fontWeight: 500 }}>{imovel.proprietario}</td>
                  <td role="cell">{imovel.sitio}</td>
                  <td role="cell">{imovel.telefone}</td>
                  <td role="cell">
                    <Badge 
                      color={statusColors[imovel.status_pagamento] || 'gray'} 
                      variant={theme.colorScheme === 'dark' ? 'light' : 'filled'}
                      radius="md"
                      size="sm"
                      aria-label={`Status: ${imovel.status_pagamento}`}
                    >
                      {imovel.status_pagamento}
                    </Badge>
                  </td>
                  <td role="cell">
                    {imovel.data_vencimento 
                      ? new Date(imovel.data_vencimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) 
                      : 'N/A'
                    }
                  </td>
                  <td role="cell" style={{ fontWeight: 500 }}>
                    {imovel.valor 
                      ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(imovel.valor) 
                      : 'N/A'
                    }
                  </td>
                  <td role="cell">
                    <Group spacing="xs" wrap="nowrap" role="group" aria-label="Ações do imóvel">
                      <ActionIcon 
                        title="Editar" 
                        color="blue" 
                        variant="light" 
                        onClick={() => onEditClick(imovel)}
                        radius="md"
                        size="md"
                        aria-label={`Editar imóvel de ${imovel.proprietario}`}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onEditClick(imovel);
                          }
                        }}
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
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onDeleteClick(imovel);
                          }
                        }}
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
