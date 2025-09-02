// src/pages/ImoveisPage.jsx
import React, { useState, useCallback } from 'react';
import { Container, Title, Text, Button, Group, Breadcrumbs, Anchor, useMantineTheme } from '@mantine/core';
import { IconArrowLeft, IconHome, IconList } from '@tabler/icons-react';
import { useAuth } from '../AuthProvider';
import { useImoveis } from '../hooks/useImoveis';
import { useDisclosure } from '@mantine/hooks';
import { ImovelForm } from '../components/ImovelForm';
import { ImovelTable } from '../components/ImovelTable';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { AdvancedFilters } from '../components/AdvancedFilters';

export function ImoveisPage({ isMobile, onBack }) {
  const theme = useMantineTheme();
  const { user } = useAuth();
  

  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [selectedImovel, setSelectedImovel] = useState(null);
  const [filteredImoveis, setFilteredImoveis] = useState([]);

  const { 
    imoveis, 
    loading, 
    isSubmitting, 
    createImovel, 
    updateImovel, 
    deleteImovel 
  } = useImoveis(user);

  // Inicializar imóveis filtrados
  React.useEffect(() => {
    setFilteredImoveis(imoveis);
  }, [imoveis]);

  // Função para lidar com filtros
  const handleFilter = useCallback((filtered) => {
    setFilteredImoveis(filtered);
  }, []);

  const handleSubmit = useCallback(async (values) => {
    const isEditing = !!values.id;
    
    if (isEditing) {
      const { id, user_id, ...dataToUpdate } = values;
      const result = await updateImovel(id, dataToUpdate);
      if (result.success) {
        closeModal();
      }
    } else {
      const { id, ...dataToInsert } = values;
      const result = await createImovel(dataToInsert);
      if (result.success) {
        closeModal();
      }
    }
  }, [updateImovel, createImovel, closeModal]);

  const handleDelete = useCallback(async () => {
    const result = await deleteImovel(selectedImovel.id);
    if (result.success) {
      closeDeleteModal();
      setSelectedImovel(null);
    }
  }, [deleteImovel, selectedImovel, closeDeleteModal]);

  const openCreateModal = useCallback(() => { 
    setSelectedImovel(null);
    openModal(); 
  }, [openModal]);
  
  const openEditModal = useCallback((imovel) => {
    setSelectedImovel(imovel);
    openModal();
  }, [openModal]);
  
  const openConfirmDeleteModal = useCallback((imovel) => { 
    setSelectedImovel(imovel); 
    openDeleteModal(); 
  }, [openDeleteModal]);

  const items = [
    { title: 'Dashboard', href: '#' },
    { title: 'Imóveis', href: '#' },
  ].map((item, index) => (
    <Anchor href={item.href} key={index} onClick={(event) => { event.preventDefault(); onBack(); }}>
      {item.title}
    </Anchor>
  ));

  return (
    <Container size="xl" my="xl">
      <Group justify="space-between" mb="md">
        <Title order={2} style={{ color: theme.colors.blue[6] }}>
          <Group gap="xs">
            <IconList size={24} />
            Lista de Imóveis
          </Group>
        </Title>
        <Button 
          leftSection={<IconArrowLeft size={16} />} 
          variant="light" 
          onClick={onBack}
        >
          Voltar ao Dashboard
        </Button>
      </Group>
      
      <Breadcrumbs mb="lg">{items}</Breadcrumbs>

      <Text size="lg" mb="xl">
        Gerencie todos os seus imóveis rurais. Adicione, edite ou remova registros conforme necessário.
      </Text>

      {/* Filtros Avançados */}
      <AdvancedFilters 
        imoveis={imoveis}
        onFilter={handleFilter}
        isMobile={isMobile}
      />

      {/* Modal de Formulário */}
      <ImovelForm 
        opened={modalOpened}
        onClose={closeModal}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        initialValues={selectedImovel || {}}
      />

      {/* Modal de Confirmação de Exclusão */}
      <DeleteConfirmModal 
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        isSubmitting={isSubmitting}
        selectedImovel={selectedImovel}
      />
      
      {/* Tabela Principal */}
      <ImovelTable 
        imoveis={filteredImoveis}
        loading={loading}
        onAddClick={openCreateModal}
        onEditClick={openEditModal}
        onDeleteClick={openConfirmDeleteModal}
      />
    </Container>
  );
}
