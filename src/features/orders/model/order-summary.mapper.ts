import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "./order.constants";
import type { Order, OrderStatus } from "./order.types";

export type SummaryStatus = OrderStatus | "unknown";

export type OrderSummaryItem = {
  status: SummaryStatus;
  label: string;
  count: number;
  revenue: number;
};

export type OrderSummary = {
  totalOrders: number;
  totalRevenue: number;
  pendingOrProcessing: number;
  statusDistribution: OrderSummaryItem[];
  revenueByStatus: OrderSummaryItem[];
};

const UNKNOWN_STATUS: OrderSummaryItem = {
  status: "unknown",
  label: "Unknown",
  count: 0,
  revenue: 0,
};

function isOrderStatus(value: string): value is OrderStatus {
  return ORDER_STATUSES.some((status) => status === value);
}

export function buildOrderSummary(orders: readonly Order[]): OrderSummary {
  const items = new Map<SummaryStatus, OrderSummaryItem>(
    ORDER_STATUSES.map((status) => [
      status,
      {
        status,
        label: ORDER_STATUS_LABELS[status],
        count: 0,
        revenue: 0,
      },
    ]),
  );

  let totalRevenue = 0;

  for (const order of orders) {
    const status = isOrderStatus(order.status) ? order.status : "unknown";
    const amount = Number.isFinite(order.total_amount) ? order.total_amount : 0;
    const current = items.get(status) ?? { ...UNKNOWN_STATUS };

    items.set(status, {
      ...current,
      count: current.count + 1,
      revenue: current.revenue + amount,
    });
    totalRevenue += amount;
  }

  const summaryItems = [...items.values()];
  const pendingOrProcessing = summaryItems
    .filter(({ status }) => status === "pending" || status === "processing")
    .reduce((sum, { count }) => sum + count, 0);

  return {
    totalOrders: orders.length,
    totalRevenue,
    pendingOrProcessing,
    statusDistribution: summaryItems,
    revenueByStatus: summaryItems,
  };
}
