// src/pages/ImoveisPage.jsx
import React, { useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { Container, Title, Text, Button, Group, Breadcrumbs, Anchor, useMantineTheme, Loader, Center } from '@mantine/core';
import { IconArrowLeft, IconHome, IconList } from '@tabler/icons-react';
import { useAuth } from '../AuthProvider';
import { useImoveis } from '../hooks/useImoveis';
import { useDisclosure } from '@mantine/hooks';
import { ImovelForm } from '../components/ImovelForm';
import { ImovelTable } from '../components/ImovelTable';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { AdvancedFilters } from '../components/AdvancedFilters';
import { Pagination } from '../components/Pagination';

// Lazy loading para componentes pesados
const LazyImovelForm = lazy(() => import('../components/ImovelForm').then(module => ({ default: module.ImovelForm })));
const LazyImovelTable = lazy(() => import('../components/ImovelTable').then(module => ({ default: module.ImovelTable })));
const LazyDeleteConfirmModal = lazy(() => import('../components/DeleteConfirmModal').then(module => ({ default: module.DeleteConfirmModal })));
const LazyAdvancedFilters = lazy(() => import('../components/AdvancedFilters').then(module => ({ default: module.AdvancedFilters })));

export function ImoveisPage({ isMobile, onBack }) {
  const theme = useMantineTheme();
  const { user } = useAuth();
  

  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [selectedImovel, setSelectedImovel] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    dateFrom: null,
    dateTo: null,
    valorMin: null,
    valorMax: null
  });

  const { 
    imoveis, 
    loading, 
    isSubmitting, 
    createImovel, 
    updateImovel, 
    deleteImovel,
    totalCount,
    totalPages
  } = useImoveis(user, { page: currentPage, pageSize, filters });


  // Função para lidar com mudanças de filtros
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset para primeira página ao filtrar
  }, []);

  // Função para limpar filtros
  const handleClearFilters = useCallback(() => {
    setFilters({
      search: '',
      status: '',
      dateFrom: null,
      dateTo: null,
      valorMin: null,
      valorMax: null
    });
    setCurrentPage(1); // Reset para primeira página ao limpar filtros
  }, []);

  // Função para mudar de página
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  // Função para mudar tamanho da página
  const handlePageSizeChange = useCallback((newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset para primeira página ao mudar tamanho
  }, []);

  // Os filtros agora são aplicados no backend através do hook useImoveis
  // Não precisamos mais filtrar localmente

  // Contar filtros ativos com memoização
  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(value => 
      value !== '' && value !== null && value !== undefined
    ).length;
  }, [filters]);

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

  // Memoizar breadcrumb para evitar re-renders
  const breadcrumbItems = useMemo(() => [
    { title: 'Dashboard', href: '#' },
    { title: 'Imóveis', href: '#' },
  ].map((item, index) => (
    <Anchor href={item.href} key={index} onClick={(event) => { event.preventDefault(); onBack(); }}>
      {item.title}
    </Anchor>
  )), [onBack]);

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
      
      <Breadcrumbs mb="lg">{breadcrumbItems}</Breadcrumbs>

      <Text size="lg" mb="xl">
        Gerencie todos os seus imóveis rurais. Adicione, edite ou remova registros conforme necessário.
      </Text>

      {/* Filtros Avançados */}
      <Suspense fallback={
        <Center py="xl">
          <Loader size="sm" />
        </Center>
      }>
        <LazyAdvancedFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          activeFiltersCount={activeFiltersCount}
          isMobile={isMobile}
        />
      </Suspense>

      {/* Modal de Formulário */}
      <Suspense fallback={
        <Center py="xl">
          <Loader size="sm" />
        </Center>
      }>
        <LazyImovelForm 
          opened={modalOpened}
          onClose={closeModal}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          initialValues={selectedImovel || {}}
        />
      </Suspense>

      {/* Modal de Confirmação de Exclusão */}
      <Suspense fallback={
        <Center py="xl">
          <Loader size="sm" />
        </Center>
      }>
        <LazyDeleteConfirmModal 
          opened={deleteModalOpened}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
          isSubmitting={isSubmitting}
          selectedImovel={selectedImovel}
        />
      </Suspense>
      
      {/* Tabela Principal */}
      <Suspense fallback={
        <Center py="xl">
          <Loader size="sm" />
        </Center>
      }>
        <LazyImovelTable 
          imoveis={imoveis}
          loading={loading}
          onAddClick={openCreateModal}
          onEditClick={openEditModal}
          onDeleteClick={openConfirmDeleteModal}
        />
      </Suspense>

      {/* Componente de Paginação */}
      {totalPages > 1 && (
        <Suspense fallback={
          <Center py="md">
            <Loader size="sm" />
          </Center>
        }>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalCount}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={[5, 10, 20, 50]}
            showPageSizeSelector={true}
            showItemCount={true}
            compact={isMobile}
          />
        </Suspense>
      )}
    </Container>
  );
}
