// api/token.ts
// Autenticação Saipos - SANDBOX REAL

import type { VercelRequest, VercelResponse } from '@vercel/node'

// Cache em memória
let cachedToken: {
  token: string
  expiresAt: number
} | null = null

interface SaiposAuthResponse {
  access_token: string
  expires_in?: number
  token_type?: string
}

/**
 * Obtém token Saipos com cache automático
 */
async function getToken(): Promise<string> {
  const now = Date.now()

  // Verificar cache
  if (cachedToken && cachedToken.expiresAt > now) {
    console.log('✅ [SAIPOS] Token em cache válido', {
      expiresIn: Math.round((cachedToken.expiresAt - now) / 1000) + 's',
    })
    return cachedToken.token
  }

  // Renovar token
  console.log('🔄 [SAIPOS] Renovando token...')

  const { SAIPOS_ID_PARTNER, SAIPOS_SECRET, SAIPOS_BASE_URL } = process.env

  if (!SAIPOS_ID_PARTNER || !SAIPOS_SECRET || !SAIPOS_BASE_URL) {
    throw new Error('Credenciais Saipos não configuradas')
  }

  const authUrl = `${SAIPOS_BASE_URL}/auth`
  
  console.log('📤 [SAIPOS] POST /auth', {
    url: authUrl,
    idPartner: SAIPOS_ID_PARTNER.substring(0, 8) + '...',
  })

  try {
    const response = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idPartner: SAIPOS_ID_PARTNER,
        secret: SAIPOS_SECRET,
      }),
    })

    const responseText = await response.text()
    
    console.log('📥 [SAIPOS] Auth response', {
      status: response.status,
      statusText: response.statusText,
      body: responseText.substring(0, 200),
    })

    if (!response.ok) {
      console.error('❌ [SAIPOS] Auth falhou:', {
        status: response.status,
        body: responseText,
      })
      throw new Error(`Auth falhou: ${response.status} - ${responseText}`)
    }

    const data: SaiposAuthResponse = JSON.parse(responseText)

    if (!data.access_token) {
      throw new Error('Token não retornado pela API')
    }

    const expiresIn = data.expires_in || 3600
    const expiresAt = now + (expiresIn * 1000) - (60 * 1000) // -1min margem

    cachedToken = {
      token: data.access_token,
      expiresAt,
    }

    console.log('✅ [SAIPOS] Token renovado com sucesso', {
      expiresIn: expiresIn + 's',
      tokenLength: data.access_token.length,
    })

    return data.access_token

  } catch (error: any) {
    console.error('❌ [SAIPOS] Erro ao obter token:', {
      message: error.message,
      stack: error.stack?.substring(0, 200),
    })
    throw error
  }
}

/**
 * Endpoint handler
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed' 
    })
  }

  try {
    const token = await getToken()
    
    return res.status(200).json({
      success: true,
      token,
      cached: cachedToken !== null,
    })

  } catch (error: any) {
    console.error('❌ [HANDLER] Erro:', error)
    
    return res.status(500).json({
      success: false,
      error: 'Erro ao obter token de autenticação',
      message: error.message,
    })
  }
}

// Exportar para uso em outros endpoints
export { getToken }
