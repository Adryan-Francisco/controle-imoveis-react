// src/components/ImovelForm.jsx
import React, { useState, useCallback } from 'react';
import {
  Modal, Title, SimpleGrid, TextInput, Select, NumberInput, Button, Group,
  useMantineTheme, Stack, Autocomplete, Loader, Text
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { FormattedInput } from './FormattedInput';
import { useImovelForm } from '../hooks/useImovelForm';
import { useImoveisAutocomplete } from '../hooks/useImoveisAutocomplete';
import { useAuth } from '../AuthProvider';
import { IconSearch } from '@tabler/icons-react';

export function ImovelForm({ 
  opened, 
  onClose, 
  onSubmit, 
  isSubmitting, 
  initialValues = {} 
}) {
  const theme = useMantineTheme();
  const { user } = useAuth();
  const { form, resetForm, setFormValues, formatFormData } = useImovelForm(initialValues || {});
  const { searchByLetter, getImovelById } = useImoveisAutocomplete();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (opened) {
      if (initialValues && initialValues.id) {
        setFormValues(initialValues);
      } else {
        resetForm();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, initialValues?.id]);

  // Handler para detectar % + letra e buscar autocomplete
  const handleProprietarioChange = useCallback(async (value) => {
    form.setFieldValue('proprietario', value);
    setSearchResults([]);

    // Detectar padrão "%X" onde X é uma letra
    const match = value.match(/^%([a-zA-Z])$/);
    if (match && user?.id) {
      const letter = match[1];
      setLoading(true);
      try {
        const results = await searchByLetter(letter, user.id);
        const autocompleteData = results.map(imovel => ({
          value: String(imovel.id), // Converter para string
          label: `${imovel.proprietario} - ${imovel.sitio}`,
          data: imovel
        }));
        setSearchResults(autocompleteData);
      } finally {
        setLoading(false);
      }
    }
  }, [form, searchByLetter, user?.id]);

  // Handler para selecionar um imóvel do autocomplete
  const handleSelectImovel = useCallback(async (selectedId) => {
    if (user?.id) {
      setLoading(true);
      try {
        const imovel = await getImovelById(String(selectedId), user.id);
        if (imovel) {
          setFormValues(imovel);
          setSearchResults([]);
          form.setFieldValue('proprietario', imovel.proprietario);
        }
      } finally {
        setLoading(false);
      }
    }
  }, [getImovelById, user?.id, setFormValues, form]);

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
        {/* Dica de Busca */}
        {!form.values.id && (
          <Stack gap="xs" mb="md" p="sm" style={{
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.blue[0],
            borderRadius: theme.radius.md,
            border: `1px solid ${theme.colors.blue[4]}`
          }}>
            <Group gap="xs">
              <IconSearch size={16} color={theme.colors.blue[6]} />
              <Text size="sm" c="blue">
                💡 Digite <strong>%</strong> + uma letra para buscar cadastros existentes (ex: <code>%J</code>)
              </Text>
            </Group>
          </Stack>
        )}

        <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
          <Autocomplete
            label="Proprietário" 
            placeholder="Nome do proprietário ou %J para buscar por letra" 
            data={searchResults}
            value={form.values.proprietario || ''}
            onChange={handleProprietarioChange}
            onOptionSubmit={handleSelectImovel}
            icon={loading ? <Loader size="1rem" /> : undefined}
            radius="md"
            required
            maxDropdownHeight={200}
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
