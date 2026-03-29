import React from "react";
import { Card } from "@mui/material";

export default function GlassCard({ children, sx = {}, ...props }) {
  return (
    <Card
      {...props}
      elevation={0}
      sx={{
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: "1px solid rgba(255,255,255,0.16)",
        boxShadow: "0 12px 36px rgba(15, 23, 42, 0.35)",
        ...sx,
      }}
    >
      {children}
    </Card>
  );
}
