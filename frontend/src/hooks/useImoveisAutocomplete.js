// src/hooks/useImoveisAutocomplete.js
import { useCallback } from 'react';
import { supabase } from '../supabaseClient';

export function useImoveisAutocomplete() {
  /**
   * Busca imóveis que começam com uma letra específica
   * @param {string} startLetter - Primeira letra para filtrar (ex: 'J')
   * @param {string} userId - ID do usuário
   * @returns {Promise<Array>} - Array de imóveis correspondentes
   */
  const searchByLetter = useCallback(async (startLetter, userId) => {
    try {
      if (!startLetter || !userId) {
        return [];
      }

      const letter = startLetter.toUpperCase();
      const pattern = `${letter}%`; // Começa com a letra

      // Buscar por proprietário ou sítio que começam com a letra
      const { data, error } = await supabase
        .from('ControleImoveisRurais')
        .select('id, proprietario, sitio, cpf, endereco, valor')
        .eq('user_id', userId)
        .or(`proprietario.ilike.${pattern},sitio.ilike.${pattern}`)
        .order('proprietario', { ascending: true })
        .limit(20); // Limitar para não sobrecarregar

      if (error) {
        console.error('❌ Erro ao buscar imóveis:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('💥 Erro em searchByLetter:', error);
      return [];
    }
  }, []);

  /**
   * Busca um imóvel específico por ID
   * @param {string} id - ID do imóvel
   * @param {string} userId - ID do usuário
   * @returns {Promise<Object>} - Dados completos do imóvel
   */
  const getImovelById = useCallback(async (id, userId) => {
    try {
      if (!id || !userId) {
        return null;
      }

      const { data, error } = await supabase
        .from('ControleImoveisRurais')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('❌ Erro ao buscar imóvel:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('💥 Erro em getImovelById:', error);
      return null;
    }
  }, []);

  return { searchByLetter, getImovelById };
}
