// src/Dashboard.jsx

import React, { useState, useCallback } from 'react';
import { useAuth } from './AuthProvider';
import { useImoveis } from './hooks/useImoveis';
import { useStatistics } from './hooks/useStatistics';
import { useChartsData } from './hooks/useChartsData';
import { useResponsive } from './hooks/useResponsive';
import { StatisticsCards } from './components/StatisticsCards';
import { ChartsSection } from './components/ChartsSection';
import { DashboardHeader } from './components/DashboardHeader';
import { EnhancedNavbar } from './components/EnhancedNavbar';
import { DashboardFooter } from './components/DashboardFooter';

import { ResponsiveSidebar } from './components/ResponsiveSidebar';
import { ReportsPage } from './pages/ReportsPage';
import { ImoveisPage } from './pages/ImoveisPage';
import { CompaniesPage } from './pages/CompaniesPage';

// --- Importações do Mantine e de Ícones ---
import {
  AppShell, Container, Group, ActionIcon, Text, Title, Button, useMantineTheme, Box, Stack, Breadcrumbs, Anchor, Select
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { 
  IconSun, IconMoonStars, IconLogout, IconHome, IconMenu2, IconChevronRight
} from '@tabler/icons-react';
import 'dayjs/locale/pt-br';

export default function Dashboard({ toggleColorScheme, colorScheme }) {
  const theme = useMantineTheme();
  const { user, signOut } = useAuth();
  const { isMobile } = useResponsive();

  const [sidebarOpened, { open: openSidebar, close: closeSidebar }] = useDisclosure(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  // Estado para o ano selecionado
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  
  // Gerar lista de anos (últimos 5 anos + próximos 10 anos)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 15 }, (_, i) => {
    const year = currentYear - 5 + i;
    return { value: year.toString(), label: year.toString() };
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅 Bom dia';
    if (hour < 18) return '☀️ Boa tarde';
    return '🌙 Boa noite';
  };

  const getPageBreadcrumb = () => {
    const breadcrumbs = {
      dashboard: [{ title: 'Dashboard', href: '#' }],
      imoveis: [{ title: 'Dashboard', href: '#' }, { title: 'Imóveis', href: '#' }],
      companies: [{ title: 'Dashboard', href: '#' }, { title: 'Empresas', href: '#' }],
      reports: [{ title: 'Dashboard', href: '#' }, { title: 'Relatórios', href: '#' }],
    };
    return breadcrumbs[currentPage] || breadcrumbs.dashboard;
  };

  const { imoveis } = useImoveis(user, { page: 1, pageSize: 1000 }); // Carregar todos os dados

  // Filtrar imoveis por ano
  const imoveisFiltered = imoveis.filter(imovel => {
    if (!imovel.data_pagamento && !imovel.created_at) return true;
    const dateStr = imovel.data_pagamento || imovel.created_at;
    const year = new Date(dateStr).getFullYear().toString();
    return year === selectedYear;
  });

  // Função para navegação
  const handleNavigate = useCallback((page) => {
    setCurrentPage(page);
    if (isMobile) {
      closeSidebar();
    }
  }, [isMobile, closeSidebar]);
  
  const statistics = useStatistics(imoveisFiltered);
  const { statusData } = useChartsData(imoveisFiltered);

  return (
    <AppShell
      header={{ height: isMobile ? 60 : 70 }}
      padding="md"
      styles={(theme) => ({ 
        main: { 
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
          backgroundImage: theme.colorScheme === 'dark' 
            ? 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)'
            : 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%)',
          marginLeft: !isMobile ? (sidebarCollapsed ? '80px' : '280px') : '0',
          width: !isMobile ? (sidebarCollapsed ? 'calc(100% - 80px)' : 'calc(100% - 280px)') : '100%',
          transition: 'all 0.3s ease'
        } 
      })}
    >
      {/* Header para mobile */}
      {isMobile && (
        <AppShell.Header height={60} p="md" style={{ 
          background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
          backdropFilter: 'blur(10px)',
          boxShadow: theme.shadows.sm
        }}>
          <Group justify="space-between">
            <ActionIcon 
              onClick={openSidebar}
              variant="light"
              size="lg"
              radius="md"
            >
              <IconMenu2 size="1.2rem" />
            </ActionIcon>
            
            <Title order={3} style={{ color: theme.colors.blue[6] }}>
              Imóveis Rurais
            </Title>
            
            <ActionIcon 
              onClick={toggleColorScheme} 
              size="lg" 
              variant="light" 
              radius="md"
              style={{ 
                background: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
                border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`
              }}
            >
              {colorScheme === 'dark' ? <IconSun size="1.2rem" /> : <IconMoonStars size="1.2rem" />}
            </ActionIcon>
          </Group>
        </AppShell.Header>
      )}

      {/* Sidebar responsiva */}
      <ResponsiveSidebar
        opened={sidebarOpened}
        onClose={closeSidebar}
        user={user}
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
        signOut={signOut}
        isMobile={isMobile}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      {/* Enhanced Navbar */}
      <EnhancedNavbar
        currentPage={
          currentPage === 'dashboard' ? 'Dashboard' :
          currentPage === 'imoveis' ? 'Imóveis' :
          currentPage === 'companies' ? 'Empresas' :
          'Relatórios'
        }
        breadcrumbs={getPageBreadcrumb()}
        onRefresh={() => window.location.reload()}
        notificationsCount={statistics?.valorPendente > 0 ? 1 : 0}
        pendingItems={
          statistics?.valorPendente > 0
            ? [{
                title: '💰 Boletos Pendentes',
                description: `R$ ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(statistics.valorPendente)}`,
              }]
            : []
        }
        user={user}
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
        onLogout={signOut}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        yearOptions={yearOptions}
        isMobile={isMobile}
      />

      {currentPage === 'dashboard' ? (
        <Container size="xl" my="xl">
          {/* Dashboard Header with greeting and breadcrumbs */}
          <DashboardHeader 
            title="Dashboard"
            greeting={getGreeting()}
            breadcrumbs={getPageBreadcrumb()}
            colorScheme={colorScheme}
          />

          {/* Cards de Estatísticas */}
          <StatisticsCards statistics={statistics} />

          {/* Gráficos */}
          <ChartsSection statusData={statusData} />

          {/* Footer */}
          <DashboardFooter />
        </Container>
      ) : currentPage === 'companies' ? (
        <div>
          <Container size="xl" my="xl">
            <CompaniesPage />
            <DashboardFooter />
          </Container>
        </div>
      ) : currentPage === 'reports' ? (
        <div>
          <Container size="xl" my="xl">
            <ReportsPage 
              imoveis={imoveisFiltered}
              statistics={statistics}
              isMobile={isMobile}
              onBack={() => handleNavigate('dashboard')} 
            />
            <DashboardFooter />
          </Container>
        </div>
      ) : (
        <div>
          <Container size="xl" my="xl">
            <ImoveisPage 
              isMobile={isMobile}
              onBack={() => handleNavigate('dashboard')} 
            />
            <DashboardFooter />
          </Container>
        </div>
      )}
    </AppShell>
  );
}