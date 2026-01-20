// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Controle de Imóveis Rurais',
        short_name: 'Controle Imóveis',
        description: 'Sistema de controle de imóveis rurais',
        theme_color: '#0ea5e9',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/controle-imoveis-react/',
        start_url: '/controle-imoveis-react/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              },
              cacheableResponse: {
                statuses: [200]  // Only cache 200 responses
              },
              plugins: [
                {
                  requestWillFetch: async ({ request }) => {
                    // Don't cache requests that might return partial responses
                    if (request.headers.get('range')) {
                      return undefined; // Skip caching for range requests
                    }
                    return request;
                  },
                  cacheWillUpdate: async ({ response }) => {
                    // Don't cache partial responses, errors, or missing responses
                    if (!response || response.status >= 400 || response.status === 206) {
                      return null;
                    }
                    // Don't cache if Content-Range header is present (already cached partial)
                    if (response.headers.get('content-range')) {
                      return null;
                    }
                    return response;
                  },
                  fetchDidFail: async () => {
                    // Don't cache failed requests
                    return null;
                  }
                }
              ]
            }
          },
          // Cache para assets estáticos (JS, CSS, imagens)
          {
            urlPattern: /^https:\/\/.*\.(js|css|png|jpg|jpeg|svg|gif|woff|woff2|eot|ttf|otf)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'assets-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  base: '/controle-imoveis-react/',
  build: {
    // Otimizações de build
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Code splitting otimizado
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@mantine/core', '@mantine/hooks', '@mantine/dates'],
          charts: ['recharts'],
          utils: ['lodash', 'dayjs']
        },
        // Otimização de chunks
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Otimizações de tamanho
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false
  },
  // Otimizações de desenvolvimento
  server: {
    hmr: {
      overlay: false
    }
  },
  // Otimizações de dependências
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@mantine/core',
      '@mantine/hooks',
      '@mantine/dates',
      '@tabler/icons-react'
    ]
  }
})