import { Order, OrderStatus } from "../model/order.types";

export async function patchOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<Order> {
    const response = await fetch(
      `api/orders/${encodeURIComponent(orderId)}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      },
    );
}