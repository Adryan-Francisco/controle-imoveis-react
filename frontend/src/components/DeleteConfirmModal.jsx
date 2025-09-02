// src/components/DeleteConfirmModal.jsx
import React from 'react';
import { Modal, Title, Text, Group, Button, useMantineTheme } from '@mantine/core';

export function DeleteConfirmModal({ 
  opened, 
  onClose, 
  onConfirm, 
  isSubmitting, 
  selectedImovel 
}) {
  const theme = useMantineTheme();

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title="Confirmar Exclusão"
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
        <Button variant="default" onClick={onClose} radius="md">
          Cancelar
        </Button>
        <Button 
          color="red" 
          onClick={onConfirm} 
          loading={isSubmitting}
          radius="md"
        >
          Excluir
        </Button>
      </Group>
    </Modal>
  );
}
