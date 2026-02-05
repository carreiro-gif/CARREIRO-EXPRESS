import React, { useState } from 'react';
import { OrderProvider } from './context/OrderContext.tsx';
import { ConfigProvider } from './context/ConfigContext.tsx';
import StartScreen from './screens/StartScreen.tsx';
import MenuScreen from './screens/MenuScreen.tsx';
import PaymentScreen from './screens/PaymentScreen.tsx';
import SuccessScreen from './screens/SuccessScreen.tsx';
import ConfigScreen from './pages/config/ConfigScreen.tsx';

type Screen = 'START' | 'MENU' | 'PAYMENT' | 'SUCCESS' | 'CONFIG';

const AppContent: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('START');
  const [lastOrderId, setLastOrderId] = useState<string>('');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'START':
        return (
          <StartScreen
            onStart={() => setCurrentScreen('MENU')}
            onOpenConfig={() => setCurrentScreen('CONFIG')}
          />
        );
      case 'MENU':
        return (
          <MenuScreen
            onBack={() => setCurrentScreen('START')}
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
            onFinish={() => setCurrentScreen('START')}
          />
        );
      case 'CONFIG':
        return (
          <ConfigScreen
            onClose={() => setCurrentScreen('START')}
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
