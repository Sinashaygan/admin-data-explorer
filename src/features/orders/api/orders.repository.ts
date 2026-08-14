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