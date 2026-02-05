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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMenu() {
      try {
        const data = await Brendi.getMenu();
        setCategories(data.categories);
        setProducts(data.products);
        if (data.categories.length > 0) {
          setSelectedCategoryId(data.categories[0].id);
        }
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.categoryId === selectedCategoryId);
  }, [products, selectedCategoryId]);

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 24,
        fontWeight: 'bold'
      }}>
        Carregando menu...
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header onHome={onBack} />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* CATEGORIAS */}
        <aside style={{
          width: 160,
          backgroundColor: '#fff',
          borderRight: '1px solid #ddd',
          overflowY: 'auto'
        }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              style={{
                width: '100%',
                padding: 16,
                cursor: 'pointer',
                backgroundColor: selectedCategoryId === cat.id ? '#eee' : '#fff',
                border: 'none',
                borderBottom: '1px solid #ddd',
                fontWeight: 'bold'
              }}
            >
              {cat.name}
            </button>
          ))}
        </aside>

        {/* PRODUTOS */}
        <main style={{
          flex: 1,
          padding: 24,
          overflowY: 'auto',
          backgroundColor: '#f5f5f5'
        }}>
          <h2 style={{ marginBottom: 24 }}>
            {categories.find(c => c.id === selectedCategoryId)?.name}
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 24
          }}>
            {filteredProducts.map(product => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                style={{
                  backgroundColor: '#fff',
                  padding: 16,
                  borderRadius: 12,
                  cursor: 'pointer',
                  border: '1px solid #ddd'
                }}
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: 140,
                    objectFit: 'cover',
                    borderRadius: 8,
                    marginBottom: 12
                  }}
                />
                <strong>{product.name}</strong>
                <p style={{ fontSize: 14, color: '#666' }}>{product.description}</p>
                <div style={{ marginTop: 8, fontWeight: 'bold' }}>
                  R$ {product.price.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* CARRINHO */}
        <aside style={{
          width: 360,
          backgroundColor: '#fff',
          borderLeft: '1px solid #ddd',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ padding: 24, flex: 1, overflowY: 'auto' }}>
            <h3>Pedido</h3>

            {cart.map(item => (
              <div key={item.id} style={{
                borderBottom: '1px solid #ddd',
                padding: '12px 0'
              }}>
                <strong>{item.name}</strong>
                <div>
                  <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                  <span style={{ margin: '0 8px' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                </div>
                <div>R$ {item.totalPrice.toFixed(2)}</div>
                <button onClick={() => removeFromCart(item.id)}>Remover</button>
              </div>
            ))}
          </div>

          <div style={{ padding: 24, borderTop: '1px solid #ddd' }}>
            <div style={{ fontWeight: 'bold', marginBottom: 16 }}>
              Total: R$ {totalAmount.toFixed(2)}
            </div>
            <button
              onClick={onCheckout}
              disabled={cart.length === 0}
              style={{
                width: '100%',
                padding: 16,
                fontSize: 18,
                cursor: cart.length === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              Continuar
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
