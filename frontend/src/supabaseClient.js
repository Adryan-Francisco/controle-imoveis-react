// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// Configuração otimizada para evitar problemas de CORS
const supabaseUrl = 'https://ylfmefcvwkaxqrmugwjm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsZm1lZmN2d2theHFybXVnd2ptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNjE5MzAsImV4cCI6MjA3MDgzNzkzMH0.uEEdwKyJccQbVof1z3dgqnEXCVySWE0DA1jr5h-s_mk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false, // Desabilitar refresh automático
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'implicit',
    debug: false // Desabilitar debug para reduzir logs
  },
  global: {
    headers: {
      'X-Client-Info': 'controle-imoveis-react@1.0.0'
    }
  },
  db: {
    schema: 'public'
  }
})

// Função para verificar se o usuário está autenticado
export const isAuthenticated = () => {
  try {
    const session = supabase.auth.getSession();
    return !!session;
  } catch (error) {
    console.warn('Erro ao verificar autenticação:', error);
    return false;
  }
}

// Função para fazer logout seguro
export const safeSignOut = async () => {
  try {
    await supabase.auth.signOut();
    // Limpar dados locais
    localStorage.removeItem('offlineData');
    localStorage.removeItem('sb-ylfmefcvwkaxqrmugwjm-auth-token');
  } catch (error) {
    console.warn('Erro ao fazer logout:', error);
  }
}