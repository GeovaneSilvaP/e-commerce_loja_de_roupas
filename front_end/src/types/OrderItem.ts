export type OrderItem = {
  id: number;
  name: string;
  quantity: number;
  price_at_purchase: number;
  image_url: string;
};

export type Order = {
  id: number;
  total: number;
  status: string;
  created_at: string;
  items: OrderItem[];
};