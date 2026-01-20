# Full Implementation Example

## Step-by-Step Integration of All Visual Components

---

## 1. Update ImovelTable.jsx

### Original Code (Before):
```jsx
// Around line 20
const statusColors = { PAGO: 'green', PENDENTE: 'orange', ATRASADO: 'red' };

// Around line 80 (in render method):
<Badge color={statusColors[imovel.status]}>
  {imovel.status}
</Badge>
```

### Updated Code (After):
```jsx
// At top with other imports
import { StatusBadge } from './StatusBadge';

// Remove this line (no longer needed):
// const statusColors = { PAGO: 'green', PENDENTE: 'orange', ATRASADO: 'red' };

// Replace Badge with StatusBadge around line 80:
<StatusBadge status={imovel.status || 'ATIVO'} size="sm" />
```

---

## 2. Update CompanyTable.jsx

### Same Pattern:
```jsx
// Add import
import { StatusBadge } from './StatusBadge';

// Replace any Badge with status with:
<StatusBadge status={company.status || 'ATIVO'} size="sm" />
```

---

## 3. Update Loading States

### Before:
```jsx
import { LoadingSpinner } from './LoadingSpinner';

{loading && <LoadingSpinner />}
```

### After:
```jsx
import { SkeletonLoader } from './SkeletonLoader';

{loading && <SkeletonLoader type="table" count={5} />}
{/* or */}
{loading && <SkeletonLoader type="card" count={3} />}
{/* or */}
{loading && <SkeletonLoader type="chart" count={2} />}
```

---

## 4. Update Card Components

### Before:
```jsx
<Card withBorder p="lg" radius="lg">
  <Title order={4}>My Card</Title>
  <Text>Some content</Text>
</Card>
```

### After:
```jsx
import { EnhancedCard } from './EnhancedCard';

<EnhancedCard
  gradient
  hover
  hoverLift
  shadow="md"
  withBorder
  p="lg"
  radius="lg"
>
  <Title order={4}>My Card</Title>
  <Text>Some content</Text>
</EnhancedCard>
```

---

## 5. Add Animations to Forms

### Before:
```jsx
<Box>
  <TextInput label="Name" />
  <TextInput label="Email" />
  <Button mt="md">Submit</Button>
</Box>
```

### After:
```jsx
<Box className="animate-slideUp">
  <TextInput label="Name" />
  <TextInput label="Email" />
  <Button mt="md">Submit</Button>
</Box>
```

---

## 6. Apply Table Styling

### Before:
```jsx
<Table striped highlightOnHover>
  {/* table content */}
</Table>
```

### After:
```jsx
<Table className="table-zebra" striped highlightOnHover>
  {/* table content */}
</Table>
```

---

## 7. Complete ImovelTable Example

