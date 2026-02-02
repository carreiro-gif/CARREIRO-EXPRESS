
import React from 'react';
import { useOrder } from '../context/OrderContext';
import { useConfig } from '../context/ConfigContext';

const Header: React.FC<{ onHome: () => void }> = ({ onHome }) => {
  const { orderType } = useOrder();
  const { config } = useConfig();

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center shadow-sm">
      <div 
        className="flex items-center gap-3 cursor-pointer" 
        onClick={onHome}
      >
        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden shadow-sm border border-gray-100">
            {config.logoImage ? (
              <img src={config.logoImage} className="w-full h-full object-contain" alt="Store logo" />
            ) : (
              <span className="text-2xl">🍔</span>
            )}
        </div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tighter">
          {config.storeName}
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        {orderType && (
          <div className="bg-gray-100 px-4 py-2 rounded-full text-sm font-bold text-gray-600 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            {orderType === 'BALCAO' ? 'PARA COMER AQUI' : 'PARA LEVAR'}
          </div>
        )}
        <button 
          onClick={onHome}
          className="text-gray-300 hover:text-primary transition-colors active:scale-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
