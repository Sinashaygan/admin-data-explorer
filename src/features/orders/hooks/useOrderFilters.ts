import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  orderFiltersFromSearchParams,
  orderFiltersToSearchParams,
} from "../model/order-url.mapper";
import { useCallback, useMemo } from "react";
import { OrderFilters } from "../model/order.types";
import { DEFAULT_ORDER_FILTERS } from "../model/order.defaults";
// import { PAGE_RESET_FILTER_KEYS } from "../model/order.constants";

type SetFiltersOptions = {
  resetPage?: boolean;
  replace?: boolean;
};

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
    (newFilters: Partial<OrderFilters>, options: SetFiltersOptions = {}) => {
      const { resetPage = true, replace = true } = options;

      if (Object.keys(newFilters).length === 0) {
        return;
      }

      const updatedFilters = { ...filters, ...newFilters };

      //   const shouldResetPage = PAGE_RESET_FILTER_KEYS.some((key) => key in newFilters);

      if (resetPage) {
        updatedFilters.page = 0;
      }

      const queryString = orderFiltersToSearchParams(updatedFilters).toString();
      const currentQueryString = searchParams.toString();

      if (queryString === currentQueryString) {
        return;
      }

      const href = queryString ? `${pathname}?${queryString}` : pathname;
      //   router.replace(href, { scroll: false });
      if (replace) {
        router.replace(href, { scroll: false });
      } else {
        router.push(href, { scroll: false });
      }
    },
    [filters, pathname, router, searchParams],
  );

  const resetFilters = useCallback(() => {
    const queryString = orderFiltersToSearchParams(DEFAULT_ORDER_FILTERS);

    const href = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(href, { scroll: false });
  }, [filters.page, pathname, router]);

  return { filters, setFilters, resetFilters };
}
