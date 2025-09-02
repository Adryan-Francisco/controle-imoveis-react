// src/pages/ReportsPage.jsx
import React from 'react';
import { Container, Title, Text, Button, Group, Breadcrumbs, Anchor, useMantineTheme } from '@mantine/core';
import { IconArrowLeft, IconHome } from '@tabler/icons-react';
import { ReportsExport } from '../components/ReportsExport';

export function ReportsPage({ imoveis, statistics, isMobile, onBack }) {
  const theme = useMantineTheme();

  const items = [
    { title: 'Dashboard', href: '#' },
    { title: 'Relatórios', href: '#' },
  ].map((item, index) => (
    <Anchor href={item.href} key={index} onClick={(event) => { event.preventDefault(); onBack(); }}>
      {item.title}
    </Anchor>
  ));

  return (
    <Container size="xl" my="xl">
      <Group justify="space-between" mb="md">
        <Title order={2} style={{ color: theme.colors.blue[6] }}>Relatórios e Exportação</Title>
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
        Aqui você pode gerar relatórios detalhados e exportar os dados dos seus imóveis.
      </Text>

      <ReportsExport 
        imoveis={imoveis} 
        statistics={statistics} 
        isMobile={isMobile} 
      />
    </Container>
  );
}
