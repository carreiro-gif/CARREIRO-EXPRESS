import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const response = await fetch(
      `${process.env.BRENDI_API_URL}/stores/${process.env.BRENDI_STORE_ID}/menu`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.BRENDI_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Brendi API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Cache de 5 minutos
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate')
    
    return res.status(200).json(data)
  } catch (error) {
    console.error('Erro ao buscar cardápio:', error)
    return res.status(500).json({ error: 'Erro ao carregar cardápio' })
  }
}
