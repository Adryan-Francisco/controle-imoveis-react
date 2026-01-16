import { useState } from 'react';
import {
  Container,
  Button,
  Group,
  Title,
  Stack,
  Paper,
  Text,
  Box,
  Tabs,
  Badge,
  SimpleGrid,
  Card,
  LoadingOverlay,
} from '@mantine/core';
import {
  IconPlus,
  IconBuilding,
  IconFileText,
  IconClock,
  IconCheck,
  IconRefresh,
} from '@tabler/icons-react';
import { useCompanies } from '../hooks/useCompanies';
import { useCompaniesSupabase } from '../hooks/useCompaniesSupabase';
import { useAuth } from '../AuthProvider';
import { CompanyForm } from '../components/CompanyForm';
import { CompanyTable } from '../components/CompanyTable';
import { BoletoModal } from '../components/BoletoModal';
import { BoletoListModal } from '../components/BoletoListModal';
import { MonthlyFeeControl } from '../components/MonthlyFeeControl';
import dayjs from 'dayjs';

export function CompaniesPage() {
  const { user } = useAuth();
  
  // Usar Supabase se usuário está autenticado, senão usar dados locais
  const useLocalData = !user?.id;
  const { companies, loading, addCompany, updateCompany, deleteCompany, addBoleto, markBoletoAsPaid, refresh } =
    useLocalData 
      ? useCompanies(true) 
      : useCompaniesSupabase(user?.id, false);

  const [formOpened, setFormOpened] = useState(false);
  const [boletoModalOpened, setBoletoModalOpened] = useState(false);
  const [boletoListOpened, setBoletoListOpened] = useState(false);
  const [monthlyFeeOpened, setMonthlyFeeOpened] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [editingCompany, setEditingCompany] = useState(null);

  // Estatísticas
  const totalCompanies = companies.length;
  const totalMEI = companies.filter((c) => c.regimeType === 'mei').length;
  const totalSimples = companies.filter((c) => c.regimeType === 'simples_nacional').length;
  const pendingBoletos = companies.reduce(
    (acc, c) => acc + (c.boletos?.filter((b) => b.status === 'pendente').length || 0),
    0
  );
  const totalBoletos = companies.reduce((acc, c) => acc + (c.boletos?.length || 0), 0);

  const handleFormSubmit = (values) => {
    if (editingCompany) {
      updateCompany(editingCompany.id, values);
      setEditingCompany(null);
    } else {
      addCompany(values);
    }
    setFormOpened(false);
  };

  const handleGenerateBoleto = (boletoData) => {
    if (selectedCompany) {
      addBoleto(selectedCompany.id, boletoData);
    }
  };

  const handleEditCompany = (company) => {
    setEditingCompany(company);
    setFormOpened(true);
  };

  const handleOpenBoletoModal = (company) => {
    setSelectedCompany(company);
    setBoletoModalOpened(true);
  };

  const handleOpenBoletoListModal = (company) => {
    setSelectedCompany(company);
    setBoletoListOpened(true);
  };

  const handleMarkAsPaid = (boletoId) => {
    if (selectedCompany) {
      markBoletoAsPaid(selectedCompany.id, boletoId);
    }
  };

  const handleDownloadBoleto = (boleto) => {
    // Implementar download de boleto em PDF
    console.log('Baixar boleto:', boleto);
  };

  const handleOpenMonthlyFeeControl = (company) => {
    setSelectedCompany(company);
    setMonthlyFeeOpened(true);
  };

  const handleAddMonthlyFee = (companyId, feeData) => {
    if (selectedCompany) {
      addBoleto(companyId, {
        amount: feeData.amount,
        dueDate: feeData.dueDate,
        month: feeData.month,
        year: feeData.year,
        type: 'mensalidade',
      });
    }
  };

  const handleUpdateMonthlyFee = (companyId, feeData) => {
    // Implementar atualização de mensalidade
    console.log('Atualizar mensalidade:', companyId, feeData);
  };

  const handleMarkMonthlyFeeAsPaid = (companyId, month, year) => {
    if (selectedCompany) {
      const boletosFromMonth = selectedCompany.boletos?.filter(
        b => dayjs(b.dueDate).month() + 1 === parseInt(month) &&
          dayjs(b.dueDate).year() === year
      );
      
      if (boletosFromMonth && boletosFromMonth.length > 0) {
        markBoletoAsPaid(companyId, boletosFromMonth[0].id);
      }
    }
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={1}>Empresas</Title>
            <Text c="dimmed" mt="xs">
              Gerencie suas empresas e mensalidades
            </Text>
          </div>
          <Group>
            <Button
              variant="subtle"
              leftSection={<IconRefresh size={18} />}
              onClick={refresh}
              loading={loading}
            >
              Atualizar
            </Button>
            <Button
              leftSection={<IconPlus size={18} />}
              onClick={() => {
                setEditingCompany(null);
                setFormOpened(true);
              }}
              size="md"
            >
              Nova Empresa
            </Button>
          </Group>
        </Group>

        {/* Estatísticas */}
        {totalCompanies > 0 && (
          <SimpleGrid cols={{ base: 2, sm: 2, md: 5 }} spacing="md">
            <Card withBorder padding="md" radius="md">
              <Group justify="space-between" mb="xs">
                <Text size="sm" fw={500} c="dimmed">
                  Total
                </Text>
                <IconBuilding size={18} />
              </Group>
              <Text fw={600} size="lg">
                {totalCompanies}
              </Text>
            </Card>

            <Card withBorder padding="md" radius="md">
              <Group justify="space-between" mb="xs">
                <Text size="sm" fw={500} c="dimmed">
                  MEI
                </Text>
                <Badge size="sm" color="blue">
                  {totalMEI}
                </Badge>
              </Group>
              <Text fw={600} size="lg">
                {totalMEI}
              </Text>
            </Card>

            <Card withBorder padding="md" radius="md">
              <Group justify="space-between" mb="xs">
                <Text size="sm" fw={500} c="dimmed">
                  Simples
                </Text>
                <Badge size="sm" color="green">
                  {totalSimples}
                </Badge>
              </Group>
              <Text fw={600} size="lg">
                {totalSimples}
              </Text>
            </Card>

            <Card withBorder padding="md" radius="md">
              <Group justify="space-between" mb="xs">
                <Text size="sm" fw={500} c="dimmed">
                  Boletos
                </Text>
                <IconFileText size={18} />
              </Group>
              <Text fw={600} size="lg">
                {totalBoletos}
              </Text>
            </Card>

            <Card withBorder padding="md" radius="md" bg="yellow.0">
              <Group justify="space-between" mb="xs">
                <Text size="sm" fw={500} c="dimmed">
                  Pendentes
                </Text>
                <IconClock size={18} />
              </Group>
              <Text fw={600} size="lg" c="orange">
                {pendingBoletos}
              </Text>
            </Card>
          </SimpleGrid>
        )}

        {/* Tabela */}
        <Paper withBorder radius="md" p="md">
          <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: 'md' }} />
          <Tabs defaultValue="all">
            <Tabs.List>
              <Tabs.Tab value="all" leftSection={<IconBuilding size={14} />}>
                Todas ({totalCompanies})
              </Tabs.Tab>
              <Tabs.Tab value="mei" leftSection={<Badge size="sm" color="blue">M</Badge>}>
                MEI ({totalMEI})
              </Tabs.Tab>
              <Tabs.Tab value="simples" leftSection={<Badge size="sm" color="green">S</Badge>}>
                Simples Nacional ({totalSimples})
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="all" pt="xl">
              <CompanyTable
                companies={companies}
                onEdit={handleEditCompany}
                onDelete={deleteCompany}
                onGenerateBoleto={handleOpenBoletoModal}
                onViewBoletos={handleOpenBoletoListModal}
                onViewMonthlyFees={handleOpenMonthlyFeeControl}
              />
            </Tabs.Panel>

            <Tabs.Panel value="mei" pt="xl">
              <CompanyTable
                companies={companies.filter((c) => c.regimeType === 'mei')}
                onEdit={handleEditCompany}
                onDelete={deleteCompany}
                onGenerateBoleto={handleOpenBoletoModal}
                onViewBoletos={handleOpenBoletoListModal}
                onViewMonthlyFees={handleOpenMonthlyFeeControl}
              />
            </Tabs.Panel>

            <Tabs.Panel value="simples" pt="xl">
              <CompanyTable
                companies={companies.filter((c) => c.regimeType === 'simples_nacional')}
                onEdit={handleEditCompany}
                onDelete={deleteCompany}
                onGenerateBoleto={handleOpenBoletoModal}
                onViewBoletos={handleOpenBoletoListModal}
                onViewMonthlyFees={handleOpenMonthlyFeeControl}
              />
            </Tabs.Panel>
          </Tabs>
        </Paper>
      </Stack>

      {/* Modals */}
      <CompanyForm
        opened={formOpened}
        onClose={() => {
          setFormOpened(false);
          setEditingCompany(null);
        }}
        onSubmit={handleFormSubmit}
        initialValues={editingCompany}
      />

      <BoletoModal
        opened={boletoModalOpened}
        onClose={() => {
          setBoletoModalOpened(false);
          setSelectedCompany(null);
        }}
        company={selectedCompany}
        onGenerateBoleto={handleGenerateBoleto}
      />

      <BoletoListModal
        opened={boletoListOpened}
        onClose={() => {
          setBoletoListOpened(false);
          setSelectedCompany(null);
        }}
        company={selectedCompany}
        onMarkAsPaid={handleMarkAsPaid}
        onDownloadBoleto={handleDownloadBoleto}
      />

      <MonthlyFeeControl
        company={selectedCompany}
        isOpened={monthlyFeeOpened}
        onClose={() => {
          setMonthlyFeeOpened(false);
          setSelectedCompany(null);
        }}
        onAddFee={handleAddMonthlyFee}
        onUpdateFee={handleUpdateMonthlyFee}
        onMarkAsPaid={handleMarkMonthlyFeeAsPaid}
      />
    </Container>
  );
}
