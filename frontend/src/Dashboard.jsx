// src/Dashboard.jsx

import React, { useState, useMemo, useCallback } from 'react';
import { useAuth } from './AuthProvider';
import { useImoveis } from './hooks/useImoveis';
import { useStatistics } from './hooks/useStatistics';
import { useChartsData } from './hooks/useChartsData';
import { useDebounce } from './hooks/useDebounce';
import { useResponsive } from './hooks/useResponsive';
import { StatisticsCards } from './components/StatisticsCards';
import { ChartsSection } from './components/ChartsSection';

import { ResponsiveSidebar } from './components/ResponsiveSidebar';
import { ReportsPage } from './pages/ReportsPage';
import { ImoveisPage } from './pages/ImoveisPage';
import { CompaniesPage } from './pages/CompaniesPage';

// --- Importações do Mantine e de Ícones ---
import {
  AppShell, Container, Group, ActionIcon, Text, Title, Button, useMantineTheme
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { 
  IconSun, IconMoonStars, IconLogout, IconHome, IconMenu2
} from '@tabler/icons-react';
import 'dayjs/locale/pt-br';

export default function Dashboard({ toggleColorScheme, colorScheme }) {
  const theme = useMantineTheme();
  const { user, signOut } = useAuth();
  const { isMobile } = useResponsive();

  const [sidebarOpened, { open: openSidebar, close: closeSidebar }] = useDisclosure(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarMinimized, setSidebarMinimized] = useState(false);

  const { imoveis } = useImoveis(user, { page: 1, pageSize: 1000 }); // Carregar todos os dados

  // Função para navegação
  const handleNavigate = useCallback((page) => {
    setCurrentPage(page);
    if (isMobile) {
      closeSidebar();
    }
  }, [isMobile, closeSidebar]);
  
  const statistics = useStatistics(imoveis);
  const { statusData } = useChartsData(imoveis);



  return (
    <AppShell
      header={{ height: isMobile ? 60 : 70 }}
      padding="sm"
      styles={(theme) => ({ 
        main: { 
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
          backgroundImage: theme.colorScheme === 'dark' 
            ? 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)'
            : 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%)',
          marginLeft: !isMobile ? (sidebarMinimized ? '80px' : '280px') : '0',
          width: !isMobile ? (sidebarMinimized ? 'calc(100% - 80px)' : 'calc(100% - 280px)') : '100%',
          overflow: 'auto',
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
        minimized={sidebarMinimized}
        onMinimizedChange={setSidebarMinimized}
      />
      {currentPage === 'dashboard' ? (
        <Container size="100%" my="md" px="sm" fluid>
          {/* Cards de Estatísticas */}
          <StatisticsCards statistics={statistics} />

          {/* Gráficos */}
          <ChartsSection statusData={statusData} />
        </Container>
      ) : currentPage === 'companies' ? (
        <CompaniesPage />
      ) : currentPage === 'reports' ? (
        <ReportsPage 
          imoveis={imoveis}
          statistics={statistics}
          isMobile={isMobile}
          onBack={() => handleNavigate('dashboard')} 
        />
      ) : (
        <ImoveisPage 
          isMobile={isMobile}
          onBack={() => handleNavigate('dashboard')} 
        />
      )}
    </AppShell>
  );
}