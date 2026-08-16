export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderSortField =
  | "created_at"
  | "total_amount"
  | "status"
  | "customer_name"
  | "order_number";

export interface ShippingAddress {
  city: string;
  province?: string;
  postal_code?: string;
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
  shipping_address: ShippingAddress | null;
  created_at: string;
}

export interface OrderFilters {
  page: number;
  pageSize: number;
  search: string;
  status: OrderStatus[];
  startDate?: string;
  endDate?: string;
  sortBy: OrderSortField;
  sortOrder: "asc" | "desc";
}

export interface OrdersPage {
  rows: Order[];
  total: number;
}

export interface OrdersDatabaseQuery {
  offset: number;
  limit: number;
  search?: string;
  statuses?: OrderStatus[];
  startDate?: string;
  endDate?: string;
  sortBy: OrderSortField;
  ascending: boolean;
}

export interface UpdateOrderStatusInput {
  orderId: string;
  status: OrderStatus;
}