import React from "react";
import { Button, Container, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

/**
 * Fallback page rendered when no client-side route matches.
 */
export default function NotFoundPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="h3" fontWeight={700}>
          404
        </Typography>
        <Typography variant="h6">Page not found</Typography>
        <Button component={RouterLink} to="/dashboard" variant="contained">
          Go to Dashboard
        </Button>
      </Stack>
    </Container>
  );
}
