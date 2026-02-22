// src/App.tsx - VERSÃO COMPLETA FUNCIONANDO

import React, { useState } from 'react'
import { ConfigProvider } from './context/ConfigContext'
import { OrderProvider } from './context/OrderContext'

// Screens
import HomeScreen from './screens/HomeScreen'
import OrderTypeScreen from './screens/OrderTypeScreen'
import MenuScreen from './screens/MenuScreen'
import PaymentScreen from './screens/PaymentScreen'
import SuccessScreen from './screens/SuccessScreen'
import AdminScreen from './screens/AdminScreen'

type Screen = 'HOME' | 'ORDER_TYPE' | 'MENU' | 'PAYMENT' | 'SUCCESS' | 'ADMIN'

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('HOME')
  const [lastOrderId, setLastOrderId] = useState<string>('')

  const renderScreen = () => {
    switch (currentScreen) {
      case 'HOME':
        return (
          <HomeScreen
            onStart={() => setCurrentScreen('ORDER_TYPE')}
            onOpenConfig={() => setCurrentScreen('ADMIN')}
          />
        )

      case 'ORDER_TYPE':
        return (
          <OrderTypeScreen
            onSelect={() => setCurrentScreen('MENU')}
            onBack={() => setCurrentScreen('HOME')}
          />
        )

      case 'MENU':
        return (
          <MenuScreen
            onBack={() => setCurrentScreen('ORDER_TYPE')}
            onCheckout={() => setCurrentScreen('PAYMENT')}
          />
        )

      case 'PAYMENT':
        return (
          <PaymentScreen
            onBack={() => setCurrentScreen('MENU')}
            onSuccess={(orderId) => {
              setLastOrderId(orderId)
              setCurrentScreen('SUCCESS')
            }}
          />
        )

      case 'SUCCESS':
        return (
          <SuccessScreen
            orderId={lastOrderId}
            onNewOrder={() => setCurrentScreen('HOME')}
          />
        )

      case 'ADMIN':
        return (
          <AdminScreen
            onClose={() => setCurrentScreen('HOME')}
          />
        )

      default:
        return (
          <HomeScreen
            onStart={() => setCurrentScreen('ORDER_TYPE')}
            onOpenConfig={() => setCurrentScreen('ADMIN')}
          />
        )
    }
  }

  return <div style={{ width: '100%', minHeight: '100vh' }}>{renderScreen()}</div>
}

function App() {
  return (
    <ConfigProvider>
      <OrderProvider>
        <AppContent />
      </OrderProvider>
    </ConfigProvider>
  )
}

export default App
