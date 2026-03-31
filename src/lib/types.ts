
export type AccountCredential = {
  id: string;
  email: string;
  password: string;
  screenName: string;
  screenPassword?: string;
  addedAt: string;
  sold: boolean;
};

export type StreamingService = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  stock: number;
  imageUrl: string;
  active: boolean;
  isPromotion: boolean;
  credentials?: AccountCredential[];
};

export type OrderStatus = 'pending' | 'completed' | 'cancelled';

export type DeliveredCredential = {
  productName: string;
  email: string;
  pass: string;
  screen: string;
  screenPass?: string;
};

export type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  status: OrderStatus;
  date: string;
  total: number;
  items: DeliveredCredential[];
};
