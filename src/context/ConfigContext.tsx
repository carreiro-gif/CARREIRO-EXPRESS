// src/context/ConfigContext.tsx - SALVAMENTO GARANTIDO

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CarouselSlide {
  id: string
  imageUrl: string
  title?: string
  subtitle?: string
}

export interface StoreConfig {
  storeName: string
  tagline: string
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
  tagline: 'Hambúrgueres artesanais',
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

const STORAGE_KEY = 'carreiro-express-config-v2'

const ConfigContext = createContext<ConfigContextType | undefined>(undefined)

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<StoreConfig>(defaultConfig)
  const [isLoaded, setIsLoaded] = useState(false)

  // Carregar do localStorage AO INICIAR
  useEffect(() => {
    const loadConfig = () => {
      try {
        const savedConfigString = localStorage.getItem(STORAGE_KEY)
        
        if (savedConfigString) {
          const savedConfig = JSON.parse(savedConfigString)
          
          // Mesclar com defaults (caso tenha campos novos)
          const mergedConfig = {
            ...defaultConfig,
            ...savedConfig,
          }
          
          setConfig(mergedConfig)
          console.log('✅ Config carregado do localStorage:', mergedConfig)
        } else {
          console.log('📝 Usando config padrão (primeira vez)')
        }
      } catch (error) {
        console.error('❌ Erro ao carregar config:', error)
        console.log('🔄 Usando config padrão devido ao erro')
      } finally {
        setIsLoaded(true)
      }
    }

    loadConfig()
  }, [])

  // Salvar no localStorage TODA VEZ que config mudar
  useEffect(() => {
    if (!isLoaded) return // Não salvar antes de carregar

    try {
      const configString = JSON.stringify(config)
      localStorage.setItem(STORAGE_KEY, configString)
      console.log('💾 Config salvo automaticamente:', config)
    } catch (error) {
      console.error('❌ Erro ao salvar config:', error)
    }
  }, [config, isLoaded])

  const updateConfig = (newConfig: Partial<StoreConfig>) => {
    setConfig((prev) => {
      const updated = { ...prev, ...newConfig }
      console.log('🔄 Atualizando config:', updated)
      return updated
    })
  }

  const resetConfig = () => {
    setConfig(defaultConfig)
    try {
      localStorage.removeItem(STORAGE_KEY)
      console.log('🗑️ Config resetado para padrão')
    } catch (error) {
      console.error('❌ Erro ao resetar config:', error)
    }
  }

  // Não renderizar até carregar
  if (!isLoaded) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        fontWeight: 600,
      }}>
        Carregando configurações...
      </div>
    )
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
