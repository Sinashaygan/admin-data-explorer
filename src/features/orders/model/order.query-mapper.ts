import { OrderFilters, OrdersDatabaseQuery } from "./order.types";

export function toOrdersDatabaseQuery(
  filters: OrderFilters,
): OrdersDatabaseQuery {
  return {
    offset: filters.page * filters.pageSize,
    limit: filters.pageSize,
    search: filters.search || undefined,
    statuses: filters.status.length > 0 ? filters.status : undefined,
    startDate: filters.startDate,
    endDate: filters.endDate,
    sortBy: filters.sortBy,
    ascending: filters.sortOrder === "asc",
  };
}
