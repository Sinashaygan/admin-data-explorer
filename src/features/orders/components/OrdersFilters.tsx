import { useEffect, useState } from "react";
import { useOrderFilters } from "../hooks/useOrderFilters";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { OrderStatus } from "../model/order.types";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function OrdersFilters() {
    const {filters , resetFilters , setFilters} = useOrderFilters()

    const [searchInput , setSearchInput] = useState(filters.search)

    const debouncedSearch = useDebouncedValue(searchInput , 450)

    useEffect(() => {
      setSearchInput(filters.search);
    }, [filters.search]);

    useEffect(() => {
      if (debouncedSearch === filters.search) {
        return;
      }

      setFilters({
        search: debouncedSearch,
      });
    }, [debouncedSearch, filters.search, setFilters]);

    const handleDateChange = (
      field: "startDate" | "endDate",
      value: string,
    ) => {
      setFilters({
        [field]: value || undefined,
      });
    };

    const hasActiveFilters =
      Boolean(filters.search) ||
      filters.status.length > 0 ||
      Boolean(filters.startDate) ||
      Boolean(filters.endDate);
}