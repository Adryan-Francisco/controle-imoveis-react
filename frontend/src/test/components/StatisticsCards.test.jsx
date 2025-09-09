// src/test/components/StatisticsCards.test.jsx
import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../utils/test-utils';
import { StatisticsCards } from '../../components/StatisticsCards';

describe('StatisticsCards', () => {
  const mockStatistics = {
    totalImoveis: 10,
    valorTotal: 50000,
    valorPendente: 15000,
    taxaPagamento: 70,
  };

  it('renders all statistics cards', () => {
    const { getByText } = renderWithProviders(
      <StatisticsCards statistics={mockStatistics} />
    );

    expect(getByText('Total de Imóveis')).toBeInTheDocument();
    expect(getByText('Valor Total')).toBeInTheDocument();
    expect(getByText('Pendente')).toBeInTheDocument();
    expect(getByText('Taxa de Pagamento')).toBeInTheDocument();
  });

  it('displays correct values', () => {
    const { getByText } = renderWithProviders(
      <StatisticsCards statistics={mockStatistics} />
    );

    expect(getByText('10')).toBeInTheDocument();
    expect(getByText('R$ 50.000,00')).toBeInTheDocument();
    expect(getByText('R$ 15.000,00')).toBeInTheDocument();
    expect(getByText('70%')).toBeInTheDocument();
  });

  it('handles zero values correctly', () => {
    const zeroStatistics = {
      totalImoveis: 0,
      valorTotal: 0,
      valorPendente: 0,
      taxaPagamento: 0,
    };

    const { getByText } = renderWithProviders(
      <StatisticsCards statistics={zeroStatistics} />
    );

    expect(getByText('0')).toBeInTheDocument();
    expect(getByText('R$ 0,00')).toBeInTheDocument();
    expect(getByText('0%')).toBeInTheDocument();
  });
});



