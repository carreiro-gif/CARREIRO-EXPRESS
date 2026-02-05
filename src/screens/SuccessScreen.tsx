
import React, { useEffect, useState } from 'react';
import { useOrder } from '../context/OrderContext';

interface SuccessScreenProps {
  orderId: string;
  onFinish: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ orderId, onFinish }) => {
  const { clearCart } = useOrder();
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          onFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-white p-6">
      <div className="max-w-3xl w-full text-center">
        <div className="mb-12">
            <div className="w-56 h-56 bg-green-50 rounded-full mx-auto flex items-center justify-center animate-bounce shadow-inner border-4 border-green-100">
                <svg className="w-28 h-28 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                </svg>
            </div>
        </div>

        <h1 className="text-7xl font-black text-gray-900 mb-6 tracking-tighter leading-tight">
          Pedido Confirmado!
        </h1>
        
        <p className="text-3xl text-gray-400 font-medium mb-12 max-w-2xl mx-auto">
          Obrigado pela preferência! Seu pedido já está sendo preparado pela nossa equipe.
        </p>

        <div className="space-y-6 max-w-xl mx-auto">
            <div className="p-10 bg-gray-50 rounded-[2.5rem] border-2 border-gray-100 text-left flex items-start gap-8">
                <span className="text-5xl">✅</span>
                <div>
                    <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Tudo pronto</h3>
                    <p className="text-gray-500 text-lg font-medium mt-2 leading-relaxed">
                        Retire seu pedido no balcão assim que seu nome for chamado. <br/>
                        Acompanhe o status pelo monitor da loja.
                    </p>
                </div>
            </div>

            <button
                onClick={onFinish}
                className="w-full bg-gray-900 text-white text-3xl font-black py-9 rounded-[2.5rem] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4"
            >
                VOLTAR AO INÍCIO 
                <span className="bg-white/20 px-4 py-1 rounded-full text-xl">{countdown}s</span>
            </button>
        </div>

        <p className="mt-12 text-gray-300 font-bold uppercase tracking-widest text-sm">
           ID do Pedido: {orderId}
        </p>
      </div>
    </div>
  );
};

export default SuccessScreen;
