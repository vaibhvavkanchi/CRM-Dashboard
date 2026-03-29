import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { extractApiError } from "../services/api";

/**
 * Login page that authenticates a user and starts a session.
 */
export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }

    try {
      await login(form);
    } catch (apiError) {
      setError(extractApiError(apiError));
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card elevation={0}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3} component="form" onSubmit={handleSubmit}>
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Login
              </Typography>
              <Typography color="text.secondary">
                Sign in to manage leads and notifications.
              </Typography>
            </Box>
            {error ? <Alert severity="error">{error}</Alert> : null}
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((current) => ({ ...current, email: e.target.value }))
              }
              required
            />
            <TextField
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((current) => ({ ...current, password: e.target.value }))
              }
              required
            />
            <Button type="submit" variant="contained" size="large">
              Login
            </Button>
            <Typography variant="body2">
              Don&apos;t have an account?{" "}
              <Link component={RouterLink} to="/register">
                Create one
              </Link>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
