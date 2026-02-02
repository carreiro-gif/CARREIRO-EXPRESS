
import { Category, Product } from './types';

export const APP_CONFIG = {
  ORIGIN: 'TOTEM',
  API_URL: 'https://api.brendi.com.br/v1', // Placeholder for Brendi API
  BRAND_NAME: 'Totem Burger',
  PRIMARY_COLOR: '#E11D48', // Tailwind Rose-600
};

export const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Hambúrgueres', icon: '🍔' },
  { id: '2', name: 'Acompanhamentos', icon: '🍟' },
  { id: '3', name: 'Bebidas', icon: '🥤' },
  { id: '4', name: 'Sobremesas', icon: '🍦' },
  { id: '5', name: 'Combos', icon: '🍱' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    categoryId: '1',
    name: 'Classic Smash Burger',
    description: 'Pão brioche, blend de 120g, queijo cheddar, alface, tomate e molho especial.',
    price: 28.90,
    imageUrl: 'https://picsum.photos/seed/burger1/400/300',
    modifiers: [
      {
        id: 'mod1',
        title: 'Escolha o ponto da carne',
        minSelection: 1,
        maxSelection: 1,
        options: [
          { id: 'o1', name: 'Mal passado', price: 0 },
          { id: 'o2', name: 'Ao ponto', price: 0 },
          { id: 'o3', name: 'Bem passado', price: 0 },
        ]
      },
      {
        id: 'mod2',
        title: 'Adicionais',
        minSelection: 0,
        maxSelection: 5,
        options: [
          { id: 'o4', name: 'Bacon Extra', price: 4.50 },
          { id: 'o5', name: 'Ovo frito', price: 3.00 },
          { id: 'o6', name: 'Cebola Caramelizada', price: 3.50 },
        ]
      }
    ]
  },
  {
    id: 'p2',
    categoryId: '1',
    name: 'Double Bacon King',
    description: 'Dois blends de 120g, muito bacon crocante, queijo duplo e maionese defumada.',
    price: 39.90,
    imageUrl: 'https://picsum.photos/seed/burger2/400/300'
  },
  {
    id: 'p3',
    categoryId: '2',
    name: 'Batata Frita Média',
    description: 'Porção crocante de batatas palito levemente salgadas.',
    price: 14.50,
    imageUrl: 'https://picsum.photos/seed/fries/400/300'
  },
  {
    id: 'p4',
    categoryId: '3',
    name: 'Coca-Cola 350ml',
    description: 'Lata gelada.',
    price: 6.00,
    imageUrl: 'https://picsum.photos/seed/soda/400/300'
  },
  {
    id: 'p5',
    categoryId: '3',
    name: 'Suco de Laranja Natural',
    description: '500ml de suco espremido na hora.',
    price: 12.00,
    imageUrl: 'https://picsum.photos/seed/juice/400/300'
  }
];
