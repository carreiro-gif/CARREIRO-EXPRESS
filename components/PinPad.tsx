
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
    if (pin.length < 4) {
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
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-[110] bg-gray-900/95 flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="text-center mb-12">
        <h2 className="text-white text-4xl font-black mb-4">Acesso Restrito</h2>
        <p className="text-gray-400 text-xl font-medium">Digite o PIN do Administrador</p>
      </div>

      <div className={`flex gap-6 mb-16 ${error ? 'animate-bounce' : ''}`}>
        {[1, 2, 3, 4].map((_, i) => (
          <div 
            key={i} 
            className={`w-8 h-8 rounded-full border-4 transition-all duration-200 ${
              pin.length > i 
              ? (error ? 'bg-red-500 border-red-500' : 'bg-blue-500 border-blue-500') 
              : 'border-gray-700'
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 max-w-sm w-full">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
          <button
            key={n}
            onClick={() => handlePress(n.toString())}
            className="w-24 h-24 bg-white/10 text-white text-4xl font-black rounded-full hover:bg-white/20 active:bg-white/30 transition-all active:scale-90"
          >
            {n}
          </button>
        ))}
        <button 
          onClick={onCancel}
          className="w-24 h-24 text-gray-500 text-lg font-black uppercase hover:text-white transition-colors"
        >
          Sair
        </button>
        <button
          onClick={() => handlePress('0')}
          className="w-24 h-24 bg-white/10 text-white text-4xl font-black rounded-full hover:bg-white/20 active:bg-white/30 transition-all active:scale-90"
        >
          0
        </button>
        <button
          onClick={handleBackspace}
          className="w-24 h-24 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 002-2h-8.172a2 2 0 00-1.414.586L3 12z" /></svg>
        </button>
      </div>
    </div>
  );
};

export default PinPad;
