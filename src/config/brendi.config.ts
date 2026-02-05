// src/config/brendi.config.ts

/**
 * Configuração da integração com a API da Brendi
 * 
 * As variáveis de ambiente devem ser configuradas no Vercel:
 * - VITE_BRENDI_API_URL
 * - VITE_BRENDI_STORE_ID
 * - VITE_BRENDI_TOKEN
 */

export const brendiConfig = {
  apiUrl: import.meta.env.VITE_BRENDI_API_URL || '',
  storeId: import.meta.env.VITE_BRENDI_STORE_ID || '',
  token: import.meta.env.VITE_BRENDI_TOKEN || '',
  environment: import.meta.env.MODE || 'development',
} as const

/**
 * Validação de credenciais
 * Garante que todas as variáveis necessárias estão configuradas
 */
export function validateBrendiConfig(): void {
  const missing: string[] = []

  if (!brendiConfig.apiUrl) missing.push('VITE_BRENDI_API_URL')
  if (!brendiConfig.storeId) missing.push('VITE_BRENDI_STORE_ID')
  if (!brendiConfig.token) missing.push('VITE_BRENDI_TOKEN')

  if (missing.length > 0) {
    console.error('❌ Variáveis de ambiente faltando:', missing.join(', '))
    
    if (brendiConfig.environment === 'production') {
      throw new Error(
        `Credenciais da Brendi não configuradas: ${missing.join(', ')}`
      )
    } else {
      console.warn('⚠️ Modo desenvolvimento: usando dados mockados')
    }
  } else {
    console.log('✅ Credenciais da Brendi configuradas')
  }
}

/**
 * Verifica se está em modo produção
 */
export const isProduction = brendiConfig.environment === 'production'

/**
 * Verifica se as credenciais estão configuradas
 */
export const hasValidCredentials = !!(
  brendiConfig.apiUrl &&
  brendiConfig.storeId &&
  brendiConfig.token
)
