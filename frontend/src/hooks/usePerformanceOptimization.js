// src/hooks/usePerformanceOptimization.js
import { useCallback, useMemo, useRef, useState } from 'react';
import { useDebounce } from './useDebounce';

/**
 * Hook para otimizar busca com debounce
 */
export const useOptimizedDebounce = (value, delay = 300) => {
  return useDebounce(value, delay);
};

/**
 * Hook para memoizar listas grandes
 */
export const useMemoizedList = (list, dependencies = []) => {
  return useMemo(() => {
    if (!Array.isArray(list)) return [];
    return [...list];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, ...dependencies]);
};

/**
 * Hook para memoizar objetos complexos
 */
export const useMemoizedObject = (obj, dependencies = []) => {
  return useMemo(() => {
    if (!obj || typeof obj !== 'object') return obj;
    return { ...obj };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [obj, ...dependencies]);
};

/**
 * Hook para throttle em eventos
 */
export const useThrottle = (callback, delay = 100) => {
  const lastRun = useRef(Date.now());

  return useCallback((...args) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]);
};

/**
 * Hook para Intersection Observer (lazy loading)
 */
export const useIntersectionObserver = (callback, options = {}) => {
  const targetRef = useRef(null);
  const observerRef = useRef(null);

  const observe = useCallback(() => {
    if (targetRef.current && !observerRef.current) {
      observerRef.current = new IntersectionObserver(callback, {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      });
      observerRef.current.observe(targetRef.current);
    }
  }, [callback, options]);

  const unobserve = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  return { targetRef, observe, unobserve };
};

/**
 * Hook para virtualização de listas grandes
 */
export const useVirtualization = (items, itemHeight = 50, containerHeight = 400) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );

    return items.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      index: startIndex + index
    }));
  }, [items, scrollTop, itemHeight, containerHeight]);

  const totalHeight = items.length * itemHeight;
  const offsetY = Math.floor(scrollTop / itemHeight) * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop
  };
};

/**
 * Hook para cache de resultados de funções
 */
export const useFunctionCache = (fn, dependencies = []) => {
  const cacheRef = useRef(new Map());

  return useCallback((...args) => {
    const key = JSON.stringify(args);

    if (cacheRef.current.has(key)) {
      return cacheRef.current.get(key);
    }

    const result = fn(...args);
    cacheRef.current.set(key, result);

    // Limitar tamanho do cache
    if (cacheRef.current.size > 100) {
      const firstKey = cacheRef.current.keys().next().value;
      cacheRef.current.delete(firstKey);
    }

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fn, ...dependencies]);
};

/**
 * Hook para preload de recursos
 */
export const usePreload = (urls = []) => {
  const preloadedRef = useRef(new Set());

  const preload = useCallback((url) => {
    if (preloadedRef.current.has(url)) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.as = url.endsWith('.js') ? 'script' : 'style';

      link.onload = () => {
        preloadedRef.current.add(url);
        resolve();
      };

      link.onerror = reject;
      document.head.appendChild(link);
    });
  }, []);

  const preloadAll = useCallback(async () => {
    const promises = urls.map(preload);
    await Promise.allSettled(promises);
  }, [urls, preload]);

  return { preload, preloadAll };
};
