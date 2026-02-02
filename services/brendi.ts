
import { OrderPayload, Category, Product } from '../types';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '../constants';

/**
 * Interface para a resposta de autenticação da Brendi
 */
export interface BrendiAuthResponse {
  token: string;
  storeName: string;
  expiresAt: string;
}

/**
 * Interface para a resposta de criação de pedido
 */
export interface BrendiOrderResponse {
  success: boolean;
  orderId: string;
  externalId: string;
  status: 'RECEIVED' | 'CONFIRMED' | 'REJECTED';
  message?: string;
}

/**
 * Configuração do serviço
 */
const IS_MOCK = true;
const API_BASE_URL = 'https://api.brendi.com.br/v1';

/**
 * Camada de Serviço Brendi
 * Responsável pela comunicação com o HUB central de pedidos.
 */
export const Brendi = {
  /**
   * Autenticação do Totem (Kiosk Mode)
   * Realiza o login da loja para obter o token de sessão do dispositivo.
   */
  async authenticate(kioskKey: string): Promise<BrendiAuthResponse> {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        token: 'mock_jwt_token_brendi_12345',
        storeName: 'Hambúrguer Gourmet - Unidade Centro',
        expiresAt: new Date(Date.now() + 86400000).toISOString()
      };
    }

    // Chamada Real (Exemplo)
    const response = await fetch(`${API_BASE_URL}/auth/kiosk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kioskKey })
    });
    
    if (!response.ok) throw new Error('Falha na autenticação com Brendi');
    return response.json();
  },

  /**
   * Busca o cardápio atualizado
   */
  async getMenu(): Promise<{ categories: Category[], products: Product[] }> {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        categories: MOCK_CATEGORIES,
        products: MOCK_PRODUCTS
      };
    }

    const response = await fetch(`${API_BASE_URL}/menu`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('brendi_token')}` }
    });
    return response.json();
  },

  /**
   * Criação de Pedido
   * Envia os dados do carrinho para processamento no HUB Brendi.
   */
  async createOrder(payload: OrderPayload): Promise<BrendiOrderResponse> {
    console.log('[Brendi Service] Iniciando criação de pedido...', payload);

    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simula uma resposta de sucesso do servidor
      return {
        success: true,
        orderId: `BRENDI-${Math.floor(Math.random() * 1000000)}`,
        externalId: `TOTEM-${Date.now()}`,
        status: 'RECEIVED',
        message: 'Pedido recebido com sucesso no HUB Brendi.'
      };
    }

    // Fluxo Real
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('brendi_token')}`
      },
      body: JSON.stringify({
        ...payload,
        origin: 'TOTEM', // Garante a identificação da origem conforme requisito
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao processar pedido na Brendi');
    }

    return response.json();
  }
};
