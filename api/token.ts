// api/token.ts
// Autenticação Saipos com cache de token

import type { VercelRequest, VercelResponse } from '@vercel/node'

let cachedToken: {
  token: string
  expiresAt: number
} | null = null

interface SaiposAuthResponse {
  access_token: string
  expires_in?: number
}

async function getToken(): Promise<string> {
  const now = Date.now()

  if (cachedToken && cachedToken.expiresAt > now) {
    console.log('✅ [SAIPOS] Token em cache válido')
    return cachedToken.token
  }

  console.log('🔄 [SAIPOS] Renovando token...')

  const { SAIPOS_ID_PARTNER, SAIPOS_SECRET, SAIPOS_BASE_URL } = process.env

  if (!SAIPOS_ID_PARTNER || !SAIPOS_SECRET || !SAIPOS_BASE_URL) {
    throw new Error('Credenciais Saipos não configuradas')
  }

  const response = await fetch(`${SAIPOS_BASE_URL}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idPartner: SAIPOS_ID_PARTNER,
      secret: SAIPOS_SECRET,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('❌ [SAIPOS] Auth falhou:', errorText)
    throw new Error(`Auth falhou: ${response.status}`)
  }

  const data: SaiposAuthResponse = await response.json()
  const expiresIn = data.expires_in || 3600
  const expiresAt = now + (expiresIn * 1000) - (60 * 1000)

  cachedToken = {
    token: data.access_token,
    expiresAt,
  }

  console.log('✅ [SAIPOS] Token renovado')
  return data.access_token
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const token = await getToken()
    return res.status(200).json({ success: true, token })
  } catch (error: any) {
    console.error('❌ [HANDLER] Erro:', error)
    return res.status(500).json({ 
      success: false, 
      error: 'Erro ao obter token' 
    })
  }
}

export { getToken }
