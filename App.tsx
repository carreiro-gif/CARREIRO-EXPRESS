
import React, { useState } from 'react';
import { OrderProvider } from './context/OrderContext';
import { ConfigProvider } from './context/ConfigContext';
import HomeScreen from './screens/HomeScreen';
import MenuScreen from './screens/MenuScreen';
import PaymentScreen from './screens/PaymentScreen';
import SuccessScreen from './screens/SuccessScreen';

type Screen = 'HOME' | 'MENU' | 'PAYMENT' | 'SUCCESS';

const AppContent: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('HOME');
  const [lastOrderId, setLastOrderId] = useState<string>('');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'HOME':
        return <HomeScreen onStart={() => setCurrentScreen('MENU')} />;
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
            onFinish={() => setCurrentScreen('HOME')} 
          />
        );
      default:
        return <HomeScreen onStart={() => setCurrentScreen('MENU')} />;
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden">
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
