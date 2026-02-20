// api/create-order.ts
// Criar pedido Saipos - SANDBOX REAL

import type { VercelRequest, VercelResponse } from '@vercel/node'

// Função interna de token (igual ao token.ts)
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

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Auth falhou: ${response.status} - ${text}`)
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

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed' 
    })
  }

  try {
    const { SAIPOS_COD_STORE, SAIPOS_BASE_URL } = process.env

    if (!SAIPOS_COD_STORE || !SAIPOS_BASE_URL) {
      throw new Error('Configuração incompleta')
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
        error: 'Total inválido' 
      })
    }

    // Obter token
    console.log('🔐 [SAIPOS] Obtendo token...')
    const token = await getToken()

    // Gerar IDs únicos
    const timestamp = Date.now()
    const orderId = `TOTEM-${timestamp}`
    const displayId = String(timestamp).slice(-6)

    // Montar payload
    const payload: SaiposOrderPayload = {
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

    console.log('📤 [SAIPOS] POST /order', {
      order_id: orderId,
      display_id: displayId,
      cod_store: SAIPOS_COD_STORE,
      items: body.items.length,
      total: body.total_amount,
      url: `${SAIPOS_BASE_URL}/order`,
    })

    // Enviar para Saipos
    const orderUrl = `${SAIPOS_BASE_URL}/order`
    
    const response = await fetch(orderUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    const responseText = await response.text()

    console.log('📥 [SAIPOS] Order response', {
      status: response.status,
      statusText: response.statusText,
      body: responseText.substring(0, 500),
    })

    if (!response.ok) {
      console.error('❌ [SAIPOS] Erro ao criar pedido:', {
        status: response.status,
        response: responseText,
        payload: JSON.stringify(payload, null, 2),
      })

      return res.status(response.status).json({
        success: false,
        error: 'Erro ao processar pedido',
        details: responseText,
      })
    }

    const responseData = JSON.parse(responseText)

    console.log('✅ [SAIPOS] Pedido criado com sucesso:', {
      order_id: orderId,
      display_id: displayId,
      saipos_id: responseData.id || 'N/A',
    })

    return res.status(200).json({
      success: true,
      order_id: orderId,
      display_id: displayId,
      saipos_response: responseData,
    })

  } catch (error: any) {
    console.error('❌ [HANDLER] Erro ao criar pedido:', {
      message: error.message,
      stack: error.stack?.substring(0, 500),
    })

    return res.status(500).json({
      success: false,
      error: 'Erro interno ao processar pedido',
      message: error.message,
    })
  }
}
