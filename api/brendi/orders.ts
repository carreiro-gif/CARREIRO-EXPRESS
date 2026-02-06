import type { VercelRequest, VercelResponse } from '@vercel/node'

interface OrderPayload {
  orderType: 'dine-in' | 'takeout'
  items: Array<{
    productId: string
    quantity: number
    price: number
    observations?: string
  }>
  paymentMethod: string
  total: number
  customer?: {
    name?: string
    phone?: string
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const orderData: OrderPayload = req.body

    // Validações
    if (!orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ error: 'Pedido vazio' })
    }

    if (!orderData.paymentMethod) {
      return res.status(400).json({ error: 'Método de pagamento obrigatório' })
    }

    // Montar payload para a Brendi
    const brendiPayload = {
      storeId: process.env.BRENDI_STORE_ID,
      orderType: orderData.orderType,
      items: orderData.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price,
        observations: item.observations || '',
      })),
      payment: {
        method: orderData.paymentMethod,
        amount: orderData.total,
      },
      customer: orderData.customer || {},
      createdAt: new Date().toISOString(),
    }

    // Enviar para a Brendi
    const response = await fetch(
      `${process.env.BRENDI_API_URL}/orders`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.BRENDI_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(brendiPayload),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erro na API da Brendi:', errorText)
      return res.status(response.status).json({ error: 'Erro ao criar pedido' })
    }

    const data = await response.json()
    
    return res.status(200).json(data)
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    return res.status(500).json({ error: 'Erro ao processar pedido' })
  }
}
