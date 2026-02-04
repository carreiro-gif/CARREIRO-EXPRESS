import React, { useState } from 'react';
import { OrderProvider } from './context/OrderContext';
import { ConfigProvider } from './context/ConfigContext';

import StartScreen from './screens/StartScreen';
import MenuScreen from './screens/MenuScreen';
import PaymentScreen from './screens/PaymentScreen';
import SuccessScreen from './screens/SuccessScreen';

type Screen = 'START' | 'MENU' | 'PAYMENT' | 'SUCCESS';

const AppContent: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('START');
  const [lastOrderId, setLastOrderId] = useState<string>('');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'START':
        return (
          <StartScreen
            onStart={() => setCurrentScreen('MENU')}
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
            onSuccess={(id) => {
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
        backgroundColor: '#f9fafb'
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
