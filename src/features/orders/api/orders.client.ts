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

    const payload: unknown = await response.json();

    if (!response.ok) {
      const message =
        typeof payload === "object" &&
        payload !== null &&
        "message" in payload &&
        typeof payload.message === "string"
          ? payload.message
          : "Failed to update order status";

      throw new Error(message);
    }

    return payload as Order;
}