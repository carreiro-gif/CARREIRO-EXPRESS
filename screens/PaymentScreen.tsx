
import React, { useState, useMemo } from 'react';
import { useOrder } from '../context/OrderContext';
import { Brendi } from '../services/brendi';
import { PaymentMethod, OrderPayload, OrderOrigin } from '../types';
import Header from '../components/Header';

interface PaymentScreenProps {
  onBack: () => void;
  onSuccess: (orderId: string) => void;
}

interface PaymentOption {
  id: PaymentMethod;
  label: string;
  icon: string;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  { id: 'CREDITO', label: 'Cartão de Crédito', icon: '💳' },
  { id: 'DEBITO', label: 'Cartão de Débito', icon: '💳' },
  { id: 'PIX', label: 'PIX (QR Code)', icon: '📱' },
  { id: 'DINHEIRO', label: 'Dinheiro', icon: '💵' },
  { id: 'VALE_REFEICAO', label: 'Vale Refeição', icon: '🎟️' },
  { id: 'VALE_ALIMENTACAO', label: 'Vale Alimentação', icon: '🛒' },
];

const VOUCHER_BRANDS = ['Sodexo', 'VR', 'Green-card', 'Alelo', 'Ticket'];

type SubStep = 'SELECTION' | 'CASH_CHANGE' | 'VOUCHER_INFO';

