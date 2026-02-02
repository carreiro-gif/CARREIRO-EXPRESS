
import React, { createContext, useContext, useState, useEffect } from 'react';
import { KioskConfig } from '../types';

interface ConfigContextType {
  config: KioskConfig;
  updateConfig: (newConfig: Partial<KioskConfig>) => void;
  resetConfig: () => void;
}

const DEFAULT_CONFIG: KioskConfig = {
  storeName: 'Totem Burger',
  slogan: 'Powered by Brendi',
  logoImage: null,
  primaryColor: '#E11D48',
  backgroundColor: '#E11D48',
  welcomeTitle: 'Bateu aquela fome?',
  welcomeSubtitle: 'Peça agora de forma rápida e retire seu pedido no balcão quando estiver pronto!',
  adminPin: '1234',
  dineInButtonTitle: 'Comer aqui',
  dineInButtonSubtitle: 'Servido no balcão',
  takeOutButtonTitle: 'Para levar',
  takeOutButtonSubtitle: 'Embalagem especial',
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<KioskConfig>(() => {
    const saved = localStorage.getItem('kiosk_config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  useEffect(() => {
    localStorage.setItem('kiosk_config', JSON.stringify(config));
    // Aplica as variáveis CSS globais para cores dinâmicas
    document.documentElement.style.setProperty('--primary-color', config.primaryColor);
    document.documentElement.style.setProperty('--bg-color', config.backgroundColor);
  }, [config]);

  const updateConfig = (newConfig: Partial<KioskConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const resetConfig = () => {
    setConfig(DEFAULT_CONFIG);
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) throw new Error('useConfig must be used within ConfigProvider');
  return context;
};
