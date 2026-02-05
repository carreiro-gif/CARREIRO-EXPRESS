import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * API Route: GET /api/brendi/menu
 * 
 * Busca o cardápio completo da Brendi
 * Esconde as credenciais do frontend
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Aceitar apenas GET
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Use GET para buscar o cardápio'
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

    // Fazer requisição para a API da Brendi
    const response = await fetch(
      `${apiUrl}/menu/${storeId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erro na API da Brendi:', response.status, errorText)
      
      return res.status(response.status).json({ 
        error: 'Brendi API error',
        message: `Erro ${response.status} ao buscar cardápio`,
        details: errorText
      })
    }

    const data = await response.json()
    
    // Cache de 5 minutos (300 segundos)
    // Reduz requisições repetidas e melhora performance
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate')
    
    return res.status(200).json(data)
    
  } catch (error) {
    console.error('Erro ao buscar cardápio:', error)
    
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Erro ao processar requisição',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
