// proxy-server.js
// Servidor proxy para contornar problemas de CORS durante desenvolvimento
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Habilitar CORS para todas as rotas
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

// Proxy para Supabase
app.use('/supabase', createProxyMiddleware({
  target: 'https://ylfmefcvwkaxqrmugwjm.supabase.co',
  changeOrigin: true,
  pathRewrite: {
    '^/supabase': ''
  },
  onProxyReq: (proxyReq, req, res) => {
    // Adicionar headers necessários
    proxyReq.setHeader('Origin', 'https://ylfmefcvwkaxqrmugwjm.supabase.co');
  },
  onProxyRes: (proxyRes, req, res) => {
    // Adicionar headers CORS
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Client-Info';
  }
}));

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
  console.log(`📡 Proxying Supabase requests to: https://ylfmefcvwkaxqrmugwjm.supabase.co`);
});
