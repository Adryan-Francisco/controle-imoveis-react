// Quick Reference: Visual Components Usage

// ============================================
// 1. STATUS BADGE
// ============================================

import { StatusBadge } from './components/StatusBadge';

// Usage in tables:
<StatusBadge status="PAGO" size="md" />
<StatusBadge status="PENDENTE" size="sm" />
<StatusBadge status="ATRASADO" size="lg" />
<StatusBadge status="CANCELADO" size="md" />
<StatusBadge status="ATIVO" size="md" />
<StatusBadge status="INATIVO" size="sm" />

// Output: Color-coded badge with icon and emoji
// PAGO ✅ (Green), PENDENTE ⏳ (Yellow), ATRASADO 🚨 (Red)
// CANCELADO ✗ (Red), ATIVO ✓ (Green), INATIVO ✗ (Gray)


// ============================================
// 2. DASHBOARD HEADER
// ============================================

import { DashboardHeader } from './components/DashboardHeader';

<DashboardHeader
  title="Dashboard"
  greeting="🌅 Bom dia, João"
  breadcrumbs={[
    { title: 'Dashboard', href: '/' },
    { title: 'Imóveis', href: '/imoveis' },
  ]}
  colorScheme="dark"
/>

// Features:
// - Dynamic greeting with time-based emoji
// - Breadcrumb navigation with icons
// - Current date in pt-BR format
// - Stats preview grid
// - Refresh button with tooltip


// ============================================
// 3. ENHANCED NAVBAR
// ============================================

import { EnhancedNavbar } from './components/EnhancedNavbar';

<EnhancedNavbar
  currentPage="Imóveis"
  breadcrumbs={[
    { title: 'Dashboard', href: '/' },
    { title: 'Imóveis', href: '#' },
  ]}
  onRefresh={() => window.location.reload()}
  notificationsCount={3}
  user={{ email: 'user@example.com' }}
  colorScheme="dark"
/>

// Features:
// - Breadcrumb navigation
// - Home button
// - Refresh button (with spinner animation)
// - Notifications badge with count
// - Settings & profile quick access
// - Sticky position (top)


// ============================================
// 4. DASHBOARD FOOTER
// ============================================

import { DashboardFooter } from './components/DashboardFooter';

<DashboardFooter />

// Features:
// - About section
// - Quick links with icons
// - System status with pulse animation
// - Version display (1.0.0)
// - Copyright info
// - Social/support links


// ============================================
// 5. SKELETON LOADER
// ============================================

import { SkeletonLoader } from './components/SkeletonLoader';

// For cards:
{loading && <SkeletonLoader type="card" count={3} animate={true} />}

// For tables:
{loading && <SkeletonLoader type="table" count={5} />}

// For charts:
{loading && <SkeletonLoader type="chart" count={2} />}

// For avatars:
{loading && <SkeletonLoader type="avatar" count={4} />}

// For text:
{loading && <SkeletonLoader type="text" count={1} />}

// Output: Shimmer animation placeholder matching content type


// ============================================
// 6. ENHANCED CARD
// ============================================

import { EnhancedCard } from './components/EnhancedCard';

<EnhancedCard
  gradient
  hover
  hoverLift
  shadow="md"
  withBorder
  p="lg"
  radius="lg"
>
  <Title order={4}>Card Title</Title>
  <Text>Card content goes here</Text>
</EnhancedCard>

// Props:
// - gradient: boolean (adds gradient background)
// - hover: boolean (enables hover effects)
// - hoverLift: boolean (lifts up on hover with shadow)
// - shadow: 'xs'|'sm'|'md'|'lg'|'xl'
// - gradientAngle: number (default 135)
// - animated: boolean (adds shine effect)


// ============================================
// 7. STATISTICS CARDS (ENHANCED)
// ============================================

import { StatisticsCards } from './components/StatisticsCards';

const statistics = [
  {
    title: 'Total de Imóveis',
    value: 42,
    color: 'blue',
    icon: '🏠',
    bgGradient: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)'
  },
  // ... more stats
];

<StatisticsCards statistics={statistics} />

// Features:
// - Gradient backgrounds
// - Hover elevation effect
// - Progress bars
// - Icon and value display
// - Dark mode support


// ============================================
// 8. CSS ANIMATION CLASSES
// ============================================

// Apply to any element:

<Box className="animate-slideUp">Content</Box>
<Box className="animate-slideDown">Content</Box>
<Box className="animate-slideLeft">Content</Box>
<Box className="animate-slideRight">Content</Box>
<Box className="animate-scaleIn">Content</Box>
<Box className="animate-bounce">Content</Box>

// Custom animations available:
// - slideUp, slideDown, slideLeft, slideRight: 0.3s
// - scaleIn: 0.3s
// - bounce: 0.6s
// - pulse: 2s (built-in Mantine)
// - shimmer: 2s (loading effect)
// - spin: 1s (rotation)


// ============================================
// 9. TABLE WITH ZEBRA STRIPING
// ============================================

