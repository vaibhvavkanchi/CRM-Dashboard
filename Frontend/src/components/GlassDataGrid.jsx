import React from "react";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function GlassDataGrid(props) {
  return (
    <Box
      sx={{
        height: props.autoHeight ? "auto" : 560,
        borderRadius: 4,
        overflow: "hidden",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.14)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        "& .MuiDataGrid-root": {
          border: "none",
          color: "rgba(255,255,255,0.92)",
        },
        "& .MuiDataGrid-columnHeaders": {
          background: "rgba(15,23,42,0.45)",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
        },
        "& .MuiDataGrid-cell": {
          borderColor: "rgba(255,255,255,0.08)",
        },
        "& .MuiDataGrid-footerContainer": {
          borderTop: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(15,23,42,0.32)",
        },
        "& .MuiDataGrid-row:hover": {
          backgroundColor: "rgba(255,255,255,0.06)",
        },
      }}
    >
      <DataGrid {...props} />
    </Box>
  );
}
