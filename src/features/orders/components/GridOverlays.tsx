import { Box } from "@mui/material";

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
    ></Box>;
}