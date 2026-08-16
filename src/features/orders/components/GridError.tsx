"use client";
import { Button, Stack, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

export function GridError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <Stack
      spacing={2}
      sx={{
        p: 5,
        border: "1px dashed red",
        borderRadius: 2,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography color="error" variant="h6">
        Failed to load orders
      </Typography>
      <Typography variant="body2">{error.message}</Typography>
      <Button startIcon={<RefreshIcon />} onClick={reset} variant="outlined">
        Try Again
      </Button>
    </Stack>
  );
}
