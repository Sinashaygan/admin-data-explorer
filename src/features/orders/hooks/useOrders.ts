import { useMemo } from "react";
import { useOrderFilters } from "./useOrderFilters";
import { toOrdersDatabaseQuery } from "../model/order.query-mapper";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders } from "../api/orders.repository";

export function useOrders() {
  const { filters, setFilters } = useOrderFilters();

  const dbQuery = useMemo(() => toOrdersDatabaseQuery(filters), [filters]);

  const query = useQuery({
    queryKey: ["orders", filters], 
    queryFn: () => getOrders(dbQuery),
    placeholderData: keepPreviousData, 
    staleTime: 5000, 
  });

  return {
    ...query,
    filters,
    setFilters,
  };
}
