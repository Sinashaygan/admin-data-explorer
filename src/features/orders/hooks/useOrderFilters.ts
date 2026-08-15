import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { orderFiltersFromSearchParams, orderFiltersToSearchParams } from "../model/order-url.mapper";
import { useCallback, useMemo } from "react";
import { OrderFilters } from "../model/order.types";
import { PAGE_RESET_FILTER_KEYS } from "../model/order.constants";



export function useOrderFilters() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // male url to filters
  const filters = useMemo(
    () => orderFiltersFromSearchParams(searchParams),
    [searchParams],
  );
  
  const setFilters = useCallback(
    (newFilters: Partial<OrderFilters>) => {
      if (Object.keys(newFilters).length === 0) {
        return;
      }

      const updatedFilters = { ...filters, ...newFilters };

      const shouldResetPage = PAGE_RESET_FILTER_KEYS.some((key) => key in newFilters);

      if (shouldResetPage) {
        updatedFilters.page = 0;
      }

      const queryString = orderFiltersToSearchParams(updatedFilters).toString();
      const currentQueryString = searchParams.toString();

      if (queryString === currentQueryString) {
        return;
      }

      const href = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(href, { scroll: false });
    },
    [filters, pathname, router, searchParams],
  );

  return { filters, setFilters };
}
