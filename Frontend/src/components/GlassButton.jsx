import React from "react";
import { Button } from "@mui/material";

export default function GlassButton({ children, sx = {}, ...props }) {
  return (
    <Button
      {...props}
      sx={{
        borderRadius: 14,
        background:
          props.variant === "outlined"
            ? "rgba(255,255,255,0.06)"
            : "linear-gradient(135deg, rgba(139,92,246,0.96), rgba(56,189,248,0.94))",
        border: "1px solid rgba(255,255,255,0.18)",
        boxShadow:
          props.variant === "outlined"
            ? "none"
            : "0 10px 28px rgba(56, 189, 248, 0.24)",
        color: "rgba(255,255,255,0.96)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-1px)",
          background:
            props.variant === "outlined"
              ? "rgba(255,255,255,0.1)"
              : "linear-gradient(135deg, rgba(124,58,237,1), rgba(14,165,233,0.95))",
          boxShadow: "0 14px 34px rgba(139, 92, 246, 0.28)",
        },
        ...sx,
      }}
    >
      {children}
    </Button>
  );
}
