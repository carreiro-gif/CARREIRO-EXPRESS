
import React, { useState, useEffect, useMemo } from 'react';
import { useOrder } from '../context/OrderContext';
import { Brendi } from '../services/brendi';
import { Category, Product } from '../types';
import Header from '../components/Header';
import ProductModal from '../components/ProductModal';

interface MenuScreenProps {
  onBack: () => void;
  onCheckout: () => void;
}

const MenuScreen: React.FC<MenuScreenProps> = ({ onBack, onCheckout }) => {
  const { cart, addToCart, removeFromCart, updateQuantity, totalAmount } = useOrder();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const data = await Brendi.getMenu();
        setCategories(data.categories);
        setProducts(data.products);
        if (data.categories.length > 0) setSelectedCategoryId(data.categories[0].id);
      } catch (error) {
        console.error('Erro ao carregar menu:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMenu();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.categoryId === selectedCategoryId);
  }, [products, selectedCategoryId]);

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white">
        <div className="w-24 h-24 border-8 border-gray-100 border-t-primary rounded-full animate-spin mb-8"></div>
        <h2 className="text-3xl font-black text-gray-800 animate-pulse uppercase tracking-widest">Sincronizando Brendi...</h2>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <Header onHome={onBack} />

      <div className="flex-1 flex overflow-hidden">
        
        {/* Category Side Bar */}
        <aside className="w-32 sm:w-48 bg-white border-r border-gray-100 flex flex-col py-6">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`flex flex-col items-center gap-3 py-8 px-4 transition-all border-r-8 ${
                selectedCategoryId === cat.id 
                ? 'border-primary bg-gray-50 text-primary' 
                : 'border-transparent text-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="text-4xl">{cat.icon}</span>
              <span className="text-sm sm:text-lg font-black text-center leading-tight uppercase tracking-tight">
                {cat.name}
              </span>
            </button>
          ))}
        </aside>

        {/* Main Product Grid */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-10">
          <div className="mb-10">
            <h2 className="text-5xl font-black text-gray-900 tracking-tighter">
              {categories.find(c => c.id === selectedCategoryId)?.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 pb-32">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 text-left transition-all hover:shadow-2xl hover:scale-[1.03] active:scale-95"
              >
                <div className="h-56 overflow-hidden relative">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-6 right-6 bg-white p-3 rounded-2xl font-black text-primary shadow-xl text-lg">
                        R$ {product.price.toFixed(2)}
                    </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-black text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
                  <p className="text-gray-400 font-medium line-clamp-2 text-lg leading-snug h-14">
                    {product.description}
                  </p>
                  <div className="mt-8 flex justify-end">
                      <div className="bg-primary text-white p-4 rounded-2xl shadow-xl shadow-rose-100 group-hover:rotate-12 transition-transform">
                          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M12 4v16m8-8H4" /></svg>
                      </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </main>

        {/* Floating Cart Panel */}
        <aside className="hidden lg:flex w-[480px] bg-white border-l border-gray-100 flex-col">
          <div className="p-10 flex-1 overflow-y-auto">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Pedido</h2>
                <span className="bg-gray-100 text-gray-500 font-black px-5 py-2 rounded-full text-xl">
                    {cart.length} itens
                </span>
            </div>
            
            {cart.length === 0 ? (
              <div className="h-[70%] flex flex-col items-center justify-center text-center px-12 opacity-30">
                <div className="text-9xl mb-8">🛒</div>
                <p className="text-3xl font-black text-gray-400">Sacola Vazia</p>
                <p className="text-gray-400 font-medium mt-2">Escolha seus itens favoritos no menu ao lado</p>
              </div>
            ) : (
              <div className="space-y-8">
                {cart.map(item => (
                  <div key={item.id} className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-300">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-black text-2xl text-gray-900 tracking-tight">{item.name}</h4>
                        <div className="mt-3 flex flex-wrap gap-2">
                           {item.selectedModifiers.map(m => (
                             <span key={m.optionId} className="text-xs bg-white text-gray-500 px-3 py-1 rounded-full font-black uppercase border border-gray-100">
                                + {m.name}
                             </span>
                           ))}
                        </div>
                        {item.observations && <p className="text-sm italic text-gray-400 mt-4 px-4 py-2 bg-white/50 rounded-xl border border-gray-100">"{item.observations}"</p>}
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2">
                        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-6 bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100">
                            <button onClick={() => updateQuantity(item.id, -1)} className="text-2xl font-black text-primary active:scale-90">-</button>
                            <span className="font-black text-xl w-8 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="text-2xl font-black text-primary active:scale-90">+</button>
                        </div>
                        <span className="font-black text-2xl text-gray-900">
                            R$ {item.totalPrice.toFixed(2)}
                        </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-10 bg-gray-50 border-t border-gray-100">
            <div className="flex justify-between items-center mb-10">
              <span className="text-2xl font-bold text-gray-400">Total a pagar</span>
              <span className="text-5xl font-black text-gray-900">
                R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            
            <button
              disabled={cart.length === 0}
              onClick={onCheckout}
              className={`w-full py-9 rounded-[2.5rem] text-3xl font-black shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-4 ${
                cart.length > 0 
                ? 'bg-primary text-white shadow-rose-200 hover:brightness-110' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              }`}
            >
                <span className="uppercase tracking-tight">Continuar</span>
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
        </aside>
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onConfirm={(qty, mods, obs) => {
            addToCart(selectedProduct, qty, mods, obs);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default MenuScreen;
