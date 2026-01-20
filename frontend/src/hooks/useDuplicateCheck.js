// src/hooks/useDuplicateCheck.js
import { useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useErrorHandler } from './useErrorHandler';

export function useDuplicateCheck() {
  const { handleError } = useErrorHandler();

  /**
   * Verifica se um imóvel já existe no banco de dados
   * baseado em dados únicos como CPF do proprietário e nome do sítio
   * @param {object} imovelData - Dados do imóvel a verificar
   * @param {string} userId - ID do usuário
   * @returns {Promise<object>} - { exists: boolean, existingId: string|null, existingData: object|null }
   */
  const checkDuplicate = useCallback(async (imovelData, userId) => {
    try {
      if (!userId || !imovelData) {
        return { exists: false, existingId: null, existingData: null };
      }

      const { cpf, proprietario, sitio } = imovelData;

      // Construir query baseada em dados disponíveis
      let query = supabase
        .from('ControleImoveisRurais')
        .select('*')
        .eq('user_id', userId);

      // Filtrar por CPF (mais específico)
      if (cpf && cpf.trim()) {
        query = query.eq('cpf', cpf.trim());
      } else if (proprietario && sitio) {
        // Se não houver CPF, usar nome do proprietário + nome do sítio
        query = query
          .ilike('proprietario', `%${proprietario.trim()}%`)
          .ilike('sitio', `%${sitio.trim()}%`);
      } else {
        return { exists: false, existingId: null, existingData: null };
      }

      const { data, error } = await query.limit(1);

      if (error) {
        console.error('❌ Erro ao verificar duplicata:', error);
        handleError(error, 'verificar duplicata');
        return { exists: false, existingId: null, existingData: null };
      }

      if (data && data.length > 0) {
        return {
          exists: true,
          existingId: data[0].id,
          existingData: data[0],
        };
      }

      return { exists: false, existingId: null, existingData: null };
    } catch (error) {
      console.error('💥 Erro em checkDuplicate:', error);
      return { exists: false, existingId: null, existingData: null };
    }
  }, [handleError]);

  return { checkDuplicate };
}
