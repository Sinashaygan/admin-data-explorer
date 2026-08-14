export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";
export interface ShippingAddress {
  city: string;
  province: string;
  postal_code: string;
  address: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  status: OrderStatus;
  total_amount: number;
  items_count: number;
  shipping_address?: ShippingAddress | null;
  created_at: string;
}

export interface OrderFilters {
  page: number;
  pageSize: number;
  search?: string;
  status?: OrderStatus[];
  minAmount?: number;
  maxAmount?: number;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}