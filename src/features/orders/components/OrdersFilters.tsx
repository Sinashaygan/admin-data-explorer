import { useEffect, useState } from "react";
import { useOrderFilters } from "../hooks/useOrderFilters";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

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
}