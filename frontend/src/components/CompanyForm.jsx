import { useState } from 'react';
import {
  Modal,
  Button,
  TextInput,
  Select,
  NumberInput,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconBuilding } from '@tabler/icons-react';

export function CompanyForm({ opened, onClose, onSubmit, initialValues = null }) {
  const isEditing = initialValues !== null;

  const form = useForm({
    initialValues: {
      name: initialValues?.name || '',
      cnpj: initialValues?.cnpj || '',
      regimeType: initialValues?.regimeType || 'mei', // 'mei' ou 'simples_nacional'
      monthlyFee: initialValues?.monthlyFee || '',
      dueDay: initialValues?.dueDay || '5',
      responsibleName: initialValues?.responsibleName || '',
      responsiblePhone: initialValues?.responsiblePhone || '',
      email: initialValues?.email || '',
      ...initialValues,
    },
    validate: {
      name: (value) => (!value ? 'Nome é obrigatório' : null),
      cnpj: (value) => {
        if (!value) return 'CNPJ é obrigatório';
        const clean = value.replace(/\D/g, '');
        return clean.length === 14 ? null : 'CNPJ deve ter 14 dígitos';
      },
      regimeType: (value) => (!value ? 'Regime tributário é obrigatório' : null),
      monthlyFee: (value) => {
        if (!value) return 'Mensalidade é obrigatória';
        return value > 0 ? null : 'Mensalidade deve ser maior que 0';
      },
      dueDay: (value) => {
        const day = parseInt(value);
        return day >= 1 && day <= 31 ? null : 'Dia deve estar entre 1 e 31';
      },
      email: (value) => {
        if (!value) return 'Email é obrigatório';
        return /^\S+@\S+$/.test(value) ? null : 'Email inválido';
      },
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    onSubmit(values);
    form.reset();
    onClose();
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IconBuilding size={20} />
          <Text fw={600}>{isEditing ? 'Editar Empresa' : 'Nova Empresa'}</Text>
        </Group>
      }
      size="lg"
      centered
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Nome da Empresa"
            placeholder="Ex: Imóveis Brasil"
            {...form.getInputProps('name')}
            required
          />

          <TextInput
            label="CNPJ"
            placeholder="00.000.000/0000-00"
            {...form.getInputProps('cnpj')}
            required
          />

          <Select
            label="Regime Tributário"
            placeholder="Selecione o regime"
            data={[
              { value: 'mei', label: 'MEI - Microempreendedor Individual' },
              { value: 'simples_nacional', label: 'Simples Nacional' },
            ]}
            {...form.getInputProps('regimeType')}
            required
          />

          <NumberInput
            label="Mensalidade (R$)"
            placeholder="0.00"
            min={0}
            step={0.01}
            decimalSeparator=","
            thousandsSeparator="."
            {...form.getInputProps('monthlyFee')}
            required
          />

          <NumberInput
            label="Dia do Vencimento"
            placeholder="5"
            min={1}
            max={31}
            {...form.getInputProps('dueDay')}
            required
          />

          <TextInput
            label="Nome do Responsável"
            placeholder="Nome completo"
            {...form.getInputProps('responsibleName')}
          />

          <TextInput
            label="Telefone"
            placeholder="(00) 00000-0000"
            {...form.getInputProps('responsiblePhone')}
          />

          <TextInput
            label="Email"
            placeholder="empresa@example.com"
            type="email"
            {...form.getInputProps('email')}
            required
          />

          <Group justify="flex-end" mt="xl">
            <Button variant="default" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
