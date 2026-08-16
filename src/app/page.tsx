import { Stack, Typography } from "@mui/material";

import { OrdersGrid } from "../features/orders/components/OrdersGrid";
import { OrdersFilters } from "../features/orders/components/OrdersFilters";
import { QueryClient } from "@tanstack/react-query";
import { orderFiltersFromSearchParams } from "../features/orders/model/order-url.mapper";
import { toOrdersDatabaseQuery } from "../features/orders/model/order.query-mapper";

export const metadata = {
  title: "Orders Management | Admin Dashboard",
  description: "View and manage customer orders efficiently.",
};

type OrderPagePops = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function OrderPage({ searchParams }: OrderPagePops) {
  const queryClient = new QueryClient();
  const resolvedParams = await searchParams;

   const paramsAdapter = {
     get: (name: string) => {
       const val = resolvedParams[name];
       return Array.isArray(val) ? val[0] : (val ?? null);
     },
     getAll: (name: string) => {
       const val = resolvedParams[name];
       if (!val) return [];
       return Array.isArray(val) ? val : [val];
     },
   };

   const filters = orderFiltersFromSearchParams(paramsAdapter);
   const dbQuery = toOrdersDatabaseQuery(filters);

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Orders</Typography>

      <OrdersFilters />

      <OrdersGrid />
    </Stack>
  );
}
