// src/services/boletoService.js
// Serviço para gerar boletos via API Cora

import { ApiClient } from '../utils/api';

/**
 * Configuração da API Cora
 */
const CORA_CONFIG = {
  // Substitua pelas credenciais reais do Cora
  clientId: import.meta.env.VITE_CORA_CLIENT_ID || '',
  clientSecret: import.meta.env.VITE_CORA_CLIENT_SECRET || '',
  bankCode: '756', // Código do Cora
  apiUrl: import.meta.env.VITE_CORA_API_URL || 'https://api.cora.io/v1'
};

/**
 * Serviço para gerenciar boletos do Cora
 */
export class BoletoService {
  constructor() {
    this.apiClient = new ApiClient(CORA_CONFIG.apiUrl);
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  /**
   * Autentica na API Cora
   * @returns {Promise<string>} Token de acesso
   */
  async authenticate() {
    try {
      // Verificar se token ainda é válido
      if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        return this.accessToken;
      }

      const response = await fetch(`${CORA_CONFIG.apiUrl}/auth/oauth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: CORA_CONFIG.clientId,
          client_secret: CORA_CONFIG.clientSecret,
          scope: 'boletos.create boletos.read'
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na autenticação Cora: ${response.statusText}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);

      return this.accessToken;
    } catch (error) {
      console.error('Erro ao autenticar no Cora:', error);
      throw error;
    }
  }

  /**
   * Gera um novo boleto no Cora
   * @param {Object} boletoData - Dados do boleto
   * @returns {Promise<Object>} Dados do boleto criado
   */
  async gerarBoleto({
    empresa,
    valor,
    vencimento,
    descricao = 'Pagamento de Mensalidade',
    beneficiario = {}
  }) {
    try {
      const token = await this.authenticate();

      const payload = {
        amount: Math.round(valor * 100), // Cora usa centavos
        due_date: new Date(vencimento).toISOString().split('T')[0],
        description: descricao,
        payer: {
          name: empresa.name || empresa.empresa,
          document: empresa.cnpj || empresa.cpf,
          email: empresa.email || '',
          phone: empresa.telefone || empresa.phone || ''
        },
        beneficiary: {
          name: beneficiario.name || 'Beneficiário',
          document: beneficiario.document || '',
          bank_account: beneficiario.bankAccount || {}
        },
        instruction_lines: [
          'Pagamento até o vencimento',
          'Juros de 0.33% ao dia de atraso'
        ]
      };

      const response = await fetch(`${CORA_CONFIG.apiUrl}/boletos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Erro ao criar boleto: ${error.message || response.statusText}`);
      }

      const boletoResponse = await response.json();

      return {
        id: boletoResponse.id,
        barcode: boletoResponse.barcode,
        bankSlipUrl: boletoResponse.bank_slip_url || boletoResponse.url,
        amount: boletoResponse.amount / 100, // Converter de centavos para reais
        dueDate: boletoResponse.due_date,
        status: boletoResponse.status,
        createdAt: boletoResponse.created_at,
        expiresAt: boletoResponse.expires_at,
        ourNumber: boletoResponse.our_number
      };
    } catch (error) {
      console.error('Erro ao gerar boleto:', error);
      throw error;
    }
  }

  /**
   * Busca informações de um boleto
   * @param {string} boletoId - ID do boleto
   * @returns {Promise<Object>} Informações do boleto
   */
  async obterBoleto(boletoId) {
    try {
      const token = await this.authenticate();

      const response = await fetch(`${CORA_CONFIG.apiUrl}/boletos/${boletoId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar boleto: ${response.statusText}`);
      }

      const boleto = await response.json();

      return {
        id: boleto.id,
        barcode: boleto.barcode,
        status: boleto.status,
        amount: boleto.amount / 100,
        dueDate: boleto.due_date,
        paidAt: boleto.paid_at,
        createdAt: boleto.created_at
      };
    } catch (error) {
      console.error('Erro ao obter boleto:', error);
      throw error;
    }
  }

  /**
   * Lista boletos de uma empresa
   * @param {string} companyId - ID da empresa
   * @param {Object} filters - Filtros (status, período, etc)
   * @returns {Promise<Array>} Lista de boletos
   */
  async listarBoletos(companyId, filters = {}) {
    try {
      const token = await this.authenticate();

      const queryParams = new URLSearchParams({
        limit: filters.limit || 50,
        offset: filters.offset || 0,
        ...(filters.status && { status: filters.status })
      });

      const response = await fetch(
        `${CORA_CONFIG.apiUrl}/boletos?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao listar boletos: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        boletos: data.data?.map(boleto => ({
          id: boleto.id,
          barcode: boleto.barcode,
          status: boleto.status,
          amount: boleto.amount / 100,
          dueDate: boleto.due_date,
          createdAt: boleto.created_at,
          paidAt: boleto.paid_at
        })) || [],
        total: data.total,
        limit: data.limit,
        offset: data.offset
      };
    } catch (error) {
      console.error('Erro ao listar boletos:', error);
      throw error;
    }
  }

  /**
   * Baixa o PDF do boleto
   * @param {string} boletoId - ID do boleto
   * @returns {Promise<Blob>} Arquivo PDF
   */
  async baixarBoletoPDF(boletoId) {
    try {
      const token = await this.authenticate();

      const response = await fetch(
        `${CORA_CONFIG.apiUrl}/boletos/${boletoId}/pdf`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/pdf'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao baixar PDF: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Erro ao baixar PDF do boleto:', error);
      throw error;
    }
  }

  /**
   * Cancela um boleto
   * @param {string} boletoId - ID do boleto
   * @returns {Promise<Object>} Resposta do cancelamento
   */
  async cancelarBoleto(boletoId) {
    try {
      const token = await this.authenticate();

      const response = await fetch(
        `${CORA_CONFIG.apiUrl}/boletos/${boletoId}/cancel`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao cancelar boleto: ${response.statusText}`);
      }

      const result = await response.json();
      return { success: true, message: 'Boleto cancelado com sucesso', data: result };
    } catch (error) {
      console.error('Erro ao cancelar boleto:', error);
      throw error;
    }
  }
}

// Instância padrão do serviço
export const boletoService = new BoletoService();
