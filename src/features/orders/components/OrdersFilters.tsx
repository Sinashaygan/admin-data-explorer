import { useState } from "react";
import { useOrderFilters } from "../hooks/useOrderFilters";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

export function OrdersFilters() {
    const {filters , resetFilters , setFilters} = useOrderFilters()

    const [searchInput , setSearchInput] = useState(filters.search)

    const debouncedSearch = useDebouncedValue(searchInput , 450)
}