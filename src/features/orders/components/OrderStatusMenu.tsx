"use client";

import {
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useSnackbar } from "notistack";

import { useUpdateOrderStatus } from "../hooks/useUpdateOrderStatus";
import type { OrderStatus } from "../model/order.types";
import { ORDER_STATUSES } from "../model/order.constants";

type OrderStatusMenuProps = {
  orderId: string;
  value: OrderStatus;
};

export function OrderStatusMenu({ orderId, value }: OrderStatusMenuProps) {
  const { enqueueSnackbar } = useSnackbar();
  const mutation = useUpdateOrderStatus(enqueueSnackbar);

  const handleChange = (event: SelectChangeEvent<OrderStatus>) => {
    mutation.mutate({
      orderId,
      status: event.target.value as OrderStatus,
    });
  };

  return (
    <FormControl size="small" sx={{ minWidth: 130 }}>
      <Select
        value={value}
        onChange={handleChange}
        disabled={mutation.isPending}
        inputProps={{
          "aria-label": "Change order status",
        }}
      >
        {ORDER_STATUSES.map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </Select>

      {mutation.isPending && (
        <CircularProgress
          size={16}
          sx={{
            position: "absolute",
            right: 28,
            top: 12,
          }}
        />
      )}
    </FormControl>
  );
}
