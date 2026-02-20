// api/create-order.ts
// Serverless Function para criar pedido na Saipos

import type { VercelRequest, VercelResponse } from '@vercel/node'

// Importar função de token (mesma pasta)
async function getToken(): Promise<string> {
  const now = Date.now()
  
  // Mesmo cache do token.ts
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
    throw new Error(`Auth falhou: ${response.status}`)
  }

  const data = await response.json()
  return data.access_token
}

interface OrderItem {
  integration_code: string
  desc_item: string
  quantity: number
  unit_price: number
  notes?: string
}

interface CreateOrderRequest {
  items: OrderItem[]
  total_amount: number
  notes?: string
}

interface SaiposOrderPayload {
  order_id: string
  display_id: string
  cod_store: string
  created_at: string
  notes: string
  total_discount: number
  total_amount: number
  customer: {
    id: string
    name: string
    phone: string
    document_number: string
  }
  order_method: {
    mode: string
    ticket_reference: string
  }
  items: {
    integration_code: string
    desc_item: string
    quantity: number
    unit_price: number
    notes: string
    choice_items: any[]
  }[]
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
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
      throw new Error('Configuração Saipos incompleta')
    }

    // Validar body
    const body: CreateOrderRequest = req.body

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Pedido deve ter pelo menos 1 item' 
      })
    }

    if (!body.total_amount || body.total_amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Total do pedido inválido' 
      })
    }

    // Obter token
    console.log('🔐 Obtendo token...')
    const token = await getToken()

    // Gerar IDs únicos
    const timestamp = Date.now()
    const orderId = `TOTEM-${timestamp}`
    const displayId = String(timestamp).slice(-6) // últimos 6 dígitos

    // Montar payload Saipos
    const saiposPayload: SaiposOrderPayload = {
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
      items: body.items.map(item => ({
        integration_code: item.integration_code,
        desc_item: item.desc_item,
        quantity: item.quantity,
        unit_price: item.unit_price,
        notes: item.notes || '',
        choice_items: [],
      })),
    }

    console.log('📤 Enviando pedido para Saipos:', {
      order_id: orderId,
      display_id: displayId,
      items: body.items.length,
      total: body.total_amount,
    })

    // Enviar para Saipos
    const response = await fetch(`${SAIPOS_BASE_URL}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(saiposPayload),
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error('❌ Erro Saipos:', {
        status: response.status,
        data: responseData,
      })

      return res.status(response.status).json({
        success: false,
        error: 'Erro ao processar pedido. Tente novamente.',
        details: responseData,
      })
    }

    console.log('✅ Pedido criado com sucesso:', orderId)

    return res.status(200).json({
      success: true,
      order_id: orderId,
      display_id: displayId,
      saipos_response: responseData,
    })

  } catch (error: any) {
    console.error('❌ Erro ao criar pedido:', error)

    return res.status(500).json({
      success: false,
      error: 'Erro interno ao processar pedido. Tente novamente.',
      message: error.message,
    })
  }
}
