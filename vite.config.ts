import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // IMPORTANTE: base deve ser '/' para deploy direto no domínio
  base: '/',
  
  // Configurações de build otimizadas
  build: {
    outDir: 'dist',
    sourcemap: false, // desabilitar em produção para reduzir tamanho
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
  },
  
  // Alias para imports limpos (opcional, mas recomendado)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  // Configuração de preview (para testar build localmente)
  preview: {
    port: 4173,
  },
  
  // Server para desenvolvimento
  server: {
    port: 5173,
  },
})