<Table className="table-zebra" striped highlightOnHover>
  <Table.Thead>
    <Table.Tr>
      <Table.Th>Nome</Table.Th>
      <Table.Th>Status</Table.Th>
      <Table.Th>Ações</Table.Th>
    </Table.Tr>
  </Table.Thead>
  <Table.Tbody>
    {items.map((item) => (
      <Table.Tr key={item.id}>
        <Table.Td>{item.name}</Table.Td>
        <Table.Td>
          <StatusBadge status={item.status} size="sm" />
        </Table.Td>
        <Table.Td>...</Table.Td>
      </Table.Tr>
    ))}
  </Table.Tbody>
</Table>

// Features:
// - Alternating row colors (zebra striping)
// - Hover highlighting with glow effect
// - Dark mode color adaptation


// ============================================
// 10. GRADIENTS IN APP THEME
// ============================================

// Available in App.jsx theme:

// Blue gradient:
background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)'

// Emerald gradient:
background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'

// Violet gradient:
background: 'linear-gradient(135deg, #a855f7 0%, #d946ef 100%)'

// Amber gradient:
background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'

// Usage:
<Box style={{
  background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
  padding: '2rem',
  borderRadius: '0.5rem'
}}>
  Gradient content
</Box>


// ============================================
// 11. DARK MODE SUPPORT
// ============================================

// All components automatically detect:
import { useMantineTheme } from '@mantine/core';

const theme = useMantineTheme();
const isDark = theme.colorScheme === 'dark';

// CSS variables available:
// --mantine-color-dark-8: Dark background
// --mantine-color-dark-7: Slightly lighter dark
// --mantine-color-dark-6: Border dark
// + All light mode equivalents

// Example usage in components:
<Box style={{
  background: isDark 
    ? theme.colors.dark[7] 
    : theme.colors.gray[0],
  border: `1px solid ${isDark ? theme.colors.dark[6] : theme.colors.gray[2]}`
}}>
  Content
</Box>


// ============================================
// 12. RESPONSIVE DESIGN
// ============================================

// All components support mobile-first approach:

<Group
  gap="md"
  grow // Fills available space
  stack="sm" // Stacks on mobile
  align="center"
>
  <Box>Item 1</Box>
  <Box>Item 2</Box>
</Group>

// Mantine breakpoints:
// xs: 0px
// sm: 576px
// md: 768px
// lg: 992px
// xl: 1200px

// Media query example:
<Box
  display={{ base: 'none', md: 'block' }}
>
  Hidden on mobile, visible on medium+
</Box>


// ============================================
// INTEGRATION CHECKLIST
// ============================================

// ✅ Done:
// - visual-improvements.css imported in App.jsx
// - StatisticsCards enhanced
// - DashboardHeader integrated
// - EnhancedNavbar integrated
// - DashboardFooter integrated
// - App.jsx theme expanded (emerald, violet)

// ⏳ Todo:
// - [ ] Update ImovelTable: Add StatusBadge
// - [ ] Update CompanyTable: Add StatusBadge
// - [ ] Update MonthlyFeeControl: Add StatusBadge
// - [ ] Add SkeletonLoader to loading states
// - [ ] Update cards with EnhancedCard
// - [ ] Add modal blur effects
// - [ ] Update sidebar active state
// - [ ] Test responsive on mobile
// - [ ] Test dark mode
// - [ ] Performance optimization


// ============================================
// COMMON PATTERNS
// ============================================

// Pattern 1: Animated Form
<Box className="animate-slideUp">
  <TextInput label="Name" />
  <TextInput label="Email" />
  <Button mt="md">Submit</Button>
</Box>

// Pattern 2: Loading State
{loading ? (
  <SkeletonLoader type="table" count={5} />
) : (
  <Table>{/* content */}</Table>
)}

// Pattern 3: Enhanced List
<Stack gap="md">
  {items.map((item) => (
    <EnhancedCard key={item.id} hover hoverLift>
      <Group justify="space-between">
        <Text>{item.name}</Text>
        <StatusBadge status={item.status} size="sm" />
      </Group>
    </EnhancedCard>
  ))}
</Stack>

// Pattern 4: Dashboard Section
<Box className="animate-slideDown">
  <Title order={2}>Section Title</Title>
  <StatisticsCards statistics={stats} />
  <ChartsSection data={chartData} />
</Box>


// ============================================
// TROUBLESHOOTING
// ============================================

// Q: Animations not working?
// A: Ensure visual-improvements.css is imported in App.jsx ✅

// Q: StatusBadge not showing?
// A: Import the component and pass correct status value (PAGO, PENDENTE, etc)

// Q: Dark mode not applying?
// A: Components use useMantineTheme() - make sure MantineProvider wraps app

// Q: Performance issues?
// A: Use React.memo, lazy load components, limit animation count

// Q: Responsive layout broken?
// A: Check Mantine breakpoints and use display/stack props correctly

