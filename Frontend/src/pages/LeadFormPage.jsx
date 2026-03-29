import React from "react";
import {
  Alert,
  CardContent,
  Grid2,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import GlassButton from "../components/GlassButton";
import GlassCard from "../components/GlassCard";
import useAuth from "../hooks/useAuth";
import leadService from "../services/leadService";
import userService from "../services/userService";
import { extractApiError } from "../services/api";
import { LEAD_SOURCE, LEAD_STATUS } from "../constants/leadConstants";

const defaultForm = {
  name: "",
  phone: "",
  email: "",
  source: "website",
  status: "new",
  notes: "",
  assignedTo: "",
};

/**
 * Lead create/edit form page backed by lead and user APIs.
 * @param {{ mode: "create" | "edit" }} props
 */
export default function LeadFormPage({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, hasRole } = useAuth();
  const [form, setForm] = useState(defaultForm);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const canAssign = useMemo(() => hasRole(["admin", "manager"]), [hasRole]);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        if (mode === "edit" && id) {
          const response = await leadService.get(id);
          const lead = response.data;
          const normalizedSource = LEAD_SOURCE.includes(lead.source)
            ? lead.source
            : "website";
          const normalizedStatus = LEAD_STATUS.includes(lead.status)
            ? lead.status
            : "new";

          setForm({
            name: lead.name || "",
            phone: lead.phone || "",
            email: lead.email || "",
            source: normalizedSource,
            status: normalizedStatus,
            notes: lead.notes || "",
            assignedTo: lead.assignedTo?._id || "",
          });

          if (lead.source && !LEAD_SOURCE.includes(lead.source)) {
            setInfo(
              `Legacy source \"${lead.source}\" is no longer allowed and was reset to \"website\".`,
            );
          }
        }

        if (canAssign && user?.role === "admin") {
          const response = await userService.list();
          setUsers(
            response.data.filter(
              (item) => item.role !== "admin" || user.role === "admin",
            ),
          );
        } else if (canAssign && user?.role === "manager") {
          setInfo(
            "Lead assignment dropdown is restricted by current backend permissions for managers.",
          );
        }
      } catch (apiError) {
        setError(extractApiError(apiError));
      }
    };

    bootstrap();
  }, [mode, id, canAssign, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name || !form.phone) {
      setError("Name and phone are required");
      return;
    }

    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        source: form.source,
        status: form.status,
        notes: form.notes,
      };

      if (canAssign && user?.role === "admin" && form.assignedTo) {
        payload.assignedTo = form.assignedTo;
      }

      if (mode === "edit") {
        await leadService.update(id, payload);
        toast.success("Lead updated successfully", {
          id: "Lead updated successfully",
        });
      } else {
        await leadService.create(payload);
        toast.success("Lead created successfully", {
          id: "Lead created successfully",
        });
      }

      navigate("/leads");
    } catch (apiError) {
      setError(extractApiError(apiError));
    }
  };

  return (
    <>
      <PageHeader
        title={mode === "edit" ? "Edit Lead" : "Create Lead"}
        subtitle="Capture lead details, assignment, and progress notes."
      />
      <GlassCard>
        <CardContent>
          <Stack spacing={3} component="form" onSubmit={handleSubmit}>
            {error ? <Alert severity="error">{error}</Alert> : null}
            {info ? <Alert severity="info">{info}</Alert> : null}
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((c) => ({ ...c, name: e.target.value }))
                  }
                  required
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((c) => ({ ...c, phone: e.target.value }))
                  }
                  required
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((c) => ({ ...c, email: e.target.value }))
                  }
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Source"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 56,
                    },
                    "& .MuiSelect-select": {
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      paddingTop: 0,
                      paddingBottom: 0,
                    },
                  }}
                  value={form.source}
                  onChange={(e) =>
                    setForm((c) => ({ ...c, source: e.target.value }))
                  }
                >
                  {LEAD_SOURCE.map((value) => (
                    <MenuItem key={value} value={value}>
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 56,
                    },
                    "& .MuiSelect-select": {
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      paddingTop: 0,
                      paddingBottom: 0,
                    },
                  }}
                  value={form.status}
                  onChange={(e) =>
                    setForm((c) => ({ ...c, status: e.target.value }))
                  }
                >
                  {LEAD_STATUS.map((value) => (
                    <MenuItem key={value} value={value}>
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid2>
              {canAssign && user?.role === "admin" ? (
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField
                    select
                    fullWidth
                    label="Assign To"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: 56,
                      },
                      "& .MuiSelect-select": {
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        paddingTop: 0,
                        paddingBottom: 0,
                      },
                    }}
                    value={form.assignedTo}
                    onChange={(e) =>
                      setForm((c) => ({ ...c, assignedTo: e.target.value }))
                    }
                  >
                    <MenuItem value="">Unassigned</MenuItem>
                    {users.map((item) => (
                      <MenuItem key={item._id} value={item._id}>
                        {item.name} ({item.role})
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid2>
              ) : null}
              <Grid2 size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  label="Notes"
                  value={form.notes}
                  onChange={(e) =>
                    setForm((c) => ({ ...c, notes: e.target.value }))
                  }
                />
              </Grid2>
            </Grid2>

            <Stack direction="row" spacing={2}>
              <GlassButton type="submit" variant="contained">
                {mode === "edit" ? "Save Changes" : "Create Lead"}
              </GlassButton>
              <GlassButton
                variant="outlined"
                onClick={() => navigate("/leads")}
              >
                Cancel
              </GlassButton>
            </Stack>
          </Stack>
        </CardContent>
      </GlassCard>
    </>
  );
}