```jsx
// src/components/ImovelTable.jsx
import React, { memo } from 'react';
import {
  Card, Group, Title, Button, Table, Center, Text, ScrollArea,
  ActionIcon, useMantineTheme
} from '@mantine/core';
import { IconPlus, IconPencil, IconTrash } from '@tabler/icons-react';
import { TableLoadingSpinner } from './LoadingSpinner';
import { StatusBadge } from './StatusBadge';
import { SkeletonLoader } from './SkeletonLoader';
import { useAccessibility } from '../hooks/useAccessibility';

export const ImovelTable = memo(function ImovelTable({ 
  imoveis, 
  loading, 
  onAddClick, 
  onEditClick, 
  onDeleteClick 
}) {
  const theme = useMantineTheme();
  const { generateId } = useAccessibility();
  const tableId = generateId('imoveis-table');

  // Ordenar imóveis por proprietário
  const sortedImoveis = React.useMemo(() => {
    if (!imoveis || imoveis.length === 0) return [];
    
    return [...imoveis].sort((a, b) => {
      const nomeA = (a.proprietario || '').toUpperCase();
      const nomeB = (b.proprietario || '').toUpperCase();
      return nomeA.localeCompare(nomeB, 'pt-BR');
    });
  }, [imoveis]);

  if (loading) {
    return <SkeletonLoader type="table" count={5} />;
  }

  return (
    <Card 
      withBorder 
      p="lg" 
      radius="lg" 
      style={{ 
        background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[3]}`,
        boxShadow: theme.shadows.md
      }}
    >
      <Group justify="space-between" mb="lg">
        <Title order={4} style={{ color: theme.colors.blue[6] }}>
          Lista de Imóveis
        </Title>
        <Button 
          leftSection={<IconPlus size={16} />}
          onClick={onAddClick}
          size="sm"
        >
          Novo
        </Button>
      </Group>

      <ScrollArea>
        <Table 
          className="table-zebra"
          striped 
          highlightOnHover 
          id={tableId}
          role="table"
          aria-label="Tabela de Imóveis"
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Proprietário</Table.Th>
              <Table.Th>Localização</Table.Th>
              <Table.Th>Área</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sortedImoveis.length > 0 ? (
              sortedImoveis.map((imovel) => (
                <Table.Tr key={imovel.id}>
                  <Table.Td>{imovel.proprietario}</Table.Td>
                  <Table.Td>{imovel.municipio}</Table.Td>
                  <Table.Td>{imovel.area_total} ha</Table.Td>
                  <Table.Td>
                    <StatusBadge 
                      status={imovel.status || 'ATIVO'} 
                      size="sm" 
                    />
                  </Table.Td>
                  <Table.Td>
                    <Group gap={0}>
                      <ActionIcon 
                        variant="subtle"
                        onClick={() => onEditClick(imovel)}
                        title="Editar"
                        aria-label={`Editar ${imovel.proprietario}`}
                      >
                        <IconPencil size={16} />
                      </ActionIcon>
                      <ActionIcon 
                        variant="subtle" 
                        color="red"
                        onClick={() => onDeleteClick(imovel)}
                        title="Deletar"
                        aria-label={`Deletar ${imovel.proprietario}`}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Center py="xl">
                    <Text c="dimmed">Nenhum imóvel encontrado</Text>
                  </Center>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Card>
  );
});

export default ImovelTable;
```

---

## 8. Complete Dashboard Integration Example

```jsx
// src/Dashboard.jsx - Already Updated ✅

// Key additions:
import { DashboardHeader } from './components/DashboardHeader';
import { EnhancedNavbar } from './components/EnhancedNavbar';
import { DashboardFooter } from './components/DashboardFooter';

// In render, before StatisticsCards:
<DashboardHeader 
  title="Dashboard"
  greeting={getGreeting()}
  breadcrumbs={getPageBreadcrumb()}
  colorScheme={colorScheme}
/>

// After Sidebar:
<EnhancedNavbar
  currentPage={...}
  breadcrumbs={getPageBreadcrumb()}
  onRefresh={() => window.location.reload()}
  notificationsCount={0}
  user={user}
  colorScheme={colorScheme}
/>

// After ChartsSection:
<DashboardFooter />
```

---

## 9. Complete CompanyTable Example

```jsx
// src/components/CompanyTable.jsx
import React, { memo } from 'react';
import {
  Card, Group, Title, Button, Table, Center, Text, ScrollArea,
  ActionIcon, useMantineTheme
} from '@mantine/core';
import { IconPlus, IconPencil, IconTrash } from '@tabler/icons-react';
import { StatusBadge } from './StatusBadge';
import { SkeletonLoader } from './SkeletonLoader';

