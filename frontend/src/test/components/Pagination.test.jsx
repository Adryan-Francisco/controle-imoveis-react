// src/test/components/Pagination.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../utils/test-utils';
import { Pagination } from '../../components/Pagination';

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    totalItems: 100,
    pageSize: 10,
    onPageChange: vi.fn(),
    onPageSizeChange: vi.fn()
  };

  it('renders pagination controls', () => {
    renderWithProviders(<Pagination {...defaultProps} />);
    
    expect(screen.getByText('Mostrando 1-10 de 100 itens')).toBeInTheDocument();
    expect(screen.getByText('Itens por página:')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('renders page navigation buttons', () => {
    renderWithProviders(<Pagination {...defaultProps} />);
    
    expect(screen.getByText('Primeira')).toBeInTheDocument();
    expect(screen.getByText('Anterior')).toBeInTheDocument();
    expect(screen.getByText('Próxima')).toBeInTheDocument();
    expect(screen.getByText('Última')).toBeInTheDocument();
  });

  it('calls onPageChange when page button is clicked', () => {
    const onPageChange = vi.fn();
    renderWithProviders(
      <Pagination {...defaultProps} onPageChange={onPageChange} />
    );
    
    fireEvent.click(screen.getByText('Próxima'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageSizeChange when page size is changed', () => {
    const onPageSizeChange = vi.fn();
    renderWithProviders(
      <Pagination {...defaultProps} onPageSizeChange={onPageSizeChange} />
    );
    
    const select = screen.getByDisplayValue('10');
    fireEvent.change(select, { target: { value: '20' } });
    expect(onPageSizeChange).toHaveBeenCalledWith(20);
  });

  it('disables previous/first buttons on first page', () => {
    renderWithProviders(<Pagination {...defaultProps} currentPage={1} />);
    
    const firstButton = screen.getByText('Primeira');
    const previousButton = screen.getByText('Anterior');
    
    expect(firstButton).toBeDisabled();
    expect(previousButton).toBeDisabled();
  });

  it('disables next/last buttons on last page', () => {
    renderWithProviders(<Pagination {...defaultProps} currentPage={10} />);
    
    const nextButton = screen.getByText('Próxima');
    const lastButton = screen.getByText('Última');
    
    expect(nextButton).toBeDisabled();
    expect(lastButton).toBeDisabled();
  });

  it('shows correct page numbers', () => {
    renderWithProviders(<Pagination {...defaultProps} currentPage={5} />);
    
    // Should show page numbers around current page
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('highlights current page', () => {
    renderWithProviders(<Pagination {...defaultProps} currentPage={3} />);
    
    const currentPageButton = screen.getByText('3');
    expect(currentPageButton).toHaveClass('mantine-Button-filled');
  });

  it('renders in compact mode', () => {
    renderWithProviders(<Pagination {...defaultProps} compact={true} />);
    
    // In compact mode, buttons should be smaller
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveStyle({ minWidth: '32px' });
    });
  });

  it('hides item count when showItemCount is false', () => {
    renderWithProviders(
      <Pagination {...defaultProps} showItemCount={false} />
    );
    
    expect(screen.queryByText('Mostrando 1-10 de 100 itens')).not.toBeInTheDocument();
  });

  it('hides page size selector when showPageSizeSelector is false', () => {
    renderWithProviders(
      <Pagination {...defaultProps} showPageSizeSelector={false} />
    );
    
    expect(screen.queryByText('Itens por página:')).not.toBeInTheDocument();
  });

  it('does not render when totalPages is 1 and showItemCount is false', () => {
    const { container } = renderWithProviders(
      <Pagination 
        {...defaultProps} 
        totalPages={1} 
        showItemCount={false} 
      />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('shows correct item range', () => {
    renderWithProviders(
      <Pagination 
        {...defaultProps} 
        currentPage={3} 
        pageSize={15} 
        totalItems={50} 
      />
    );
    
    expect(screen.getByText('Mostrando 31-45 de 50 itens')).toBeInTheDocument();
  });

  it('handles edge case with totalItems less than pageSize', () => {
    renderWithProviders(
      <Pagination 
        {...defaultProps} 
        currentPage={1} 
        pageSize={10} 
        totalItems={5} 
      />
    );
    
    expect(screen.getByText('Mostrando 1-5 de 5 itens')).toBeInTheDocument();
  });
});

