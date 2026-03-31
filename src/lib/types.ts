
export type StreamingService = {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  stock: number;
  imageUrl: string;
  active: boolean;
};

export type OrderStatus = 'pending' | 'completed' | 'cancelled';

export type Order = {
  id: string;
  productId: string;
  productName: string;
  customerEmail: string;
  status: OrderStatus;
  date: string;
  total: number;
  credentialsSent?: boolean;
};
