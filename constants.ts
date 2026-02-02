export const APP_CONFIG = {
  // Integração
  ORIGIN: 'TOTEM',
  API_URL: 'https://api.brendi.com.br/v1',

  // Branding (white-label)
  BRAND: {
    STORE_NAME: 'Espaço Carreiro Lanches',
    SYSTEM_NAME: 'Carreiro Express',

    LOGO: {
      TYPE: 'image', // 'image' | 'icon'
      IMAGE_URL: '/assets/logo.png',
      ICON: '🍔',
    },

    COLORS: {
      PRIMARY: '#C62828',
      SECONDARY: '#FFC107',
      BACKGROUND: '#FFFFFF',
      TEXT: '#111827',
    },

    TEXTS: {
      WELCOME_TITLE: 'Bem-vindo ao Carreiro Express',
      WELCOME_SUBTITLE: 'Escolha seu lanche e faça seu pedido',
      EAT_HERE_LABEL: 'Comer aqui',
      TAKE_AWAY_LABEL: 'Para levar',
    },
  },

  // Segurança do painel administrador
  ADMIN: {
    ENABLED: true,
    ACCESS_MODE: 'LOGO_MULTI_CLICK', // futuro: 'PIN_BUTTON'
    CLICK_COUNT: 3,
    DEFAULT_PIN: '1234',
  },
};
