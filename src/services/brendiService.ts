
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '../constants';
import { Category, Product, OrderPayload } from '../types';

/**
 * BrendiService
 * Camada de abstração para chamadas à API da Brendi.
 * Em um cenário real, estas funções usariam 'fetch' ou 'axios'.
 */
export const BrendiService = {
  /**
   * Obtém o cardápio completo da Brendi
   */
  async getMenu(): Promise<{ categories: Category[], products: Product[] }> {
    // Simulação de delay de rede
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      categories: MOCK_CATEGORIES,
      products: MOCK_PRODUCTS
    };
  },

  /**
   * Envia o pedido finalizado para a Brendi
   */
  async sendOrder(payload: OrderPayload): Promise<{ success: boolean; orderId?: string }> {
    console.log('Enviando pedido para Brendi API:', JSON.stringify(payload, null, 2));
    
    // Simulação de delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Aqui seria o POST real:
    // const res = await fetch(`${API_URL}/orders`, { method: 'POST', body: JSON.stringify(payload) });
    
    return {
      success: true,
      orderId: `BRD-${Math.floor(Math.random() * 90000) + 10000}`
    };
  }
};
