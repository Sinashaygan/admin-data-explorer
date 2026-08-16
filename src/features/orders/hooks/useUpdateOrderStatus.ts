import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Order, OrderStatus } from "../model/order.types";
import { patchOrderStatus } from "../api/orders.client";

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
    Order,
    Error,
    {
      orderId: string;
      status: OrderStatus;
    },
    MutationContext
  >({
    mutationFn: ({ orderId, status }) => patchOrderStatus(orderId, status),

    onMutate: async ({ orderId, status }) => {
      await queryClient.cancelQueries({
        queryKey: ["orders"],
      });

      const previousQueries = queryClient.getQueriesData<OrdersQueryData>({
        queryKey: ["orders"],
      });

      queryClient.setQueriesData<OrdersQueryData>(
        { queryKey: ["orders"] },
        (currentData) => {
          if (!currentData) {
            return currentData;
          }

          return {
            ...currentData,
            rows: currentData.rows.map((order) =>
              order.id === orderId ? { ...order, status } : order,
            ),
          };
        },
      );

      return { previousQueries };
    },
    
    onError: (_error, _variables, context) => {
      context?.previousQueries.forEach(
        ([queryKey, previousData]) => {
          queryClient.setQueryData(
            queryKey,
            previousData,
          );
        },
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });
}
