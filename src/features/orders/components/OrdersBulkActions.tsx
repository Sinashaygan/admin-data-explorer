"use client";

import DownloadIcon from "@mui/icons-material/Download";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useSnackbar } from "notistack";
import {
  createCsvContent,
  createTimestampedCsvFileName,
  downloadCsv,
  type CsvColumn,
} from "@/src/shared/csv-helper";
import { useUpdateOrderStatus } from "../hooks/useUpdateOrderStatus";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "../model/order.constants";
import type { Order, OrderStatus } from "../model/order.types";

type OrdersBulkActionsProps = {
  selectedRows: readonly Order[];
  onClear: () => void;
  onStatusUpdateSuccess: () => void;
};

const amountFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

function isOrderStatus(value: string): value is OrderStatus {
  return ORDER_STATUSES.some((status) => status === value);
}

const ORDER_CSV_COLUMNS: readonly CsvColumn<Order>[] = [
  { key: "order_number", header: "Order Number" },
  { key: "customer_name", header: "Customer" },
  {
    key: "status",
    header: "Status",
    format: (_value, row) => ORDER_STATUS_LABELS[row.status],
  },
  {
    key: "total_amount",
    header: "Total Amount",
    format: (_value, row) => amountFormatter.format(row.total_amount),
  },
  {
    key: "created_at",
    header: "Created At",
    format: (_value, row) => {
      const date = new Date(row.created_at);
      return Number.isNaN(date.getTime())
        ? row.created_at
        : dateFormatter.format(date);
    },
  },
];

export function OrdersBulkActions({
  selectedRows,
  onClear,
  onStatusUpdateSuccess,
}: OrdersBulkActionsProps) {
  const { enqueueSnackbar } = useSnackbar();
  const updateStatus = useUpdateOrderStatus(enqueueSnackbar);
  const [targetStatus, setTargetStatus] = useState<OrderStatus | "">("");
  const [isExporting, setIsExporting] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  if (selectedRows.length === 0) return null;

  const handleExport = () => {
    setIsExporting(true);

    try {
      const content = createCsvContent(selectedRows, ORDER_CSV_COLUMNS);
      const didDownload = downloadCsv(
        content,
        createTimestampedCsvFileName("orders-export"),
      );

      enqueueSnackbar(
        didDownload
          ? `${selectedRows.length} orders exported successfully.`
          : "CSV download is only available in a browser.",
        { variant: didDownload ? "success" : "error" },
      );
    } catch {
      enqueueSnackbar("Could not export the selected orders.", {
        variant: "error",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleApplyStatus = async () => {
    if (!targetStatus) return;

    setIsApplying(true);
    const results = await Promise.allSettled(
      selectedRows.map((order) =>
        updateStatus.mutateAsync({ orderId: order.id, status: targetStatus }),
      ),
    );
    setIsApplying(false);

    const failedCount = results.filter(
      (result) => result.status === "rejected",
    ).length;
    const successCount = results.length - failedCount;

    if (failedCount === 0) {
      enqueueSnackbar(`${successCount} orders updated successfully.`, {
        variant: "success",
      });
      onStatusUpdateSuccess();
      return;
    }

    enqueueSnackbar(
      `${successCount} orders updated; ${failedCount} updates failed.`,
      { variant: "warning" },
    );
  };

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      sx={{
        p: 2,
        bgcolor: "action.selected",
        borderRadius: 2,
        alignItems: { xs: "stretch", md: "center" },
      }}
    >
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        {selectedRows.length} loaded orders selected
      </Typography>

      <Button
        size="small"
        startIcon={<DownloadIcon />}
        onClick={handleExport}
        loading={isExporting}
      >
        Export CSV
      </Button>

      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="bulk-order-status-label">New status</InputLabel>
        <Select
          labelId="bulk-order-status-label"
          value={targetStatus}
          label="New status"
          onChange={(event) => {
            const value = event.target.value;
            setTargetStatus(isOrderStatus(value) ? value : "");
          }}
          disabled={isApplying}
        >
          {ORDER_STATUSES.map((status) => (
            <MenuItem key={status} value={status}>
              {ORDER_STATUS_LABELS[status]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        size="small"
        variant="contained"
        onClick={handleApplyStatus}
        disabled={!targetStatus || isApplying}
        loading={isApplying}
      >
        Apply
      </Button>

      <Button
        size="small"
        onClick={onClear}
        color="inherit"
        disabled={isApplying}
      >
        Clear
      </Button>
    </Stack>
  );
}
