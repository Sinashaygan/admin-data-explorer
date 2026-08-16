// src/features/orders/components/OrdersGrid.tsx
"use client";

import {
  DataGrid,
  GridColDef,
  GridColumnVisibilityModel,
  GridPaginationModel,
  GridSortModel,
} from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { useOrders } from "../hooks/useOrders";
import { OrderSortField, OrderStatus } from "../model/order.types";
import { Chip, Tooltip, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CustomGridToolbar } from "./GridToolbar";
import { CustomLoadingOverlay, CustomNoRowsOverlay } from "./GridOverlays";

const ORDER_STATUS_COLORS: Record<
  OrderStatus,
  "default" | "primary" | "secondary" | "error" | "info" | "success"
> = {
  pending: "warning" as any,
  processing: "info",
  shipped: "primary",
  delivered: "success",
  cancelled: "error",
};

export function OrdersGrid() {
  const { data, isLoading, filters, setFilters } = useOrders();
  const [columnVisibility , setColumnVisibility] = useState<GridColumnVisibilityModel>({});

  const columns: GridColDef[] = [
    {
      field: "order_number",
      headerName: "Order ID",
      width: 120,
      sortable: true,
    },
    { field: "customer_name", headerName: "Customer", flex: 1, minWidth: 180 },
    {
      field: "status",
      headerName: "Status",
      width: 140,
      renderCell: (params) => {
        const status = params.value as OrderStatus;
        return (
          <Chip
            label={status.toUpperCase()}
            color={ORDER_STATUS_COLORS[status] || "default"}
            size="small"
            sx={{ fontWeight: "bold", textTransform: "capitalize" }}
          />
        );
      },
    },
    {
      field: "total_amount",
      headerName: "Amount",
      type: "number",
      width: 120,
      valueFormatter: (value: number) => {
        if (value == null) return "";
        return `$${value.toLocaleString()}`;
      },
    },
    { field: "created_at", headerName: "Date", width: 200 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      getActions: (params) => [
        <Tooltip title="View Details" key="view">
          <IconButton onClick={() => console.log("View Order:", params.id)}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>,
        <Tooltip title="More Actions" key="more">
          <IconButton onClick={() => console.log("More Actions:", params.id)}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Tooltip>,
      ],
    },
  ]; 

  const paginationModel = useMemo(
    () => ({ page: filters.page, pageSize: filters.pageSize }),
    [filters.page, filters.pageSize],
  );

  const sortModel = useMemo(
    () => [{ field: filters.sortBy, sort: filters.sortOrder }] as GridSortModel,
    [filters.sortBy, filters.sortOrder],
  );

  const handleSortModelChange = (model: GridSortModel) => {
    const nextSortBy =
      model[0]?.field != null
        ? (model[0].field as OrderSortField)
        : "created_at";
    const nextSortOrder = model[0]?.sort != null ? model[0].sort : "desc";

    const hasChanged =
      nextSortBy !== filters.sortBy || nextSortOrder !== filters.sortOrder;

    if (!hasChanged) {
      return;
    }

    setFilters({
      sortBy: nextSortBy,
      sortOrder: nextSortOrder,
    });
  };

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    const hasChanged =
      model.page !== filters.page || model.pageSize !== filters.pageSize;

    if (!hasChanged) {
      return;
    }

    setFilters(
      { page: model.page, pageSize: model.pageSize },
      { resetPage: false },
    );
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
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationModelChange}
        pageSizeOptions={[25, 50, 100]}
        // Sorting
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={handleSortModelChange}
        
        // Custom Slots
        slots={{
          toolbar:CustomGridToolbar,
          loadingOverlay: CustomLoadingOverlay,
          noResultsOverlay:CustomNoRowsOverlay
        }}

        // UX
        disableRowSelectionOnClick
      />
    </div>
  );
}
