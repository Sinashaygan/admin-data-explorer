import type { OrderFilters } from "./order.types";

export const DEFAULT_ORDER_FILTERS: OrderFilters = {
  page: 0,
  pageSize: 25,
  search: "",
  status: [],
  sortBy: "created_at",
  sortOrder: "desc",
};
