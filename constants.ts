import { Category, Product } from "./types";

/**
 * Categorias mockadas (modo fallback / testes / totem offline)
 */
export const MOCK_CATEGORIES: Category[] = [
  {
    id: "burgers",
    name: "Hambúrgueres",
    order: 1,
  },
  {
    id: "combos",
    name: "Combos",
    order: 2,
  },
  {
    id: "bebidas",
    name: "Bebidas",
    order: 3,
  },
];

/**
 * Produtos mockados
 */
export const MOCK_PRODUCTS: Product[] = [
  {
    id: "carreiro-duplo",
    name: "Duplo Carreiro",
    description: "Hambúrguer duplo com queijo e molho especial",
    price: 29.9,
    categoryId: "burgers",
    image: "",
    active: true,
  },
  {
    id: "combo-casal",
    name: "Combo Casal Carreiro",
    description: "2 lanches + fritas + refrigerante",
    price: 59.9,
    categoryId: "combos",
    image: "",
    active: true,
  },
  {
    id: "refrigerante-lata",
    name: "Refrigerante Lata",
    description: "350ml",
    price: 6.0,
    categoryId: "bebidas",
    image: "",
    active: true,
  },
];
