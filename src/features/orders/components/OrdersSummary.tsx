"use client";

import {
  Box,
  CircularProgress,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { buildOrderSummary } from "../model/order-summary.mapper";
import type { Order } from "../model/order.types";

type OrdersSummaryProps = {
  orders: readonly Order[];
  loading: boolean;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export function OrdersSummary({ orders, loading }: OrdersSummaryProps) {
  const theme = useTheme();
  const summary = useMemo(() => buildOrderSummary(orders), [orders]);
  const chartColors = [
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.error.main,
    theme.palette.grey[500],
  ];

  if (loading && orders.length === 0) {
    return (
      <Paper
        sx={{ p: 3, display: "grid", placeItems: "center", minHeight: 180 }}
      >
        <CircularProgress size={32} aria-label="Loading order summary" />
      </Paper>
    );
  }

  const hasOrders = summary.totalOrders > 0;

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h5" fontWeight={700}>
          Orders summary
        </Typography>
        <Typography variant="body2" color="text.secondary" lang="fa" dir="rtl">
          آمار مربوط به نتایج فیلترشده فعلی است.
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Server-side pagination means these figures cover the currently loaded
          page.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: 2,
        }}
      >
        <SummaryCard
          label="Total orders"
          value={summary.totalOrders.toLocaleString()}
        />
        <SummaryCard
          label="Total revenue"
          value={currencyFormatter.format(summary.totalRevenue)}
        />
        <SummaryCard
          label="Pending / processing"
          value={summary.pendingOrProcessing.toLocaleString()}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "repeat(2, minmax(0, 1fr))" },
          gap: 2,
        }}
      >
        <ChartCard title="Status distribution" hasData={hasOrders}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={summary.statusDistribution}
                dataKey="count"
                nameKey="label"
                innerRadius={45}
                outerRadius={80}
                paddingAngle={2}
              >
                {summary.statusDistribution.map((item, index) => (
                  <Cell
                    key={item.status}
                    fill={chartColors[index % chartColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue by status" hasData={hasOrders}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={summary.revenueByStatus}
              margin={{ left: 8, right: 8 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme.palette.divider}
              />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis
                tickFormatter={(value: number) => currencyFormatter.format(value)}
              />
              <Tooltip
                formatter={(value) => currencyFormatter.format(Number(value))}
              />
              <Legend />
              <Bar
                dataKey="revenue"
                name="Revenue"
                fill={theme.palette.primary.main}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Box>
    </Stack>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h5" fontWeight={700}>
        {value}
      </Typography>
    </Paper>
  );
}

function ChartCard({
  title,
  hasData,
  children,
}: {
  title: string;
  hasData: boolean;
  children: React.ReactNode;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} mb={1}>
        {title}
      </Typography>
      <Box sx={{ height: 280, minWidth: 0 }}>
        {hasData ? (
          children
        ) : (
          <Box sx={{ height: "100%", display: "grid", placeItems: "center" }}>
            <Typography color="text.secondary">No data to display.</Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
