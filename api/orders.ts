import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * Tipagem do payload do pedido
 */
interface OrderItem {
  productId: string
  quantity: number
  observations?: string
  price: number
}

interface OrderCustomer {
  name?: string
  phone?: string
}

interface OrderPayload {
  items: OrderItem[]
  customer?: OrderCustomer
  paymentMethod: string
  total: number
  observations?: string
}

/**
 * API Route: POST /api/brendi/orders
 * 
 * Cria um novo pedido na Brendi
 * Esconde as credenciais do frontend
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Aceitar apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Use POST para criar pedidos'
    })
  }

  try {
    // Validar variáveis de ambiente
    const apiUrl = process.env.BRENDI_API_URL
    const storeId = process.env.BRENDI_STORE_ID
    const token = process.env.BRENDI_TOKEN

    if (!apiUrl || !storeId || !token) {
      console.error('❌ Credenciais da Brendi não configuradas no Vercel')
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'Credenciais da Brendi não configuradas'
      })
    }

    // Validar payload do pedido
    const orderData: OrderPayload = req.body

    if (!orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: 'Pedido precisa ter pelo menos 1 item'
      })
    }

    if (!orderData.paymentMethod) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: 'Método de pagamento é obrigatório'
      })
    }

    if (!orderData.total || orderData.total <= 0) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: 'Total do pedido inválido'
      })
    }

    // Fazer requisição para a API da Brendi
    const response = await fetch(
      `${apiUrl}/orders/${storeId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erro na API da Brendi:', response.status, errorText)
      
      return res.status(response.status).json({ 
        error: 'Brendi API error',
        message: `Erro ${response.status} ao criar pedido`,
        details: errorText
      })
    }

    const data = await response.json()
    
    // Não fazer cache de pedidos
    res.setHeader('Cache-Control', 'no-store, must-revalidate')
    
    return res.status(200).json(data)
    
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Erro ao processar pedido',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
