import type { OrderFilters, OrderSortField, OrderStatus } from "./order.types";

export const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const satisfies readonly OrderStatus[];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const ORDER_PAGE_SIZES = [25, 50, 100] as const;

export const ORDER_SORT_FIELDS = [
  "created_at",
  "total_amount",
  "status",
  "customer_name",
  "order_number",
] as const satisfies readonly OrderSortField[];

export const PAGE_RESET_FILTER_KEYS: ReadonlyArray<keyof OrderFilters> = [
  "search",
  "status",
  "startDate",
  "endDate",
];
