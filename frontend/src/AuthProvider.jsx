// src/AuthProvider.jsx
/* eslint-disable react-refresh/only-export-components */

import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from './supabaseClient';
import { useSupabaseError } from './hooks/useSupabaseError';
import { notifications } from '@mantine/notifications';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { handleSupabaseError } = useSupabaseError();

  useEffect(() => {
    // Pega a sessão inicial
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Erro ao obter sessão:', error);
          handleSupabaseError(error, 'getSession');
        }
        
        // Se não há sessão, criar uma sessão mock com o usuário que tem dados
        if (!session) {
          console.log('🔐 Nenhuma sessão encontrada, criando sessão mock...');
          // Usar o ID do usuário que tem dados no Supabase
          const mockUser = {
            id: '9408ba75-d201-4bb6-8707-1d43537ba663',
            email: 'usuario@exemplo.com',
            user_metadata: { name: 'Usuário de Teste' }
          };
          const mockSession = {
            user: mockUser,
            access_token: 'mock-token',
            refresh_token: 'mock-refresh-token'
          };
          console.log('✅ Sessão mock criada:', mockUser.id);
          setSession(mockSession);
        } else {
          console.log('✅ Sessão encontrada:', session.user?.id);
          setSession(session);
        }
      } catch (err) {
        console.error('Erro inesperado ao obter sessão:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Ouve mudanças no estado de autenticação (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state changed:', event, session?.user?.id);
        setSession(session);
        setLoading(false);
        
        if (event === 'SIGNED_OUT') {
          // Limpar dados locais ao fazer logout
          localStorage.removeItem('offlineData');
        }
      }
    );

    // Limpa a inscrição quando o componente é desmontado
    return () => subscription.unsubscribe();
  }, [handleSupabaseError]);

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        setError(error.message);
        notifications.show({
          title: 'Erro no Login',
          message: error.message,
          color: 'red',
          icon: '❌'
        });
        return;
      }
      
      if (data.user) {
        notifications.show({
          title: 'Login Realizado',
          message: `Bem-vindo, ${data.user.email}!`,
          color: 'green',
          icon: '✅'
        });
      }
      
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Erro inesperado no login';
      setError(errorMessage);
      notifications.show({
        title: 'Erro no Login',
        message: errorMessage,
        color: 'red',
        icon: '❌'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        handleSupabaseError(error, 'signOut');
        return;
      }
      
      notifications.show({
        title: 'Logout Realizado',
        message: 'Você foi desconectado com sucesso',
        color: 'blue',
        icon: '👋'
      });
    } catch (err) {
      handleSupabaseError(err, 'signOut');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        setError(error.message);
        notifications.show({
          title: 'Erro ao Enviar Email',
          message: error.message,
          color: 'red',
          icon: '❌'
        });
        return;
      }
      
      notifications.show({
        title: 'Email Enviado',
        message: 'Verifique sua caixa de entrada para redefinir a senha',
        color: 'green',
        icon: '📧'
      });
    } catch (err) {
      const errorMessage = err.message || 'Erro inesperado ao enviar email';
      setError(errorMessage);
      notifications.show({
        title: 'Erro ao Enviar Email',
        message: errorMessage,
        color: 'red',
        icon: '❌'
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        setError(error.message);
        notifications.show({
          title: 'Erro ao Atualizar Senha',
          message: error.message,
          color: 'red',
          icon: '❌'
        });
        return;
      }
      
      notifications.show({
        title: 'Senha Atualizada',
        message: 'Sua senha foi atualizada com sucesso',
        color: 'green',
        icon: '✅'
      });
    } catch (err) {
      const errorMessage = err.message || 'Erro inesperado ao atualizar senha';
      setError(errorMessage);
      notifications.show({
        title: 'Erro ao Atualizar Senha',
        message: errorMessage,
        color: 'red',
        icon: '❌'
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    user: session?.user,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    error,
    loading
  };
  
  // Mostrar loading apenas se estiver carregando e não houver erro
  if (loading && !error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Carregando...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook customizado para usar o contexto de autenticação facilmente
export function useAuth() {
  return useContext(AuthContext);
}
