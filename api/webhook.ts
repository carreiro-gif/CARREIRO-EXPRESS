// api/webhook.ts
// Receber eventos da Saipos

import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const event = req.body

    console.log('📩 [WEBHOOK] Saipos:', {
      timestamp: new Date().toISOString(),
      event_type: event.event_type,
      order_id: event.order_id,
      display_id: event.display_id,
    })

    switch (event.event_type) {
      case 'CONFIRMED':
        console.log('✅ Pedido CONFIRMADO:', event.order_id)
        break

      case 'CONCLUDED':
        console.log('🎉 Pedido CONCLUÍDO:', event.order_id)
        break

      case 'CANCELLED':
        console.log('❌ Pedido CANCELADO:', event.order_id)
        break

      default:
        console.log('ℹ️ Evento:', event.event_type)
    }

    return res.status(200).json({
      success: true,
      message: 'Webhook recebido',
      event_type: event.event_type,
    })

  } catch (error: any) {
    console.error('❌ [WEBHOOK] Erro:', error)
    return res.status(200).json({
      success: false,
      error: 'Erro ao processar webhook',
    })
  }
}
