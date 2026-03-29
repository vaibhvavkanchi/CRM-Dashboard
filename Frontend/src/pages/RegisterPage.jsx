import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
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
 * Public registration page for creating a sales user account.
 */
export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      await register({ ...form, role: "sales" });
    } catch (apiError) {
      setError(extractApiError(apiError));
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card elevation={0}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3} component="form" onSubmit={handleSubmit}>
            <Typography variant="h4" fontWeight={700}>
              Register
            </Typography>
            {error ? <Alert severity="error">{error}</Alert> : null}
            <TextField
              label="Full name"
              value={form.name}
              onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))}
              required
            />
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((c) => ({ ...c, email: e.target.value }))
              }
              required
            />
            <TextField
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((c) => ({ ...c, password: e.target.value }))
              }
              required
            />
            <Alert severity="info">
              New registrations are created with the Sales role.
            </Alert>
            <Button type="submit" variant="contained" size="large">
              Create account
            </Button>
            <Typography variant="body2">
              Already have an account?{" "}
              <Link component={RouterLink} to="/login">
                Login
              </Link>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
