import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  CardContent,
  MenuItem,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import GlassButton from "../components/GlassButton";
import GlassCard from "../components/GlassCard";
import GlassDataGrid from "../components/GlassDataGrid";
import userService from "../services/userService";
import { extractApiError } from "../services/api";
import useAuth from "../hooks/useAuth";
import { formatDate } from "../utils/formatters";

const roles = ["admin", "manager", "sales"];

const roleColorMap = {
  admin: "error",
  manager: "primary",
  sales: "default",
};

/**
 * Admin-only user management page for paginated listing and role changes.
 */
export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [rowCount, setRowCount] = useState(0);
  const [confirmState, setConfirmState] = useState(null);
  const [submittingId, setSubmittingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getUsers(
        paginationModel.page + 1,
        paginationModel.pageSize,
      );
      setRows(response.data);
      setRowCount(response.pagination.total);
    } catch (error) {
      toast.error(extractApiError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [paginationModel.page, paginationModel.pageSize]);

  const handleRoleSelection = (row, nextRole) => {
    if (row.role === nextRole) return;
    setConfirmState({ row, nextRole });
  };

  const confirmRoleChange = async () => {
    if (!confirmState) return;

    const { row, nextRole } = confirmState;
    const previousRows = rows;

    setSubmittingId(row._id);
    setRows((current) =>
      current.map((item) =>
        item._id === row._id ? { ...item, role: nextRole } : item,
      ),
    );

    try {
      await userService.updateUserRole(row._id, nextRole);
      toast.success("User role updated successfully");
    } catch (error) {
      setRows(previousRows);
      toast.error(extractApiError(error));
    } finally {
      setSubmittingId(null);
      setConfirmState(null);
    }
  };

  const columns = useMemo(
    () => [
      { field: "name", headerName: "Name", flex: 1, minWidth: 180 },
      { field: "email", headerName: "Email", flex: 1.2, minWidth: 220 },
      {
        field: "roleBadge",
        headerName: "Role",
        minWidth: 140,
        sortable: false,
        renderCell: (params) => (
          <Chip
            label={params.row.role}
            color={roleColorMap[params.row.role] || "default"}
            size="small"
            sx={{ textTransform: "capitalize" }}
          />
        ),
      },
      {
        field: "createdAt",
        headerName: "Created At",
        flex: 1,
        minWidth: 180,
        renderCell: (params) => formatDate(params.row.createdAt),
      },
      {
        field: "actions",
        headerName: "Actions",
        minWidth: 220,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const isSelf = params.row._id === currentUser?._id;
          const disabled = isSelf || submittingId === params.row._id;

          return (
            <TextField
              select
              size="small"
              value={params.row.role}
              disabled={disabled}
              onChange={(event) =>
                handleRoleSelection(params.row, event.target.value)
              }
              sx={{
                minWidth: 160,
                "& .MuiOutlinedInput-root": {
                  height: 39,
                },
                "& .MuiSelect-select": {
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  paddingTop: 0,
                  paddingBottom: 0,
                },
              }}
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
          );
        },
      },
    ],
    [currentUser?._id, submittingId],
  );

  return (
    <>
      <PageHeader
        title="Users Management"
        subtitle={`${rowCount} users available for role management`}
      />

      <GlassCard>
        <CardContent>
          {loading ? (
            <Skeleton variant="rounded" height={520} />
          ) : rows.length === 0 ? (
            <Alert severity="info">No users found</Alert>
          ) : (
            <GlassDataGrid
              rows={rows}
              columns={columns}
              getRowId={(row) => row._id}
              disableRowSelectionOnClick
              pagination
              paginationMode="server"
              rowCount={rowCount}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[5, 10, 25, 50]}
            />
          )}
        </CardContent>
      </GlassCard>

      <Dialog
        open={Boolean(confirmState)}
        onClose={() => setConfirmState(null)}
      >
        <DialogTitle>Confirm role change</DialogTitle>
        <DialogContent>
          <Typography>
            Change role for <strong>{confirmState?.row?.name}</strong> to{" "}
            <strong>{confirmState?.nextRole}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <GlassButton variant="outlined" onClick={() => setConfirmState(null)}>
            Cancel
          </GlassButton>
          <GlassButton variant="contained" onClick={confirmRoleChange}>
            Confirm
          </GlassButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
