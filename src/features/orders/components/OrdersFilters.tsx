import { useEffect, useState } from "react";
import { useOrderFilters } from "../hooks/useOrderFilters";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { OrderStatus } from "../model/order.types";
import {
  FormControl,
  InputLabel,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { GridSearchIcon } from "@mui/x-data-grid";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function OrdersFilters() {
  const { filters, resetFilters, setFilters } = useOrderFilters();

  const [searchInput, setSearchInput] = useState(filters.search);

  const debouncedSearch = useDebouncedValue(searchInput, 450);

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

  const handleStatusChange = (value: OrderStatus[]) => {
    setFilters({
      status: value,
    });
  };

  const handleDateChange = (field: "startDate" | "endDate", value: string) => {
    setFilters({
      [field]: value || undefined,
    });
  };

  const hasActiveFilters =
    Boolean(filters.search) ||
    filters.status.length > 0 ||
    Boolean(filters.startDate) ||
    Boolean(filters.endDate);

  return (
    <Stack
      direction={{
        xs: "column",
        md: "row",
      }}
      spacing={2}
      sx={{ alignItems: { xs: "stretch", md: "center" }, mb: 2 }}
    >
      <TextField
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search orders"
        label="Search"
        size="small"
        fullWidth
        slotProps={{
          input: {
            startAdornment: <GridSearchIcon />,
          },
        }}
      />

      <FormControl
        size="small"
        sx={{
          minWidth: {
            xs: "100%",
            md: 220,
          },
        }}
      >
        <InputLabel id="order-status-filter-label">Status</InputLabel>
        <Select
          labelId="order-status-filter-label"
          multiple
          value={filters.status}
          onChange={(e) => {
            const value = e.target.value;
            handleStatusChange(typeof value === "string" ? value.split(",") as OrderStatus[] : value as OrderStatus[]);
          }}
        ></Select>
      </FormControl>
    </Stack>
  );
}
