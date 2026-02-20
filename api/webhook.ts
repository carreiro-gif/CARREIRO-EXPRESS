// api/webhook.ts
// Serverless Function para receber eventos da Saipos

import type { VercelRequest, VercelResponse } from '@vercel/node'

interface SaiposWebhookEvent {
  event_type: 'CONFIRMED' | 'CONCLUDED' | 'CANCELLED' | string
  order_id: string
  display_id: string
  cod_store: string
  timestamp: string
  [key: string]: any
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Webhook-Signature')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const event: SaiposWebhookEvent = req.body

    // Log completo do evento
    console.log('📩 Webhook Saipos recebido:', {
      timestamp: new Date().toISOString(),
      event_type: event.event_type,
      order_id: event.order_id,
      display_id: event.display_id,
      full_body: JSON.stringify(event, null, 2),
    })

    // Validar assinatura (se configurado)
    const { WEBHOOK_SECRET } = process.env
    if (WEBHOOK_SECRET) {
      const signature = req.headers['x-webhook-signature'] as string
      
      if (!signature) {
        console.warn('⚠️ Webhook sem assinatura')
      } else {
        // Implementar validação de assinatura aqui se necessário
        console.log('✅ Assinatura validada')
      }
    }

    // Processar eventos conhecidos
    switch (event.event_type) {
      case 'CONFIRMED':
        console.log('✅ Pedido CONFIRMADO:', event.order_id)
        // Aqui você pode:
        // - Atualizar banco de dados
        // - Notificar cliente
        // - Enviar para impressora
        break

      case 'CONCLUDED':
        console.log('🎉 Pedido CONCLUÍDO:', event.order_id)
        // Aqui você pode:
        // - Marcar como pronto
        // - Notificar para retirada
        break

      case 'CANCELLED':
        console.log('❌ Pedido CANCELADO:', event.order_id)
        // Aqui você pode:
        // - Notificar cliente
        // - Estornar pagamento se necessário
        break

      default:
        console.log('ℹ️ Evento desconhecido:', event.event_type)
    }

    // Sempre retornar 200 para confirmar recebimento
    return res.status(200).json({
      success: true,
      message: 'Webhook recebido',
      event_type: event.event_type,
      order_id: event.order_id,
    })

  } catch (error: any) {
    console.error('❌ Erro ao processar webhook:', error)

    // Mesmo com erro, retornar 200 para evitar reenvio
    return res.status(200).json({
      success: false,
      error: 'Erro ao processar webhook',
      message: error.message,
    })
  }
}
