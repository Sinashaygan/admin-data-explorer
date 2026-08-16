import { Stack, Typography } from "@mui/material";

import { OrdersGrid } from "../features/orders/components/OrdersGrid";
import { OrdersFilters } from "../features/orders/components/OrdersFilters";

export default function Home() {
  return (
    <Stack spacing={2}>
      <Typography variant="h5">Orders</Typography>

      <OrdersFilters/>

      <OrdersGrid />
    </Stack>
  );
}
