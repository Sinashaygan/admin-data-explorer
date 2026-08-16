import { DEFAULT_ORDER_FILTERS } from "./order.defaults";
import type { OrderFilters } from "./order.types";
import { orderQueryParamsSchema } from "../schemas/order-query-params.schema";

interface SearchParamsReader {
  get(name: string): string | null;
  getAll(name: string): string[];
}

export function orderFiltersFromSearchParams(
  searchParams: SearchParamsReader,
): OrderFilters {
  const result =  orderQueryParamsSchema.safeParse({
    page: searchParams.get("page") ?? undefined,
    pageSize: searchParams.get("pageSize") ?? undefined,
    search: searchParams.get("q") ?? undefined,
    status: searchParams.getAll("status"),
    startDate: searchParams.get("startDate") ?? undefined,
    endDate: searchParams.get("endDate") ?? undefined,
    sortBy: searchParams.get("sortBy") ?? undefined,
    sortOrder: searchParams.get("sortOrder") ?? undefined,
  });

  if (!result.success) {
    return DEFAULT_ORDER_FILTERS;
  }

  return result.data;
}

export function orderFiltersToSearchParams(
  filters: OrderFilters,
): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.page !== DEFAULT_ORDER_FILTERS.page) {
    params.set("page", String(filters.page));
  }

  if (filters.pageSize !== DEFAULT_ORDER_FILTERS.pageSize) {
    params.set("pageSize", String(filters.pageSize));
  }

  if (filters.search) {
    params.set("q", filters.search);
  }

  filters.status.forEach((status) => {
    params.append("status", status);
  });

  if (filters.startDate) {
    params.set("startDate", filters.startDate);
  }

  if (filters.endDate) {
    params.set("endDate", filters.endDate);
  }

  if (filters.sortBy !== DEFAULT_ORDER_FILTERS.sortBy) {
    params.set("sortBy", filters.sortBy);
  }

  if (filters.sortOrder !== DEFAULT_ORDER_FILTERS.sortOrder) {
    params.set("sortOrder", filters.sortOrder);
  }

  return params;
}