export const CompanyTable = memo(function CompanyTable({
  companies,
  loading,
  onAddClick,
  onEditClick,
  onDeleteClick
}) {
  const theme = useMantineTheme();

  if (loading) {
    return <SkeletonLoader type="table" count={5} />;
  }

  return (
    <Card
      withBorder
      p="lg"
      radius="lg"
      style={{
        background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        boxShadow: theme.shadows.md
      }}
    >
      <Group justify="space-between" mb="lg">
        <Title order={4} style={{ color: theme.colors.blue[6] }}>
          Empresas
        </Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={onAddClick}
        >
          Nova Empresa
        </Button>
      </Group>

      <ScrollArea>
        <Table className="table-zebra" striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Razão Social</Table.Th>
              <Table.Th>CNPJ</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {companies?.length > 0 ? (
              companies.map((company) => (
                <Table.Tr key={company.id}>
                  <Table.Td>{company.razao_social}</Table.Td>
                  <Table.Td>{company.cnpj}</Table.Td>
                  <Table.Td>{company.email}</Table.Td>
                  <Table.Td>
                    <StatusBadge 
                      status={company.status || 'ATIVO'} 
                      size="sm"
                    />
                  </Table.Td>
                  <Table.Td>
                    <Group gap={0}>
                      <ActionIcon
                        variant="subtle"
                        onClick={() => onEditClick(company)}
                      >
                        <IconPencil size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => onDeleteClick(company)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Center py="xl">
                    <Text c="dimmed">Nenhuma empresa encontrada</Text>
                  </Center>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Card>
  );
});

export default CompanyTable;
```

---

## 10. Testing Checklist

### Visual Testing:
- [ ] StatisticsCards show gradients and hover effects
- [ ] StatusBadges display correct colors and icons
- [ ] DashboardHeader shows greeting and breadcrumbs
- [ ] EnhancedNavbar sticky at top with breadcrumbs
- [ ] DashboardFooter displays at bottom
- [ ] Tables have zebra striping
- [ ] Animations smooth on interactions
- [ ] Skeleton loaders appear during loading

### Dark Mode Testing:
- [ ] All colors adapt to dark theme
- [ ] Text remains readable
- [ ] Shadows are appropriate
- [ ] Gradients are visible

### Responsive Testing (Mobile):
- [ ] Navbar collapses properly
- [ ] Tables scroll horizontally
- [ ] Animations perform well
- [ ] Reducedmotion respected
- [ ] Touch interactions work

### Accessibility Testing:
- [ ] Keyboard navigation works
- [ ] Screen readers read content
- [ ] Focus indicators visible
- [ ] Color contrast sufficient
- [ ] ARIA labels present

---

## 11. Performance Verification

### Check Browser DevTools:

1. **Lighthouse Report:**
   - Performance: > 90
   - Accessibility: > 95
   - Best Practices: > 90
   - SEO: > 90

2. **Network Tab:**
   - CSS file: visual-improvements.css loads once
   - No duplicate component imports
   - Cache enabled for assets

3. **Performance Tab:**
   - No long tasks (> 50ms)
   - Smooth animations (60 fps)
   - Fast TTI (Time to Interactive)

---

## 12. Deployment Checklist

- [ ] All imports added correctly
- [ ] No missing dependencies
- [ ] CSS framework imported
- [ ] Components tested in development
- [ ] Dark mode tested
- [ ] Responsive tested
- [ ] Accessibility validated
- [ ] Performance acceptable
- [ ] No console errors
- [ ] Build succeeds

---

## Summary

**Files Modified:**
- App.jsx (added CSS import)
- Dashboard.jsx (added header, navbar, footer)
- ImovelTable.jsx (StatusBadge, SkeletonLoader) - *ready*
- CompanyTable.jsx (StatusBadge, SkeletonLoader) - *ready*

**New Components Created:**
- StatusBadge.jsx ✅
- DashboardHeader.jsx ✅
- EnhancedNavbar.jsx ✅
- DashboardFooter.jsx ✅
- SkeletonLoader.jsx ✅
- EnhancedCard.jsx ✅

**CSS Framework:**
- visual-improvements.css ✅

**Documentation:**
- IMPLEMENTATION_STATUS.md ✅
- INTEGRATION_GUIDE.md ✅
- COMPONENTS_USAGE.md ✅

---

**Status: 90% Complete - Ready for Phase 2 Table Integration**

Next: Execute table updates and test all changes
