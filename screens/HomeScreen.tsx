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
    <div
      style={{
        height: '100%',
        width: '100%',
        backgroundColor: '#e11d48',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      <div style={{ textAlign: 'center', color: '#fff', maxWidth: 900, padding: 24 }}>
        
        {/* LOGO */}
        <button
          onClick={handleLogoTap}
          style={{
            width: 180,
            height: 180,
            borderRadius: 40,
            backgroundColor: '#fff',
            border: 'none',
            marginBottom: 48,
            cursor: 'pointer'
          }}
        >
          {config.logoImage ? (
            <img
              src={config.logoImage}
              alt="Logo"
              style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 16 }}
            />
          ) : (
            <span style={{ fontSize: 72 }}>🍔</span>
          )}
        </button>

        {/* TEXTO */}
        <h1 style={{ fontSize: 64, fontWeight: 900, lineHeight: 1 }}>
          {config.welcomeTitle.split('<br/>').map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </h1>

        <p style={{ fontSize: 22, opacity: 0.9, margin: '24px 0 64px' }}>
          {config.welcomeSubtitle}
        </p>

        {/* BOTÕES */}
        <div style={{ display: 'flex', gap: 32, justifyContent: 'center' }}>
          <button
            onClick={() => handleSelectType(OrderType.DINE_IN)}
            style={{
              padding: 40,
              width: 260,
              borderRadius: 32,
              backgroundColor: '#fff',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: 48 }}>🍽️</div>
            <h3 style={{ fontSize: 28, marginTop: 16 }}>
              {config.dineInButtonTitle}
            </h3>
            <p>{config.dineInButtonSubtitle}</p>
          </button>

          <button
            onClick={() => handleSelectType(OrderType.TAKE_OUT)}
            style={{
              padding: 40,
              width: 260,
              borderRadius: 32,
              backgroundColor: '#00000033',
              color: '#fff',
              border: '2px solid #ffffff55',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: 48 }}>🛍️</div>
            <h3 style={{ fontSize: 28, marginTop: 16 }}>
              {config.takeOutButtonTitle}
            </h3>
            <p>{config.takeOutButtonSubtitle}</p>
          </button>
        </div>

        <p style={{ marginTop: 64, opacity: 0.6, letterSpacing: 2 }}>
          {config.slogan}
        </p>
      </div>

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

      {showAdmin && <AdminScreen onClose={() => setShowAdmin(false)} />}
    </div>
  );
};

export default HomeScreen;
