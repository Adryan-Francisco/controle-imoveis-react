// src/utils/supabaseConfig.js
// Configuração simplificada do Supabase para evitar problemas de CORS

export const supabaseConfig = {
  url: 'https://ylfmefcvwkaxqrmugwjm.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsZm1lZmN2d2theHFybXVnd2ptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNjE5MzAsImV4cCI6MjA3MDgzNzkzMH0.uEEdwKyJccQbVof1z3dgqnEXCVySWE0DA1jr5h-s_mk',
  options: {
    auth: {
      autoRefreshToken: false, // Desabilitar para evitar CORS
      persistSession: true,
      detectSessionInUrl: false,
      flowType: 'implicit'
    },
    global: {
      headers: {
        'X-Client-Info': 'controle-imoveis-react@1.0.0'
      }
    }
  }
};

// Função para criar cliente Supabase com configuração segura
export function createSupabaseClient() {
  const { createClient } = require('@supabase/supabase-js');
  return createClient(supabaseConfig.url, supabaseConfig.anonKey, supabaseConfig.options);
}





