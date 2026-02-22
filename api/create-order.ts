// api/create-order.ts
// Criar pedido na Saipos

import type { VercelRequest, VercelResponse } from '@vercel/node'

async function getToken(): Promise<string> {
  const { SAIPOS_ID_PARTNER, SAIPOS_SECRET, SAIPOS_BASE_URL } = process.env

  if (!SAIPOS_ID_PARTNER || !SAIPOS_SECRET || !SAIPOS_BASE_URL) {
    throw new Error('Credenciais não configuradas')
  }

  const response = await fetch(`${SAIPOS_BASE_URL}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idPartner: SAIPOS_ID_PARTNER,
      secret: SAIPOS_SECRET,
    }),
  })

  if (!response.ok) throw new Error(`Auth falhou: ${response.status}`)
  const data = await response.json()
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
    const { SAIPOS_COD_STORE, SAIPOS_BASE_URL } = process.env

    if (!SAIPOS_COD_STORE || !SAIPOS_BASE_URL) {
      throw new Error('Configuração incompleta')
    }

    const body = req.body

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Pedido deve ter pelo menos 1 item' 
      })
    }

    console.log('🔐 [SAIPOS] Obtendo token...')
    const token = await getToken()

    const timestamp = Date.now()
    const orderId = `TOTEM-${timestamp}`
    const displayId = String(timestamp).slice(-6)

    const payload = {
      order_id: orderId,
      display_id: displayId,
      cod_store: SAIPOS_COD_STORE,
      created_at: new Date().toISOString(),
      notes: body.notes || '',
      total_discount: 0,
      total_amount: body.total_amount,
      customer: {
        id: 'TOTEM',
        name: 'Cliente Totem',
        phone: '',
        document_number: '',
      },
      order_method: {
        mode: 'TICKET',
        ticket_reference: displayId,
      },
      items: body.items.map((item: any) => ({
        integration_code: item.integration_code,
        desc_item: item.desc_item,
        quantity: item.quantity,
        unit_price: item.unit_price,
        notes: item.notes || '',
        choice_items: item.choice_items || [],
      })),
    }

    console.log('📤 [SAIPOS] POST /order', {
      order_id: orderId,
      display_id: displayId,
      items: body.items.length,
    })

    const response = await fetch(`${SAIPOS_BASE_URL}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error('❌ [SAIPOS] Erro:', responseData)
      return res.status(response.status).json({
        success: false,
        error: 'Erro ao processar pedido',
        details: responseData,
      })
    }

    console.log('✅ [SAIPOS] Pedido criado:', orderId)

    return res.status(200).json({
      success: true,
      order_id: orderId,
      display_id: displayId,
      saipos_response: responseData,
    })

  } catch (error: any) {
    console.error('❌ [HANDLER] Erro:', error)
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao processar pedido',
      message: error.message,
    })
  }
}
