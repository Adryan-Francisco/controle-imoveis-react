// src/hooks/useBoleto.js
// Hook para gerenciar boletos via API Cora

import { useState, useCallback } from 'react';
import { boletoService } from '../services/boletoService';
import { notifications } from '@mantine/notifications';

export function useBoleto() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [boletos, setBoletos] = useState([]);

  /**
   * Gera um novo boleto
   */
  const gerarBoleto = useCallback(async (boletoData) => {
    try {
      setLoading(true);
      setError(null);

      const novoBoleto = await boletoService.gerarBoleto(boletoData);

      setBoletos(prev => [...prev, novoBoleto]);

      notifications.show({
        title: 'Sucesso!',
        message: 'Boleto gerado com sucesso',
        color: 'green',
        icon: null
      });

      return { success: true, data: novoBoleto };
    } catch (err) {
      const errorMessage = err.message || 'Erro ao gerar boleto';
      setError(errorMessage);

      notifications.show({
        title: 'Erro',
        message: errorMessage,
        color: 'red',
        icon: null
      });

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtém informações de um boleto
   */
  const obterBoleto = useCallback(async (boletoId) => {
    try {
      setLoading(true);
      setError(null);

      const boleto = await boletoService.obterBoleto(boletoId);
      return { success: true, data: boleto };
    } catch (err) {
      const errorMessage = err.message || 'Erro ao obter boleto';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Lista boletos de uma empresa
   */
  const listarBoletos = useCallback(async (companyId, filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const resultado = await boletoService.listarBoletos(companyId, filters);
      setBoletos(resultado.boletos);

      return { success: true, data: resultado };
    } catch (err) {
      const errorMessage = err.message || 'Erro ao listar boletos';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Baixa o PDF do boleto
   */
  const baixarBoletoPDF = useCallback(async (boletoId, fileName = 'boleto.pdf') => {
    try {
      setLoading(true);
      setError(null);

      const pdfBlob = await boletoService.baixarBoletoPDF(boletoId);

      // Criar URL do blob e fazer download
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      notifications.show({
        title: 'Sucesso!',
        message: 'Boleto baixado com sucesso',
        color: 'green',
        icon: null
      });

      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Erro ao baixar boleto';
      setError(errorMessage);

      notifications.show({
        title: 'Erro',
        message: errorMessage,
        color: 'red',
        icon: null
      });

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cancela um boleto
   */
  const cancelarBoleto = useCallback(async (boletoId) => {
    try {
      setLoading(true);
      setError(null);

      const resultado = await boletoService.cancelarBoleto(boletoId);

      // Remover boleto da lista
      setBoletos(prev => prev.filter(b => b.id !== boletoId));

      notifications.show({
        title: 'Sucesso!',
        message: 'Boleto cancelado com sucesso',
        color: 'green',
        icon: null
      });

      return { success: true, data: resultado };
    } catch (err) {
      const errorMessage = err.message || 'Erro ao cancelar boleto';
      setError(errorMessage);

      notifications.show({
        title: 'Erro',
        message: errorMessage,
        color: 'red',
        icon: null
      });

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Estado
    loading,
    error,
    boletos,

    // Métodos
    gerarBoleto,
    obterBoleto,
    listarBoletos,
    baixarBoletoPDF,
    cancelarBoleto
  };
}
