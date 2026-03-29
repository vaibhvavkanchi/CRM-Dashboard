import React from "react";
import { CardContent, Typography } from "@mui/material";
import GlassCard from "./GlassCard";

export default function StatCard({ title, value, subtitle }) {
  return (
    <GlassCard sx={{ height: "100%" }}>
      <CardContent>
        <Typography color="text.secondary" variant="body2">
          {title}
        </Typography>
        <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
          {value}
        </Typography>
        {subtitle ? (
          <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
            {subtitle}
          </Typography>
        ) : null}
      </CardContent>
    </GlassCard>
  );
}
