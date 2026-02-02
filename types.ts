
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  modifiers?: ModifierGroup[];
}

export interface ModifierGroup {
  id: string;
  title: string;
  minSelection: number;
  maxSelection: number;
  options: ModifierOption[];
}

export interface ModifierOption {
  id: string;
  name: string;
  price: number;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export interface CartItem {
  id: string; // unique instance id
  productId: string;
  name: string;
  basePrice: number;
  quantity: number;
  totalPrice: number;
  selectedModifiers: Array<{
    groupId: string;
    optionId: string;
    name: string;
    price: number;
  }>;
  observations?: string;
}

export enum OrderOrigin {
  TOTEM = 'TOTEM'
}

export enum OrderType {
  DINE_IN = 'BALCAO',
  TAKE_OUT = 'RETIRADA'
}

export type PaymentMethod = 
  | 'CREDITO' 
  | 'DEBITO' 
  | 'DINHEIRO' 
  | 'PIX' 
  | 'VALE_REFEICAO' 
  | 'VALE_ALIMENTACAO';

export interface OrderPayload {
  origin: OrderOrigin;
  type: OrderType;
  customerName?: string;
  items: CartItem[];
  paymentMethod: PaymentMethod;
  paymentDetails?: {
    needsChange?: boolean;
    changeFor?: number;
    voucherBrand?: string;
  };
  total: number;
}

export interface KioskConfig {
  storeName: string;
  slogan: string;
  logoImage: string | null; // Base64 string
  primaryColor: string;
  backgroundColor: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
  adminPin: string;
  dineInButtonTitle: string;
  dineInButtonSubtitle: string;
  takeOutButtonTitle: string;
  takeOutButtonSubtitle: string;
}
