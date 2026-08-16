import { Stack, Typography } from "@mui/material";

import { OrdersGrid } from "../features/orders/components/OrdersGrid";
import { OrdersFilters } from "../features/orders/components/OrdersFilters";

export const metadata = {
  title: "Orders Management | Admin Dashboard",
  description: "View and manage customer orders efficiently.",
};

export default function Home() {
  return (
    <Stack spacing={2}>
      <Typography variant="h5">Orders</Typography>

      <OrdersFilters/>

      <OrdersGrid />
    </Stack>
  );
}
