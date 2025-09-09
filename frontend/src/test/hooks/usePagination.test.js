// src/test/hooks/usePagination.test.js
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePagination } from '../../hooks/usePagination';

describe('usePagination', () => {
  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => usePagination(100, 10));
    
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(10);
    expect(result.current.pageSize).toBe(10);
    expect(result.current.totalItems).toBe(100);
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.hasPreviousPage).toBe(false);
  });

  it('should calculate pagination info correctly', () => {
    const { result } = renderHook(() => usePagination(25, 5));
    
    expect(result.current.totalPages).toBe(5);
    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBe(5);
    expect(result.current.isFirstPage).toBe(true);
    expect(result.current.isLastPage).toBe(false);
  });

  it('should navigate to next page', () => {
    const { result } = renderHook(() => usePagination(100, 10));
    
    act(() => {
      result.current.nextPage();
    });
    
    expect(result.current.currentPage).toBe(2);
    expect(result.current.hasPreviousPage).toBe(true);
  });

  it('should navigate to previous page', () => {
    const { result } = renderHook(() => usePagination(100, 10));
    
    act(() => {
      result.current.nextPage();
      result.current.previousPage();
    });
    
    expect(result.current.currentPage).toBe(1);
    expect(result.current.hasPreviousPage).toBe(false);
  });

  it('should go to specific page', () => {
    const { result } = renderHook(() => usePagination(100, 10));
    
    act(() => {
      result.current.goToPage(5);
    });
    
    expect(result.current.currentPage).toBe(5);
  });

  it('should not go beyond valid page range', () => {
    const { result } = renderHook(() => usePagination(100, 10));
    
    act(() => {
      result.current.goToPage(15); // Beyond total pages
    });
    
    expect(result.current.currentPage).toBe(10); // Should clamp to max page
    
    act(() => {
      result.current.goToPage(0); // Below min page
    });
    
    expect(result.current.currentPage).toBe(1); // Should clamp to min page
  });

  it('should go to first and last page', () => {
    const { result } = renderHook(() => usePagination(100, 10));
    
    act(() => {
      result.current.goToPage(5);
      result.current.goToFirstPage();
    });
    
    expect(result.current.currentPage).toBe(1);
    
    act(() => {
      result.current.goToLastPage();
    });
    
    expect(result.current.currentPage).toBe(10);
  });

  it('should reset pagination', () => {
    const { result } = renderHook(() => usePagination(100, 10));
    
    act(() => {
      result.current.goToPage(5);
      result.current.resetPagination();
    });
    
    expect(result.current.currentPage).toBe(1);
  });

  it('should handle edge cases', () => {
    // No items
    const { result: result1 } = renderHook(() => usePagination(0, 10));
    expect(result1.current.totalPages).toBe(0);
    expect(result1.current.hasNextPage).toBe(false);
    expect(result1.current.hasPreviousPage).toBe(false);
    
    // Single page
    const { result: result2 } = renderHook(() => usePagination(5, 10));
    expect(result2.current.totalPages).toBe(1);
    expect(result2.current.hasNextPage).toBe(false);
    expect(result2.current.hasPreviousPage).toBe(false);
  });
});

