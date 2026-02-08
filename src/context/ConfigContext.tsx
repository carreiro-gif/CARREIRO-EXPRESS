// src/context/ConfigContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CarouselSlide {
  id: string
  imageUrl: string
  title?: string
  subtitle?: string
}

export interface StoreConfig {
  storeName: string
  logoUrl: string | null
  buttonText: string
  buttonTextColor: string // NOVO!
  backgroundColor: string
  primaryColor: string
  textColor: string // NOVO!
  secondaryTextColor: string // NOVO!
  carouselSlides: CarouselSlide[]
  enabledPaymentMethods: string[] // NOVO!
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
  buttonTextColor: '#FFFFFF', // Branco por padrão
  backgroundColor: '#F9FAFB',
  primaryColor: '#E11D48',
  textColor: '#111827',
  secondaryTextColor: '#6B7280',
  carouselSlides: [],
  enabledPaymentMethods: ['debit', 'credit', 'pix', 'cash', 'meal-voucher', 'food-voucher'],
}

const STORAGE_KEY = 'carreiro-express-config'

const ConfigContext = createContext<ConfigContextType | undefined>(undefined)

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<StoreConfig>(defaultConfig)

  // Carregar configuração do localStorage ao iniciar
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem(STORAGE_KEY)
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig)
        setConfig({ ...defaultConfig, ...parsed })
        console.log('✅ Configurações carregadas do localStorage')
      }
    } catch (error) {
      console.error('❌ Erro ao carregar configurações:', error)
    }
  }, [])

  // Salvar no localStorage sempre que config mudar
  const updateConfig = (newConfig: Partial<StoreConfig>) => {
    setConfig((prev) => {
      const updated = { ...prev, ...newConfig }
      
      // Salvar no localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        console.log('✅ Configurações salvas no localStorage:', updated)
      } catch (error) {
        console.error('❌ Erro ao salvar configurações:', error)
      }
      
      return updated
    })
  }

  const resetConfig = () => {
    setConfig(defaultConfig)
    localStorage.removeItem(STORAGE_KEY)
    console.log('🔄 Configurações resetadas')
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
