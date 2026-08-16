import { Box, CircularProgress, Typography } from "@mui/material";

export function CustomLoadingOverlay() {
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      gap: 2,
      backgroundColor: "rgba(255, 255, 255, 0.6)",
      zIndex: 1,
    }}
  >
    <CircularProgress size={40} thickness={4} />
    <Typography variant="body2" color="textSecondary">
      Loading Orders...
    </Typography>
  </Box>;
}

export function CustomNoRowsOverlay() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: 1,
      }}
    >
    </Box>
  );
}