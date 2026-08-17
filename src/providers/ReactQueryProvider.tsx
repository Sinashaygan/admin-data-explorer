"use client";

import { IconButton } from "@mui/material";
import { GridCloseIcon } from "@mui/x-data-grid";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { closeSnackbar, SnackbarProvider } from "notistack";
import { ReactNode, useState } from "react";

export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        action={(snackbarId) => (
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => closeSnackbar(snackbarId)}
          >
            <GridCloseIcon fontSize="small" />
          </IconButton>
        )}
      >
        {children}
      </SnackbarProvider>
    </QueryClientProvider>
  );
}
