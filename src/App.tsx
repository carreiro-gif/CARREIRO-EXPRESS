// src/App.tsx
// COM ProductsProvider

import React, { useState } from 'react'
import { ConfigProvider } from './context/ConfigContext'
import { OrderProvider } from './context/OrderContext'
import { ProductsProvider } from './context/ProductsContext'
import HomeScreen from './screens/HomeScreen'
import OrderTypeScreen from './screens/OrderTypeScreen'
import MenuScreen from './screens/MenuScreen'
import PaymentScreen from './screens/PaymentScreen'
import SuccessScreen from './screens/SuccessScreen'
import AdminScreen from './screens/AdminScreen'

type Screen = 'home' | 'order-type' | 'menu' | 'payment' | 'success' | 'admin'

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home')
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway'>('takeaway')
  const [orderId, setOrderId] = useState<string>('')

  const handleAdminAccess = () => {
    setCurrentScreen('admin')
  }

  const handleOrderTypeSelect = (type: 'dine-in' | 'takeaway') => {
    setOrderType(type)
    setCurrentScreen('menu')
  }

  const handlePaymentSuccess = (id: string) => {
    setOrderId(id)
    setCurrentScreen('success')
  }

  const handleBackToHome = () => {
    setCurrentScreen('home')
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            onStart={() => setCurrentScreen('order-type')}
            onAdminAccess={handleAdminAccess}
          />
        )

      case 'order-type':
        return (
          <OrderTypeScreen
            onSelect={handleOrderTypeSelect}
            onBack={handleBackToHome}
          />
        )

      case 'menu':
        return (
          <MenuScreen
            onBack={() => setCurrentScreen('order-type')}
            onCheckout={() => setCurrentScreen('payment')}
          />
        )

      case 'payment':
        return (
          <PaymentScreen
            onBack={() => setCurrentScreen('menu')}
            onSuccess={handlePaymentSuccess}
          />
        )

      case 'success':
        return (
          <SuccessScreen
            orderId={orderId}
            orderType={orderType}
            onBackToHome={handleBackToHome}
          />
        )

      case 'admin':
        return (
          <AdminScreen
            onClose={handleBackToHome}
          />
        )

      default:
        return null
    }
  }

  return (
    <ConfigProvider>
      <OrderProvider>
        <ProductsProvider>
          {renderScreen()}
        </ProductsProvider>
      </OrderProvider>
    </ConfigProvider>
  )
}

export default App
