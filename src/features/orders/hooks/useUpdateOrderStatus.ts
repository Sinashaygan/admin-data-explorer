import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OptionsObject, SnackbarKey } from "notistack";
import { Order, OrderStatus } from "../model/order.types";
import { patchOrderStatus } from "../api/orders.client";

type OrdersQueryData = {
  rows: Order[];
  total: number;
};

type MutationContext = {
  previousQueries: Array<[readonly unknown[], OrdersQueryData | undefined]>;
};

type EnqueueSnackbar = (
  message: string,
  options?: OptionsObject,
) => SnackbarKey;

export function useUpdateOrderStatus(enqueueSnackbar: EnqueueSnackbar) {
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
        queryKey: ["orders", "list"],
      });

      const previousQueries = queryClient.getQueriesData<OrdersQueryData>({
        queryKey: ["orders", "list"],
      });

      queryClient.setQueriesData<OrdersQueryData>(
        { queryKey: ["orders", "list"] },
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

    onError: (error, _variables, context) => {
      context?.previousQueries.forEach(([queryKey, previousData]) => {
        queryClient.setQueryData(queryKey, previousData);
      });

      enqueueSnackbar(error.message, {
        variant: "error",
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders", "list"],
      });
    },
  });
}
