import { supabase } from "@/src/lib/supabase";
import { getNextUtcDate } from "../model/order.query-mapper";
import {
  Order,
  OrdersDatabaseQuery,
  OrdersPage,
  OrderStatus,
} from "../model/order.types";

const ORDERS_SELECT =
  "id, order_number, customer_name, customer_email, status, total_amount, items_count, shipping_address, created_at";

function createSearchExpression(search: string): string {
  const safeSearch = search
    .replace(/\\/g, "\\\\")
    .replace(/[%_]/g, "\\$&")
    .replace(/[(),]/g, " ");

  return [
    `order_number.ilike.%${safeSearch}%`,
    `customer_name.ilike.%${safeSearch}%`,
    `customer_email.ilike.%${safeSearch}%`,
  ].join(",");
}

export async function getOrders(
  query: OrdersDatabaseQuery,
): Promise<OrdersPage> {
  let request = supabase
    .from("orders")
    .select(ORDERS_SELECT, { count: "exact" });

  if (query.search) {
    request = request.or(createSearchExpression(query.search));
  }

  if (query.statuses) {
    request = request.in("status", query.statuses);
  }

  if (query.startDate) {
    request = request.gte("created_at", `${query.startDate}T00:00:00.000Z`);
  }

  if (query.endDate) {
    request = request.lt("created_at", getNextUtcDate(query.endDate));
  }

  const { data, error, count } = await request
    .order(query.sortBy, { ascending: query.ascending })
    .range(query.offset, query.offset + query.limit - 1);

  if (error) {
    throw new Error(`Could not fetch orders: ${error.message}`);
  }

  return {
    rows: (data ?? []) as Order[],
    total: count ?? 0,
  };
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<Order> {
  console.log("updateOrderStatus input:", { orderId, status });
  const { data, error } = await supabase
    .from("orders")
    .update({
      status,
      // updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Order;
}