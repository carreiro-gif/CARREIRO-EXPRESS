import React, { useState } from 'react';
import { OrderProvider } from './context/OrderContext.tsx';
import { ConfigProvider } from './context/ConfigContext.tsx';
import HomeScreen from './screens/HomeScreen.tsx';
import MenuScreen from './screens/MenuScreen.tsx';
import PaymentScreen from './screens/PaymentScreen.tsx';
import SuccessScreen from './screens/SuccessScreen.tsx';
import AdminScreen from './screens/AdminScreen.tsx';

type Screen = 'HOME' | 'MENU' | 'PAYMENT' | 'SUCCESS' | 'ADMIN';

const AppContent: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('HOME');
  const [lastOrderId, setLastOrderId] = useState<string>('');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'HOME':
        return (
          <HomeScreen
            onStart={() => setCurrentScreen('MENU')}
            onOpenConfig={() => setCurrentScreen('ADMIN')}
          />
        );
      case 'MENU':
        return (
          <MenuScreen
            onBack={() => setCurrentScreen('HOME')}
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
          />
        );
      case 'SUCCESS':
        return (
          <SuccessScreen
            orderId={lastOrderId}
            onFinish={() => setCurrentScreen('HOME')}
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
