// src/features/orders/components/OrdersGrid.tsx
"use client";

import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import { useOrders } from "../hooks/useOrders";
import { OrderSortField } from "../model/order.types";

const columns: GridColDef[] = [
  { field: "order_number", headerName: "Order ID", width: 120 },
  { field: "customer_name", headerName: "Customer", flex: 1 },
  { field: "status", headerName: "Status", width: 130 },
  {
    field: "total_amount",
    headerName: "Amount",
    type: "number",
    width: 120,
    valueFormatter: (params) => `$${params.value.toLocaleString()}`,
  },
  { field: "created_at", headerName: "Date", width: 200 },
];

export function OrdersGrid() {
  const { data, isLoading, isError, filters, setFilters } = useOrders();

  // تبدیل Sorting مدل MUI به مدل ما
  const handleSortModelChange = (model: GridSortModel) => {
    if (model.length > 0) {
      setFilters({
        sortBy: model[0].field as OrderSortField,
        sortOrder: model[0].sort as "asc" | "desc",
      });
    } else {
      setFilters({ sortBy: "created_at", sortOrder: "desc" });
    }
  };

  return (
    <div style={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={data?.rows ?? []}
        rowCount={data?.total ?? 0}
        loading={isLoading}
        columns={columns}
        // Pagination
        paginationMode="server"
        paginationModel={{ page: filters.page, pageSize: filters.pageSize }}
        onPaginationModelChange={(model) =>
          setFilters({ page: model.page, pageSize: model.pageSize })
        }
        pageSizeOptions={[25, 50, 100]}
        // Sorting
        sortingMode="server"
        sortModel={[{ field: filters.sortBy, sort: filters.sortOrder }]}
        onSortModelChange={handleSortModelChange}
        // UX
        disableRowSelectionOnClick
      />
    </div>
  );
}
