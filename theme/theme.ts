// src/theme/theme.ts

/**
 * DESIGN SYSTEM - CARREIRO EXPRESS
 * Inspirado em: McDonald's, Burger King, KFC, Bob's
 * Foco: Touch-first, alta legibilidade, conversão rápida
 */

export const theme = {
  // CORES PRINCIPAIS
  colors: {
    // Primárias (identidade da marca)
    primary: {
      main: '#E11D48',      // Vermelho vibrante (CTA principal)
      dark: '#BE123C',      // Vermelho escuro (hover)
      light: '#FB7185',     // Vermelho claro (destaque)
      contrast: '#FFFFFF',  // Texto sobre primária
    },
    
    // Secundárias
    secondary: {
      main: '#F59E0B',      // Laranja/Amarelo (promoções)
      dark: '#D97706',
      light: '#FCD34D',
      contrast: '#000000',
    },
    
    // Neutros
    neutral: {
      white: '#FFFFFF',
      black: '#000000',
      gray: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
      },
    },
    
    // Feedback
    success: '#10B981',     // Verde (confirmação)
    warning: '#F59E0B',     // Laranja (atenção)
    error: '#EF4444',       // Vermelho (erro)
    info: '#3B82F6',        // Azul (informação)
    
    // Backgrounds
    background: {
      default: '#F9FAFB',   // Fundo padrão
      paper: '#FFFFFF',     // Cards/Modais
      dark: '#1F2937',      // Footer/Header escuro
    },
    
    // Overlays
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  // TIPOGRAFIA
  typography: {
    fontFamily: {
      primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      display: '"Inter", sans-serif',
    },
    
    // Tamanhos para TOUCH (mínimo 44px de altura)
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
    },
    
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  // ESPAÇAMENTOS (baseado em grid de 8px)
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
    '4xl': '6rem',   // 96px
    '5xl': '8rem',   // 128px
  },
  
  // BORDAS
  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',  // Totalmente arredondado
  },
  
  // SOMBRAS (profundidade visual)
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },
  
  // TRANSIÇÕES
  transitions: {
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },
  
  // BREAKPOINTS (responsivo)
  breakpoints: {
    mobile: '640px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },
  
  // COMPONENTES ESPECÍFICOS
  components: {
    // Botões
    button: {
      height: {
        sm: '40px',
        md: '56px',    // Padrão touch (min 44px)
        lg: '72px',
        xl: '96px',
      },
      padding: {
        sm: '0.5rem 1rem',
        md: '0.75rem 1.5rem',
        lg: '1rem 2rem',
        xl: '1.5rem 3rem',
      },
    },
    
    // Cards de produto
    productCard: {
      width: '280px',
      imageHeight: '200px',
      spacing: '1rem',
    },
    
    // Carrossel
    carousel: {
      aspectRatio: '16/9',
      autoplayDelay: 5000,
      transitionDuration: '500ms',
    },
    
    // Modal
    modal: {
      maxWidth: '600px',
      borderRadius: '1rem',
      padding: '2rem',
    },
  },
  
  // Z-INDEX (camadas)
  zIndex: {
    base: 0,
    dropdown: 10,
    sticky: 20,
    modal: 100,
    popover: 200,
    toast: 300,
    tooltip: 400,
  },
} as const

export type Theme = typeof theme
