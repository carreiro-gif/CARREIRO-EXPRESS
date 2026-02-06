// src/context/ConfigContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface StoreConfig {
  storeName: string
  logoUrl: string | null
  buttonText: string
  backgroundColor: string
  primaryColor: string
  // Configurações de carrossel
  carouselSlides: Array<{
    id: string
    imageUrl: string
    title?: string
    subtitle?: string
  }>
}

interface ConfigContextType {
  config: StoreConfig
  updateConfig: (newConfig: Partial<StoreConfig>) => void
  resetConfig: () => void
}

const defaultConfig: StoreConfig = {
  storeName: 'CARREIRO LANCHES',
  logoUrl: null,
  buttonText: 'PEÇA AQUI',
  backgroundColor: '#F9FAFB',
  primaryColor: '#E11D48',
  carouselSlides: [
    {
      id: '1',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&h=675&fit=crop',
      title: 'Combo X-Bacon + Batata + Refri',
      subtitle: 'Por apenas R$ 35,90 - Oferta válida hoje!',
    },
    {
      id: '2',
      imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=1200&h=675&fit=crop',
      title: 'Novidade: X-Carreiro Supreme',
      subtitle: 'Hambúrguer artesanal com bacon crocante',
    },
  ],
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined)

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<StoreConfig>(defaultConfig)

  const updateConfig = (newConfig: Partial<StoreConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }))
  }

  const resetConfig = () => {
    setConfig(defaultConfig)
  }

  return (
    <ConfigContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </ConfigContext.Provider>
  )
}

export const useConfig = (): ConfigContextType => {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error('useConfig must be used within ConfigProvider')
  }
  return context
}
