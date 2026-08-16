import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Order, OrderStatus } from "../model/order.types";

type OrdersQueryData = {
  rows: Order[];
  total: number;
};

type MutationContext = {
  previousQueries: Array<[readonly unknown[], OrdersQueryData | undefined]>;
};

export function useUpdateOrderStatus() {
    const queryClient = useQueryClient();

    return useMutation<
      Error,
      Order,
      {
        orderId: string;
        status: OrderStatus;
      },
      MutationContext
    >({});
}