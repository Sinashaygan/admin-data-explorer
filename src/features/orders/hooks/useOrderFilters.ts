import { useRouter, useSearchParams } from "next/navigation";
import { orderFiltersFromSearchParams, orderFiltersToSearchParams } from "../model/order-url.mapper";
import { useCallback, useMemo } from "react";
import { OrderFilters } from "../model/order.types";

export function useOrderFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // male url to filters
  const filters = useMemo(
    () => orderFiltersFromSearchParams(searchParams),
    [searchParams],
  );

  //
  const setFilters = useCallback(
    (newFilters: Partial<OrderFilters>) => {
      const updatedFilters = { ...filters, ...newFilters };

      //if change filtered does not include changed page and pageSize go to first page
      if (
        Object.keys(newFilters).some(
          (key) => key !== "page" && key !== "pageSize",
        )
      ) {
        updatedFilters.page = 0;
      }

      const queryString = orderFiltersToSearchParams(updatedFilters).toString();
      router.push(`?${queryString}`, { scroll: false });
    },
    [filters, router],
  );

  return { filters, setFilters };
}
