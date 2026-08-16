import { updateOrderStatus } from "@/src/features/orders/api/orders.repository";
import { NextResponse } from "next/server";
import z from "zod";

const updateStatusSchemas = z.object({
  status: z.enum([
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ]),
});

type RouteContext = {
  params: Promise<{
    orderId: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
     try {
       const { orderId } = await context.params;

       if (!orderId) {
         return NextResponse.json(
           { message: "Order id is required" },
           { status: 400 },
         );
       }

       const body: unknown = await request.json();
       const parsedBody = updateStatusSchemas.safeParse(body);

       if (!parsedBody.success) {
         return NextResponse.json(
           {
             message: "Invalid order status",
             issues: parsedBody.error.flatten(),
           },
           { status: 422 },
         );
       }

       const order = await updateOrderStatus(orderId, parsedBody.data.status);

       return NextResponse.json(order);
     } catch (error) {
       const message =
         error instanceof Error
           ? error.message
           : "Failed to update order status";

       return NextResponse.json({ message }, { status: 500 });
     }
}
