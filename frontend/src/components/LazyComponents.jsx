// src/components/LazyComponents.jsx
import { lazy } from 'react';

// Lazy load heavy components
export const LazyDashboard = lazy(() => import('./Dashboard'));
export const LazyChartsSection = lazy(() => import('./ChartsSection'));
export const LazyImovelForm = lazy(() => import('./ImovelForm'));

// Lazy load with fallback
export const LazyDashboardWithFallback = lazy(() => 
  import('./Dashboard').then(module => ({
    default: module.default
  }))
);

