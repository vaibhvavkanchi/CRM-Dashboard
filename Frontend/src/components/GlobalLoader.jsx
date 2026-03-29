import React from "react";
import { LinearProgress } from "@mui/material";
import { useContext } from "react";
import { LoadingContext } from "../context/LoadingContext";

export default function GlobalLoader() {
  const { isLoading } = useContext(LoadingContext);

  if (!isLoading) return null;

  return (
    <LinearProgress
      color="primary"
      sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 2000 }}
    />
  );
}