const PaymentScreen: React.FC<PaymentScreenProps> = ({ onBack, onSuccess }) => {
  const { cart, totalAmount, orderType } = useOrder();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [subStep, setSubStep] = useState<SubStep>('SELECTION');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Cash details
  const [needsChange, setNeedsChange] = useState<boolean | null>(null);
  const [changeFor, setChangeFor] = useState<string>('');

  // Voucher details
  const [selectedVoucherBrand, setSelectedVoucherBrand] = useState<string | null>(null);

  const calculatedChange = useMemo(() => {
    const value = parseFloat(changeFor);
    if (isNaN(value) || value <= totalAmount) return 0;
    return value - totalAmount;
  }, [changeFor, totalAmount]);

  const handleSelectPayment = (method: PaymentMethod) => {
    setSelectedPayment(method);
    // Reset specific details when switching methods
    setNeedsChange(null);
    setChangeFor('');
    setSelectedVoucherBrand(null);

    if (method === 'DINHEIRO') {
      setSubStep('CASH_CHANGE');
    } else if (method === 'VALE_REFEICAO' || method === 'VALE_ALIMENTACAO') {
      setSubStep('VOUCHER_INFO');
    } else {
      setSubStep('SELECTION');
    }
  };

  const isCurrentSelectionValid = useMemo(() => {
    if (!selectedPayment) return false;
    if (selectedPayment === 'DINHEIRO') {
      if (needsChange === null) return false;
      if (needsChange === true && calculatedChange <= 0) return false;
      return true;
    }
    if (selectedPayment === 'VALE_REFEICAO' || selectedPayment === 'VALE_ALIMENTACAO') {
      return !!selectedVoucherBrand;
    }
    return true; // PIX, Crédito, Débito
  }, [selectedPayment, needsChange, calculatedChange, selectedVoucherBrand]);

  const handleFinishOrder = async () => {
    if (!isCurrentSelectionValid || cart.length === 0) return;

    setIsProcessing(true);
    
    const payload: OrderPayload = {
      origin: OrderOrigin.TOTEM,
      type: orderType!,
      items: cart,
      paymentMethod: selectedPayment!,
      paymentDetails: {
        needsChange: needsChange === true,
        changeFor: needsChange ? parseFloat(changeFor) : undefined,
        voucherBrand: selectedVoucherBrand || undefined
      },
      total: totalAmount
    };

    try {
      const res = await Brendi.createOrder(payload);
      if (res.success && res.orderId) {
        onSuccess(res.orderId);
      }
    } catch (error: any) {
      alert(error.message || "Erro ao processar o pagamento.");
    } finally {
      setIsProcessing(false);
    }
  };

  const renderSelection = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">Forma de Pagamento</h2>
        <p className="text-2xl text-gray-400 font-medium">Como deseja pagar seu pedido?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {PAYMENT_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelectPayment(option.id)}
            className={`flex flex-col items-center gap-4 p-8 rounded-[2.5rem] border-4 transition-all active:scale-95 shadow-lg ${
              selectedPayment === option.id
                ? 'border-primary bg-rose-50'
                : 'border-white bg-white hover:border-gray-200'
            }`}
          >
            <span className="text-6xl">{option.icon}</span>
            <span className={`text-xl font-black tracking-tight ${
                selectedPayment === option.id ? 'text-primary' : 'text-gray-700'
            }`}>
                {option.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderCashChange = () => (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-2xl mx-auto w-full">
      <div className="text-center mb-10">
        <div className="text-7xl mb-4">💵</div>
        <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">Pagamento em Dinheiro</h2>
        <p className="text-xl text-gray-400 font-medium">Você precisa de troco?</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-10">
        <button
          onClick={() => { setNeedsChange(false); setSubStep('SELECTION'); }}
          className={`p-10 rounded-[2rem] border-4 transition-all flex flex-col items-center gap-4 shadow-md ${
            needsChange === false ? 'border-primary bg-rose-50' : 'bg-white border-transparent'
          }`}
        >
          <span className="text-4xl">🙅‍♂️</span>
          <span className="text-xl font-black text-gray-700">Não preciso</span>
        </button>
        <button
          onClick={() => setNeedsChange(true)}
          className={`p-10 rounded-[2rem] border-4 transition-all flex flex-col items-center gap-4 shadow-md ${
            needsChange === true ? 'border-primary bg-rose-50' : 'bg-white border-transparent'
          }`}
        >
          <span className="text-4xl">🙋‍♂️</span>
          <span className="text-xl font-black text-gray-700">Preciso de troco</span>
        </button>
      </div>

      {needsChange && (
        <div className="animate-in zoom-in-95 duration-300">
          <label className="block text-gray-500 font-bold mb-4 text-center">Troco para quanto?</label>
          <div className="relative max-w-xs mx-auto">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-400">R$</span>
            <input
              type="number"
              value={changeFor}
              onChange={(e) => setChangeFor(e.target.value)}
              placeholder="0,00"
              className="w-full pl-16 pr-8 py-6 bg-white rounded-2xl border-4 border-gray-100 text-3xl font-black text-gray-900 focus:border-primary outline-none text-center"
            />
          </div>

          {calculatedChange > 0 && (
            <div className="mt-8 p-8 bg-green-50 border-2 border-green-100 rounded-[2rem] text-center animate-in fade-in slide-in-from-bottom-4">
               <p className="text-green-800 font-bold text-xl uppercase tracking-widest mb-2">Troco Calculado</p>
               <h4 className="text-4xl font-black text-green-600">
                 Você receberá R$ {calculatedChange.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} de troco
               </h4>
            </div>
          )}

          <button 
            onClick={() => setSubStep('SELECTION')}
            disabled={calculatedChange <= 0}
            className="w-full mt-8 bg-gray-900 text-white py-6 rounded-[2rem] font-black text-2xl active:scale-95 transition-all disabled:opacity-30 disabled:scale-100"
          >
            CONFIRMAR TROCO
          </button>
          
          {changeFor && parseFloat(changeFor) <= totalAmount && (
            <p className="text-rose-500 text-center mt-4 font-bold">O valor do pagamento deve ser maior que o total (R$ {totalAmount.toFixed(2)}).</p>
          )}
        </div>
      )}

      <button onClick={() => { setSelectedPayment(null); setSubStep('SELECTION'); setNeedsChange(null); }} className="mt-8 mx-auto block text-gray-400 font-bold hover:underline">
        Voltar e escolher outra forma
      </button>
    </div>
  );

  const renderVoucherInfo = () => (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-2xl mx-auto w-full">
      <div className="text-center mb-10">
        <div className="text-7xl mb-4">🎟️</div>
        <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">Selecione a Bandeira</h2>
        <p className="text-xl text-gray-400 font-medium">Qual cartão de benefício você irá utilizar?</p>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-10">
        {VOUCHER_BRANDS.map(brand => (
          <button 
            key={brand} 
            onClick={() => setSelectedVoucherBrand(brand)}
            className={`flex items-center justify-between p-6 rounded-2xl border-4 transition-all active:scale-[0.98] ${
                selectedVoucherBrand === brand 
                ? 'border-primary bg-rose-50 shadow-md' 
                : 'border-white bg-white hover:border-gray-100'
            }`}
          >
             <div className="flex items-center gap-6">
                <div className={`w-5 h-5 rounded-full border-4 ${selectedVoucherBrand === brand ? 'bg-primary border-primary' : 'border-gray-200'}`}></div>
                <span className={`text-2xl font-black ${selectedVoucherBrand === brand ? 'text-primary' : 'text-gray-800'}`}>{brand}</span>
             </div>
             {selectedVoucherBrand === brand && (
                 <span className="text-primary font-black text-xs uppercase tracking-widest bg-white px-3 py-1 rounded-full">Selecionado</span>
             )}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <button 
          onClick={() => setSubStep('SELECTION')}
          disabled={!selectedVoucherBrand}
          className={`w-full py-8 rounded-[2rem] font-black text-2xl shadow-xl transition-all active:scale-95 ${
            selectedVoucherBrand 
            ? 'bg-primary text-white' 
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          CONFIRMAR BANDEIRA
        </button>
        <button 
          onClick={() => { setSelectedPayment(null); setSubStep('SELECTION'); setSelectedVoucherBrand(null); }} 
          className="text-gray-400 font-bold hover:underline py-4"
        >
          Voltar e escolher outra forma
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <Header onHome={onBack} />

      <main className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
        <div className="max-w-4xl w-full py-10">
          
          {subStep === 'SELECTION' && renderSelection()}
          {subStep === 'CASH_CHANGE' && renderCashChange()}
          {subStep === 'VOUCHER_INFO' && renderVoucherInfo()}

          {/* Resumo e Ação Final (Apenas quando no passo principal) */}
          {subStep === 'SELECTION' && (
            <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-8 animate-in slide-in-from-bottom-8 duration-700">
              <div className="text-center sm:text-left">
                <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">Total do Pedido</span>
                <div className="text-5xl font-black text-gray-900">
                  R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                {selectedPayment && (
                    <div className="mt-3 flex flex-col gap-1">
                        <div className="text-primary font-black uppercase text-xs tracking-widest flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                           PAGAMENTO: {PAYMENT_OPTIONS.find(o => o.id === selectedPayment)?.label}
                        </div>
                        {selectedPayment === 'DINHEIRO' && needsChange !== null && (
                            <div className="text-gray-500 font-bold text-sm">
                                {needsChange ? `Receberá R$ ${calculatedChange.toFixed(2)} de troco` : 'Sem troco necessário'}
                            </div>
                        )}
                        {(selectedPayment === 'VALE_REFEICAO' || selectedPayment === 'VALE_ALIMENTACAO') && selectedVoucherBrand && (
                            <div className="text-gray-500 font-bold text-sm">
                                Bandeira: {selectedVoucherBrand}
                            </div>
                        )}
                    </div>
                )}
              </div>

              <button
                disabled={!isCurrentSelectionValid || isProcessing}
                onClick={handleFinishOrder}
                className={`px-16 py-8 rounded-[2rem] text-3xl font-black shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-4 ${
                  isCurrentSelectionValid && !isProcessing
                    ? 'bg-primary text-white shadow-rose-200 hover:brightness-110'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>ENVIANDO...</span>
                  </>
                ) : (
                  <span>FINALIZAR PEDIDO</span>
                )}
              </button>
            </div>
          )}
          
          {subStep === 'SELECTION' && (
            <button 
                onClick={onBack}
                className="mt-10 mx-auto block text-gray-400 font-black text-xl hover:text-gray-600 transition-colors"
            >
                VOLTAR AO CARRINHO
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default PaymentScreen;
