import React, { useState } from 'react';
import { OrderProvider } from './context/OrderContext.tsx';
import { ConfigProvider } from './context/ConfigContext.tsx';
import HomeScreen from './screens/HomeScreen.tsx';
import OrderTypeScreen from './screens/OrderTypeScreen.tsx';
import MenuScreen from './screens/MenuScreen.tsx';
import PaymentScreen from './screens/PaymentScreen.tsx';
import SuccessScreen from './screens/SuccessScreen.tsx';
import AdminScreen from './screens/AdminScreen.tsx';

type Screen = 'HOME' | 'ORDER_TYPE' | 'MENU' | 'PAYMENT' | 'SUCCESS' | 'ADMIN';
type OrderType = 'dine-in' | 'takeout';

const AppContent: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('HOME');
  const [orderType, setOrderType] = useState<OrderType | null>(null);
  const [lastOrderId, setLastOrderId] = useState<string>('');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'HOME':
        return (
          <HomeScreen
            onStart={() => setCurrentScreen('ORDER_TYPE')}
            onOpenConfig={() => setCurrentScreen('ADMIN')}
          />
        );

      case 'ORDER_TYPE':
        return (
          <OrderTypeScreen
            onSelectType={(type: OrderType) => {
              setOrderType(type);
              setCurrentScreen('MENU');
            }}
            onBack={() => setCurrentScreen('HOME')}
          />
        );

      case 'MENU':
        return (
          <MenuScreen
            onBack={() => setCurrentScreen('ORDER_TYPE')}
            onCheckout={() => setCurrentScreen('PAYMENT')}
          />
        );

      case 'PAYMENT':
        return (
          <PaymentScreen
            onBack={() => setCurrentScreen('MENU')}
            onSuccess={(id: string) => {
              setLastOrderId(id);
              setCurrentScreen('SUCCESS');
            }}
            orderTotal={0} // Isso virá do OrderContext
          />
        );

      case 'SUCCESS':
        return (
          <SuccessScreen
            orderId={lastOrderId}
            onFinish={() => {
              // Resetar tudo
              setOrderType(null);
              setLastOrderId('');
              setCurrentScreen('HOME');
            }}
          />
        );

      case 'ADMIN':
        return (
          <AdminScreen
            onClose={() => setCurrentScreen('HOME')}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#f9fafb',
      }}
    >
      {renderScreen()}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ConfigProvider>
      <OrderProvider>
        <AppContent />
      </OrderProvider>
    </ConfigProvider>
  );
};

export default App;
