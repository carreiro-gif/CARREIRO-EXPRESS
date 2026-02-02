
import React, { useState, useRef } from 'react';
import { useOrder } from '../context/OrderContext';
import { useConfig } from '../context/ConfigContext';
import { OrderType } from '../types';
import PinPad from '../components/PinPad';
import AdminScreen from './AdminScreen';

interface HomeScreenProps {
  onStart: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onStart }) => {
  const { setOrderType, clearCart } = useOrder();
  const { config } = useConfig();
  
  // Admin logic
  const [tapCount, setTapCount] = useState(0);
  const [showPinPad, setShowPinPad] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const tapTimeoutRef = useRef<number | null>(null);

  const handleLogoTap = () => {
    if (tapTimeoutRef.current) window.clearTimeout(tapTimeoutRef.current);
    
    const newCount = tapCount + 1;
    setTapCount(newCount);

    if (newCount >= 3) {
      setTapCount(0);
      setShowPinPad(true);
    } else {
      tapTimeoutRef.current = window.setTimeout(() => {
        setTapCount(0);
      }, 2000);
    }
  };

  const handleSelectType = (type: OrderType) => {
    clearCart();
    setOrderType(type);
    onStart();
  };

  return (
    <div className="h-full flex flex-col items-center justify-center relative bg-dynamic transition-colors duration-1000">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-black rounded-full blur-3xl"></div>
      </div>

      <div className="z-10 text-center px-6">
        <div className="mb-12">
            <button 
              onClick={handleLogoTap}
              className="w-48 h-48 bg-white rounded-[2.5rem] mx-auto flex items-center justify-center shadow-2xl ring-8 ring-white/20 animate-bounce active:scale-95 transition-all overflow-hidden"
            >
                 {config.logoImage ? (
                   <img src={config.logoImage} className="w-full h-full object-contain p-4" alt="Store logo" />
                 ) : (
                   <div className="flex flex-col items-center">
                     <span className="text-7xl">🍔</span>
                     <span className="text-xs font-black text-gray-300 uppercase tracking-widest mt-2">Brendi Kiosk</span>
                   </div>
                 )}
            </button>
        </div>
        
        <h1 className="text-6xl sm:text-8xl font-black text-white mb-6 tracking-tighter drop-shadow-lg leading-none">
          {config.welcomeTitle.split('<br/>').map((line, i) => (
            <React.Fragment key={i}>
              {line} <br/>
            </React.Fragment>
          ))}
        </h1>
        <p className="text-2xl text-white/80 mb-16 font-medium max-w-lg mx-auto leading-relaxed">
          {config.welcomeSubtitle}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl w-full">
          <button
            onClick={() => handleSelectType(OrderType.DINE_IN)}
            className="group bg-white p-10 rounded-[2.5rem] shadow-2xl transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-6"
          >
            <div className="text-6xl group-hover:rotate-12 transition-transform">🍽️</div>
            <div>
                <h3 className="text-3xl font-black text-gray-900">{config.dineInButtonTitle}</h3>
                <p className="text-gray-500 font-semibold mt-1">{config.dineInButtonSubtitle}</p>
            </div>
          </button>

          <button
            onClick={() => handleSelectType(OrderType.TAKE_OUT)}
            className="group bg-black/20 backdrop-blur-md p-10 rounded-[2.5rem] shadow-2xl transition-all hover:scale-105 active:scale-95 border-4 border-white/20 flex flex-col items-center gap-6"
          >
            <div className="text-6xl group-hover:rotate-12 transition-transform">🛍️</div>
            <div>
                <h3 className="text-3xl font-black text-white">{config.takeOutButtonTitle}</h3>
                <p className="text-white/60 font-semibold mt-1">{config.takeOutButtonSubtitle}</p>
            </div>
          </button>
        </div>
        
        <div className="mt-20 flex flex-col items-center gap-4 text-white/40">
            <div className="w-1 h-12 bg-white/30 rounded-full animate-pulse"></div>
            <p className="text-lg font-bold tracking-widest uppercase">{config.slogan}</p>
        </div>
      </div>

      {/* Admin Overlays */}
      {showPinPad && (
        <PinPad 
          correctPin={config.adminPin}
          onSuccess={() => {
            setShowPinPad(false);
            setShowAdmin(true);
          }}
          onCancel={() => setShowPinPad(false)}
        />
      )}

      {showAdmin && (
        <AdminScreen onClose={() => setShowAdmin(false)} />
      )}
    </div>
  );
};

export default HomeScreen;
