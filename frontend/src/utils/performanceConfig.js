// src/utils/performanceConfig.js
// Configurações de performance para otimização

export const PERFORMANCE_CONFIG = {
  // Debounce delays
  DEBOUNCE: {
    SEARCH: 300,
    FILTER: 200,
    SCROLL: 100,
    RESIZE: 250,
  },
  
  // Memoization
  MEMOIZATION: {
    ENABLED: true,
    MAX_CACHE_SIZE: 100,
    CACHE_TTL: 5 * 60 * 1000, // 5 minutos
  },
  
  // Lazy loading
  LAZY_LOADING: {
    ENABLED: true,
    THRESHOLD: 0.1,
    ROOT_MARGIN: '50px',
  },
  
  // Virtualization
  VIRTUALIZATION: {
    ENABLED: true,
    ITEM_HEIGHT: 50,
    BUFFER_SIZE: 5,
  },
  
  // Preloading
  PRELOADING: {
    ENABLED: true,
    PRIORITY_RESOURCES: [
      '/src/components/ImovelForm.jsx',
      '/src/components/ImovelTable.jsx',
    ],
  },
  
  // Bundle optimization
  BUNDLE: {
    CHUNK_SIZE_LIMIT: 250000, // 250KB
    TREE_SHAKING: true,
    MINIFICATION: true,
  }
};

// Função para otimizar imagens
export function optimizeImage(src, options = {}) {
  const { width, height, quality = 80, format = 'webp' } = options;
  
  // Se for uma URL do Supabase Storage, adicionar parâmetros de otimização
  if (src.includes('supabase')) {
    const url = new URL(src);
    url.searchParams.set('width', width || 'auto');
    url.searchParams.set('height', height || 'auto');
    url.searchParams.set('quality', quality);
    url.searchParams.set('format', format);
    return url.toString();
  }
  
  return src;
}

// Função para preload de recursos críticos
export function preloadCriticalResources() {
  const resources = PERFORMANCE_CONFIG.PRELOADING.PRIORITY_RESOURCES;
  
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    link.as = resource.endsWith('.jsx') ? 'script' : 'style';
    document.head.appendChild(link);
  });
}

// Função para otimizar listas grandes
export function optimizeLargeList(items, options = {}) {
  const { 
    pageSize = 50, 
    sortBy = 'id', 
    sortOrder = 'asc' 
  } = options;
  
  if (!Array.isArray(items) || items.length <= pageSize) {
    return items;
  }
  
  // Ordenar apenas se necessário
  const sorted = items.sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    
    if (sortOrder === 'desc') {
      return bVal > aVal ? 1 : -1;
    }
    return aVal > bVal ? 1 : -1;
  });
  
  return sorted;
}

// Função para otimizar re-renders
export function shouldRerender(prevProps, nextProps, keys = []) {
  if (keys.length === 0) {
    return prevProps !== nextProps;
  }
  
  return keys.some(key => prevProps[key] !== nextProps[key]);
}

// Função para otimizar cálculos pesados
export function memoizeCalculation(fn, dependencies = []) {
  let cache = new Map();
  let lastDeps = dependencies;
  
  return (...args) => {
    const key = JSON.stringify(args);
    const depsChanged = dependencies.some((dep, index) => dep !== lastDeps[index]);
    
    if (depsChanged) {
      cache.clear();
      lastDeps = [...dependencies];
    }
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    
    // Limitar tamanho do cache
    if (cache.size > PERFORMANCE_CONFIG.MEMOIZATION.MAX_CACHE_SIZE) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    return result;
  };
}
