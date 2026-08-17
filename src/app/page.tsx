import { Stack, Typography, Container, Box, } from "@mui/material";

import { OrdersGrid } from "../features/orders/components/OrdersGrid";
import { OrdersFilters } from "../features/orders/components/OrdersFilters";
import {HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
import { orderFiltersFromSearchParams } from "../features/orders/model/order-url.mapper";
import { toOrdersDatabaseQuery } from "../features/orders/model/order.query-mapper";
import { getOrders } from "../features/orders/api/orders.repository";

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

   await queryClient.prefetchQuery({
     queryKey: ["orders", "list", filters],
     queryFn: () => getOrders(dbQuery),
   });

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" sx={{fontWeight:700}}>
            Order Explorer
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and monitor all incoming orders in real-time.
          </Typography>
        </Box>

        <HydrationBoundary state={dehydrate(queryClient)}>
          <OrdersFilters />
          <OrdersGrid />
        </HydrationBoundary>
      </Stack>
    </Container>
  );
}
