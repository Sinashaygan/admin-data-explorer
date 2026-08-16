import { Stack, Typography } from "@mui/material";

import { OrdersGrid } from "../features/orders/components/OrdersGrid";
import { OrdersFilters } from "../features/orders/components/OrdersFilters";
import { QueryClient } from "@tanstack/react-query";

export const metadata = {
  title: "Orders Management | Admin Dashboard",
  description: "View and manage customer orders efficiently.",
};

type OrderPagePops = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default function OrderPage({ searchParams }: OrderPagePops) {
  const queryClient = new QueryClient();

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Orders</Typography>

      <OrdersFilters />

      <OrdersGrid />
    </Stack>
  );
}
