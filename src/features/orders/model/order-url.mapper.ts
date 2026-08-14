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
  return orderQueryParamsSchema.parse({
    page: searchParams.get("page") ?? undefined,
    pageSize: searchParams.get("pageSize") ?? undefined,
    search: searchParams.get("q") ?? undefined,
    status: searchParams.getAll("status"),
    startDate: searchParams.get("startDate") ?? undefined,
    endDate: searchParams.get("endDate") ?? undefined,
    sortBy: searchParams.get("sortBy") ?? undefined,
    sortOrder: searchParams.get("sortOrder") ?? undefined,
  });
}


