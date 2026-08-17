"use client";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Chip,
  type ChipProps,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  type GridColumnVisibilityModel,
  type GridPaginationModel,
  type GridRowSelectionModel,
  type GridSortModel,
} from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { useOrders } from "../hooks/useOrders";
import type {
  Order,
  OrderSortField,
  OrderStatus,
} from "../model/order.types";
import { GridError } from "./GridError";
import { CustomLoadingOverlay, CustomNoRowsOverlay } from "./GridOverlays";
import { CustomGridToolbar } from "./GridToolbar";
import { OrdersBulkActions } from "./OrdersBulkActions";
import { OrderStatusMenu } from "./OrderStatusMenu";

const ORDER_STATUS_COLORS: Record<OrderStatus, ChipProps["color"]> = {
  pending: "warning",
  processing: "info",
  shipped: "primary",
  delivered: "success",
  cancelled: "error",
};

const EMPTY_ORDERS: readonly Order[] = [];

function emptySelectionModel(): GridRowSelectionModel {
  return { type: "include", ids: new Set() };
}

type ScopedSelection = {
  scope: string;
  model: GridRowSelectionModel;
};

export function OrdersGrid() {
  const { data, isLoading, filters, setFilters, isError, error, refetch } =
    useOrders();
  const [columnVisibility, setColumnVisibility] =
    useState<GridColumnVisibilityModel>({});
  const selectionScope = JSON.stringify(filters);
  const [scopedSelection, setScopedSelection] = useState<ScopedSelection>(() => ({
    scope: selectionScope,
    model: emptySelectionModel(),
  }));
  const selectionModel =
    scopedSelection.scope === selectionScope
      ? scopedSelection.model
      : emptySelectionModel();
  const rows = data?.rows ?? EMPTY_ORDERS;
  const selectedRows = useMemo(
    () =>
      rows.filter((row) =>
        selectionModel.type === "include"
          ? selectionModel.ids.has(row.id)
          : !selectionModel.ids.has(row.id),
      ),
    [rows, selectionModel],
  );

  const columns: GridColDef<Order>[] = [
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
      renderCell: ({ row }) => (
        <Chip
          label={row.status.toUpperCase()}
          color={ORDER_STATUS_COLORS[row.status]}
          size="small"
          sx={{ fontWeight: "bold", textTransform: "capitalize" }}
        />
      ),
    },
    {
      field: "total_amount",
      headerName: "Amount",
      type: "number",
      width: 120,
      valueFormatter: (value: number | null) =>
        value == null ? "" : `$${value.toLocaleString()}`,
    },
    { field: "created_at", headerName: "Date", width: 200 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 200,
      getActions: ({ id, row }) => [
        <Tooltip title="View Details" key="view">
          <IconButton onClick={() => console.log("View Order:", id)}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>,
        <OrderStatusMenu key="status" orderId={row.id} value={row.status} />,
        <Tooltip title="More Actions" key="more">
          <IconButton onClick={() => console.log("More Actions:", id)}>
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

  const clearSelection = () => {
    setScopedSelection({ scope: selectionScope, model: emptySelectionModel() });
  };

  const handleSortModelChange = (model: GridSortModel) => {
    const nextSortBy =
      model[0]?.field != null
        ? (model[0].field as OrderSortField)
        : "created_at";
    const nextSortOrder = model[0]?.sort ?? "desc";

    if (
      nextSortBy === filters.sortBy &&
      nextSortOrder === filters.sortOrder
    ) {
      return;
    }

    clearSelection();
    setFilters({ sortBy: nextSortBy, sortOrder: nextSortOrder });
  };

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    if (model.page === filters.page && model.pageSize === filters.pageSize) {
      return;
    }

    clearSelection();
    setFilters(
      { page: model.page, pageSize: model.pageSize },
      { resetPage: false },
    );
  };

  if (isError) return <GridError error={error} reset={() => refetch()} />;

  return (
    <Stack spacing={3}>
      <OrdersBulkActions
        selectedRows={selectedRows}
        onClear={clearSelection}
        onStatusUpdateSuccess={clearSelection}
      />

      <Typography variant="caption" color="text.secondary">
        Row selection applies only to orders loaded on the current server-side
        page.
      </Typography>

      <div style={{ height: 600, width: "100%" }}>
        <DataGrid<Order>
          checkboxSelection
          onRowSelectionModelChange={(model) =>
            setScopedSelection({ scope: selectionScope, model })
          }
          rowSelectionModel={selectionModel}
          rows={rows}
          getRowId={(row) => row.id}
          rowCount={data?.total ?? 0}
          loading={isLoading}
          columns={columns}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={[25, 50, 100]}
          sortingMode="server"
          sortModel={sortModel}
          onSortModelChange={handleSortModelChange}
          columnVisibilityModel={columnVisibility}
          onColumnVisibilityModelChange={setColumnVisibility}
          slots={{
            toolbar: CustomGridToolbar,
            loadingOverlay: CustomLoadingOverlay,
            noResultsOverlay: CustomNoRowsOverlay,
          }}
          disableRowSelectionOnClick
          autoHeight={false}
          sx={{
            boxShadow: 2,
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            backgroundColor: "background.paper",
            "& .MuiDataGrid-cell:focus": { outline: "none" },
          }}
        />
      </div>
    </Stack>
  );
}
