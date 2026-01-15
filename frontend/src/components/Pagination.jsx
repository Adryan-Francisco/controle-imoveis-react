// src/components/Pagination.jsx
import React from 'react';
import {
  Group,
  Button,
  Text,
  Select,
  Stack,
  useMantineTheme,
  Center,
  Box
} from '@mantine/core';
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight
} from '@tabler/icons-react';

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  showPageSizeSelector = true,
  showItemCount = true,
  compact = false
}) {
  const theme = useMantineTheme();
  
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };
  
  const handlePageSizeChange = (newPageSize) => {
    onPageSizeChange(Number(newPageSize));
  };
  
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  
  if (totalPages <= 1 && !showItemCount) {
    return null;
  }
  
  const renderPageButton = (page, label, icon, disabled = false) => (
    <Button
      key={page}
      variant={page === currentPage ? 'filled' : 'light'}
      size="sm"
      onClick={() => handlePageChange(page)}
      disabled={disabled}
      leftSection={icon}
      style={{
        minWidth: compact ? '32px' : 'auto',
        height: compact ? '32px' : 'auto',
      }}
    >
      {!compact && label}
    </Button>
  );
  
  const renderPageNumbers = () => {
    const pages = [];
    const delta = 2;
    
    // Primeira página
    if (currentPage > delta + 1) {
      pages.push(renderPageButton(1, '1'));
      if (currentPage > delta + 2) {
        pages.push(
          <Text key="ellipsis1" size="sm" c="dimmed" px="xs">
            ...
          </Text>
        );
      }
    }
    
    // Páginas ao redor da atual
    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages, currentPage + delta);
      i++
    ) {
      pages.push(renderPageButton(i, i.toString()));
    }
    
    // Última página
    if (currentPage < totalPages - delta) {
      if (currentPage < totalPages - delta - 1) {
        pages.push(
          <Text key="ellipsis2" size="sm" c="dimmed" px="xs">
            ...
          </Text>
        );
      }
      pages.push(renderPageButton(totalPages, totalPages.toString()));
    }
    
    return pages;
  };
  
  return (
    <Box>
      <Group justify="space-between" align="center" wrap="wrap" gap="md">
        {/* Informações do item */}
        {showItemCount && (
          <Text size="sm" c="dimmed">
            Mostrando {startItem}-{endItem} de {totalItems} itens
          </Text>
        )}
        
        {/* Seletor de tamanho da página */}
        {showPageSizeSelector && (
          <Group gap="xs" align="center">
            <Text size="sm">Itens por página:</Text>
            <Select
              value={pageSize.toString()}
              onChange={handlePageSizeChange}
              data={pageSizeOptions.map(size => ({
                value: size.toString(),
                label: size.toString()
              }))}
              size="sm"
              w={80}
            />
          </Group>
        )}
      </Group>
      
      {/* Controles de paginação */}
      {totalPages > 1 && (
        <Center mt="md">
          <Group gap="xs">
            {/* Primeira página */}
            {renderPageButton(1, 'Primeira', <IconChevronsLeft size={16} />, currentPage === 1)}
            
            {/* Página anterior */}
            {renderPageButton(
              currentPage - 1,
              'Anterior',
              <IconChevronLeft size={16} />,
              currentPage === 1
            )}
            
            {/* Números das páginas */}
            {renderPageNumbers()}
            
            {/* Próxima página */}
            {renderPageButton(
              currentPage + 1,
              'Próxima',
              <IconChevronRight size={16} />,
              currentPage === totalPages
            )}
            
            {/* Última página */}
            {renderPageButton(
              totalPages,
              'Última',
              <IconChevronsRight size={16} />,
              currentPage === totalPages
            )}
          </Group>
        </Center>
      )}
    </Box>
  );
}





