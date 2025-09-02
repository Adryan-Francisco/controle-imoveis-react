// src/components/ImovelForm.jsx
import React from 'react';
import {
  Modal, Title, SimpleGrid, TextInput, Select, NumberInput, Button, Group,
  useMantineTheme
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { FormattedInput } from './FormattedInput';
import { useImovelForm } from '../hooks/useImovelForm';

export function ImovelForm({ 
  opened, 
  onClose, 
  onSubmit, 
  isSubmitting, 
  initialValues = {} 
}) {
  const theme = useMantineTheme();
  const { form, resetForm, setFormValues, formatFormData } = useImovelForm(initialValues || {});

  React.useEffect(() => {
    if (opened) {
      if (initialValues && initialValues.id) {
        setFormValues(initialValues);
      } else {
        resetForm();
      }
    }
  }, [opened, initialValues?.id]); // Removidas dependências que causam loop

  const handleSubmit = (values) => {
    const formattedData = formatFormData(values);
    onSubmit(formattedData);
  };

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title={form.values.id ? 'Editar Imóvel' : 'Adicionar Novo Imóvel'}
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
            required
            aria-describedby={form.errors.proprietario ? 'proprietario-error' : undefined}
          />
          <TextInput 
            label="Sítio/Fazenda" 
            placeholder="Nome do imóvel" 
            {...form.getInputProps('sitio')}
            radius="md"
            aria-describedby={form.errors.sitio ? 'sitio-error' : undefined}
          />
        </SimpleGrid>
        
        <TextInput 
          mt="md" 
          label="Endereço" 
          placeholder="Endereço completo do imóvel" 
          {...form.getInputProps('endereco')}
          radius="md"
          aria-describedby={form.errors.endereco ? 'endereco-error' : undefined}
        />
        
        <SimpleGrid mt="md" cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
          <FormattedInput 
            type="cpf"
            label="CPF" 
            placeholder="000.000.000-00" 
            {...form.getInputProps('cpf')}
            radius="md"
            aria-describedby={form.errors.cpf ? 'cpf-error' : undefined}
          />
          <FormattedInput 
            type="phone"
            label="Telefone" 
            placeholder="(00) 00000-0000" 
            {...form.getInputProps('telefone')}
            radius="md"
            aria-describedby={form.errors.telefone ? 'telefone-error' : undefined}
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
            aria-describedby={form.errors.valor ? 'valor-error' : undefined}
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
          <Button variant="default" onClick={onClose} radius="md">
            Cancelar
          </Button>
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
  );
}
