
import React, { useState } from 'react';
import { Product, ModifierOption } from '../types';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onConfirm: (quantity: number, modifiers: any[], observations: string) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onConfirm }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<any[]>([]);
  const [observations, setObservations] = useState('');

  const toggleModifier = (group: any, option: ModifierOption) => {
    setSelectedModifiers(prev => {
      const isSelected = prev.find(m => m.optionId === option.id);
      
      if (isSelected) {
        return prev.filter(m => m.optionId !== option.id);
      } else {
        const groupSelected = prev.filter(m => m.groupId === group.id);
        if (groupSelected.length >= group.maxSelection) {
            if (group.maxSelection === 1) {
                return [...prev.filter(m => m.groupId !== group.id), {
                    groupId: group.id,
                    optionId: option.id,
                    name: option.name,
                    price: option.price
                }];
            }
            return prev;
        }
        
        return [...prev, {
          groupId: group.id,
          optionId: option.id,
          name: option.name,
          price: option.price
        }];
      }
    });
  };

  const isOptionSelected = (id: string) => selectedModifiers.some(m => m.optionId === id);

  const calculateTotal = () => {
    const modsTotal = selectedModifiers.reduce((acc, m) => acc + m.price, 0);
    return (product.price + modsTotal) * quantity;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="bg-white rounded-[3rem] w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        
        <div className="flex-1 overflow-y-auto">
          <div className="relative h-72 sm:h-96">
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            <button 
                onClick={onClose}
                className="absolute top-8 right-8 bg-white/90 p-4 rounded-full shadow-xl transition-transform active:scale-90"
            >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="p-10">
            <div className="mb-10">
                <h2 className="text-5xl font-black text-gray-900 mb-3 tracking-tighter">{product.name}</h2>
                <p className="text-2xl text-gray-400 font-medium leading-relaxed">{product.description}</p>
                <p className="text-4xl font-black text-primary mt-6">
                    R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
            </div>

            {product.modifiers?.map(group => (
              <div key={group.id} className="mb-10 bg-gray-50 p-8 rounded-[2rem]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-black text-gray-800 tracking-tight">{group.title}</h3>
                    <span className="text-xs font-black uppercase bg-white px-4 py-2 rounded-full text-gray-400 border-2 border-gray-100 tracking-widest">
                        {group.minSelection > 0 ? 'Obrigatório' : 'Opcional'}
                    </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {group.options.map(option => (
                    <button
                      key={option.id}
                      onClick={() => toggleModifier(group, option)}
                      className={`flex justify-between items-center p-6 rounded-2xl border-4 transition-all active:scale-[0.97] ${
                        isOptionSelected(option.id) 
                        ? 'border-primary bg-rose-50' 
                        : 'border-white bg-white shadow-sm'
                      }`}
                    >
                      <span className={`font-black text-xl ${isOptionSelected(option.id) ? 'text-primary' : 'text-gray-700'}`}>
                        {option.name}
                      </span>
                      <span className="text-gray-400 font-bold">
                        {option.price > 0 ? `+ R$ ${option.price.toFixed(2)}` : 'Grátis'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="mb-4">
              <h3 className="text-2xl font-black text-gray-800 mb-4 tracking-tight">Alguma observação?</h3>
              <textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Ex: Sem cebola, pão bem selado..."
                className="w-full p-8 bg-gray-50 rounded-[2rem] border-2 border-gray-100 focus:border-primary outline-none text-xl min-h-[140px]"
              />
            </div>
          </div>
        </div>

        <div className="p-10 border-t border-gray-100 bg-white flex flex-col sm:flex-row gap-6 items-center">
          <div className="flex items-center gap-8 bg-gray-100 p-3 rounded-[2rem]">
            <button 
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-4xl font-black text-primary active:scale-90 transition-all"
            >
              -
            </button>
            <span className="text-4xl font-black w-10 text-center">{quantity}</span>
            <button 
              onClick={() => setQuantity(prev => prev + 1)}
              className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-4xl font-black text-primary active:scale-90 transition-all"
            >
              +
            </button>
          </div>

          <button
            onClick={() => onConfirm(quantity, selectedModifiers, observations)}
            className="flex-1 w-full bg-primary text-white text-2xl font-black py-8 rounded-[2.5rem] shadow-2xl transition-all active:scale-[0.98] flex justify-between px-12 items-center"
          >
            <span>ADICIONAR AO PEDIDO</span>
            <span>R$ {calculateTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
