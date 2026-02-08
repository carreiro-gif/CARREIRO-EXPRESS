// src/context/ConfigContext.tsx - VERSÃO COMPLETA

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CarouselSlide {
  id: string
  imageUrl: string
  title?: string
  subtitle?: string
}

export interface StoreConfig {
  storeName: string
  tagline: string // NOVO! Editável
  logoUrl: string | null
  buttonText: string
  buttonTextColor: string
  backgroundColor: string
  primaryColor: string
  textColor: string
  secondaryTextColor: string
  carouselSlides: CarouselSlide[]
  enabledPaymentMethods: string[]
}

interface ConfigContextType {
  config: StoreConfig
  updateConfig: (newConfig: Partial<StoreConfig>) => void
  resetConfig: () => void
}

const defaultConfig: StoreConfig = {
  storeName: 'CARREIRO LANCHES',
  tagline: 'Hambúrgueres artesanais', // Editável
  logoUrl: null,
  buttonText: 'PEÇA AQUI',
  buttonTextColor: '#FFFFFF',
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
  const [loaded, setLoaded] = useState(false)

  // Carregar do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setConfig({ ...defaultConfig, ...parsed })
        console.log('✅ Config carregado:', parsed)
      }
    } catch (error) {
      console.error('❌ Erro ao carregar config:', error)
    } finally {
      setLoaded(true)
    }
  }, [])

  // Salvar no localStorage
  const updateConfig = (newConfig: Partial<StoreConfig>) => {
    setConfig((prev) => {
      const updated = { ...prev, ...newConfig }
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        console.log('✅ Config salvo:', updated)
      } catch (error) {
        console.error('❌ Erro ao salvar config:', error)
      }
      
      return updated
    })
  }

  const resetConfig = () => {
    setConfig(defaultConfig)
    localStorage.removeItem(STORAGE_KEY)
  }

  // Não renderizar até carregar
  if (!loaded) {
    return <div>Carregando...</div>
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
