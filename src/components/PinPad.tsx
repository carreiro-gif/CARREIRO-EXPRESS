import React, { useState } from 'react';

interface PinPadProps {
  correctPin: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const PinPad: React.FC<PinPadProps> = ({ correctPin, onSuccess, onCancel }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handlePress = (num: string) => {
    if (pin.length >= 4) return;

    const newPin = pin + num;
    setPin(newPin);

    if (newPin.length === 4) {
      if (newPin === correctPin) {
        onSuccess();
      } else {
        setError(true);
        setTimeout(() => {
          setPin('');
          setError(false);
        }, 800);
      }
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.95)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
    >
      {/* TÍTULO */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h2 style={{ color: '#fff', fontSize: 40, marginBottom: 12 }}>
          Acesso Restrito
        </h2>
        <p style={{ color: '#aaa', fontSize: 20 }}>
          Digite o PIN do Administrador
        </p>
      </div>

      {/* INDICADOR PIN */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 56 }}>
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              border: '3px solid #555',
              backgroundColor:
                pin.length > i
                  ? error
                    ? '#ef4444'
                    : '#3b82f6'
                  : 'transparent'
            }}
          />
        ))}
      </div>

      {/* TECLADO */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 90px)',
          gap: 20
        }}
      >
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <button
            key={n}
            onClick={() => handlePress(n.toString())}
            style={{
              width: 90,
              height: 90,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.12)',
              color: '#fff',
              fontSize: 32,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {n}
          </button>
        ))}

        <button
          onClick={onCancel}
          style={{
            width: 90,
            height: 90,
            borderRadius: '50%',
            backgroundColor: 'transparent',
            color: '#aaa',
            fontSize: 14,
            fontWeight: 700,
            border: '2px solid #555',
            cursor: 'pointer'
          }}
        >
          SAIR
        </button>

        <button
          onClick={() => handlePress('0')}
          style={{
            width: 90,
            height: 90,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.12)',
            color: '#fff',
            fontSize: 32,
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer'
          }}
        >
          0
        </button>

        <button
          onClick={handleBackspace}
          style={{
            width: 90,
            height: 90,
            borderRadius: '50%',
            backgroundColor: 'transparent',
            color: '#aaa',
            fontSize: 24,
            border: '2px solid #555',
            cursor: 'pointer'
          }}
        >
          ⌫
        </button>
      </div>
    </div>
  );
};

export default PinPad;
