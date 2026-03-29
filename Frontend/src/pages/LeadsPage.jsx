import React from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton, Tooltip } from "@mui/material";
import {
  Box,
  CardContent,
  Grid2,
  MenuItem,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useDebounce from "../hooks/useDebounce";
import useAuth from "../hooks/useAuth";
import PageHeader from "../components/PageHeader";
import GlassButton from "../components/GlassButton";
import GlassCard from "../components/GlassCard";
import GlassDataGrid from "../components/GlassDataGrid";
import leadService from "../services/leadService";
import { extractApiError } from "../services/api";
import { buildLeadQueryParams, formatDate } from "../utils/formatters";
import { PERMISSIONS } from "../utils/rbac";
import { LEAD_SOURCE, LEAD_STATUS } from "../constants/leadConstants";

const statusOptions = ["", ...LEAD_STATUS];
const sourceOptions = ["", ...LEAD_SOURCE];

/**
 * Lead listing page with server-side filtering, sorting, pagination, and row actions.
 */
export default function LeadsPage() {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [rowCount, setRowCount] = useState(0);
  const [sortModel, setSortModel] = useState([
    { field: "createdAt", sort: "desc" },
  ]);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    source: "",
    createdFrom: "",
    createdTo: "",
  });
  const debouncedSearch = useDebounce(filters.search, 500);

  useEffect(() => {
    const loadLeads = async () => {
      setLoading(true);
      try {
        const sortItem = sortModel[0] || {};
        const params = buildLeadQueryParams({
          page: paginationModel.page,
          pageSize: paginationModel.pageSize,
          search: debouncedSearch,
          status: filters.status,
          source: filters.source,
          createdFrom: filters.createdFrom,
          createdTo: filters.createdTo,
          sortField: sortItem.field,
          sortOrder: sortItem.sort,
        });
        const response = await leadService.list(params);
        setRows(response.data);
        setRowCount(response.pagination.total);
      } catch (error) {
        toast.error(extractApiError(error));
      } finally {
        setLoading(false);
      }
    };

    loadLeads();
  }, [
    paginationModel,
    filters.status,
    filters.source,
    filters.createdFrom,
    filters.createdTo,
    debouncedSearch,
    sortModel,
  ]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lead?",
    );
    if (!confirmed) return;

    try {
      await leadService.remove(id);
      toast.success("Lead deleted successfully");
      setRows((current) => current.filter((row) => row._id !== id));
      setRowCount((current) => Math.max(0, current - 1));
    } catch (error) {
      toast.error(extractApiError(error));
    }
  };

  const columns = useMemo(
    () => [
      { field: "name", headerName: "Name", flex: 1, minWidth: 180 },
      { field: "email", headerName: "Email", flex: 1, minWidth: 220 },
      { field: "phone", headerName: "Phone", flex: 1, minWidth: 150 },
      { field: "status", headerName: "Status", flex: 0.8, minWidth: 120 },
      { field: "source", headerName: "Source", flex: 0.8, minWidth: 120 },
      {
        field: "assignedTo",
        headerName: "Assigned To",
        flex: 1,
        minWidth: 160,
        renderCell: (params) => params.row.assignedTo?.name || "Unassigned",
        sortable: false,
      },
      {
        field: "createdAt",
        headerName: "Created",
        flex: 1,
        minWidth: 180,
        renderCell: (params) => formatDate(params.value),
      },
      {
        field: "actions",
        headerName: "Actions",
        minWidth: 180,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="View">
              <IconButton
                size="small"
                color="primary"
                onClick={() => navigate(`/leads/${params.row._id}/edit`)}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {hasPermission(PERMISSIONS.LEAD_WRITE) ? (
              <>
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => navigate(`/leads/${params.row._id}/edit`)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(params.row._id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            ) : null}
          </Stack>
        ),
      },
    ],
    [navigate, hasPermission],
  );

  return (
    <>
      <PageHeader title="Leads" subtitle={`${rowCount} total leads found`} />
      <GlassCard sx={{ mb: 3 }}>
        <CardContent>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Search leads"
                placeholder="Search name, email, phone"
                value={filters.search}
                onChange={(e) =>
                  setFilters((c) => ({ ...c, search: e.target.value }))
                }
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
              <TextField
                select
                fullWidth
                label="Status"
                value={filters.status}
                onChange={(e) =>
                  setFilters((c) => ({ ...c, status: e.target.value }))
                }
              >
                {statusOptions.map((item) => (
                  <MenuItem key={item || "all-status"} value={item}>
                    {item || "All"}
                  </MenuItem>
                ))}
              </TextField>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
              <TextField
                select
                fullWidth
                label="Source"
                value={filters.source}
                onChange={(e) =>
                  setFilters((c) => ({ ...c, source: e.target.value }))
                }
              >
                {sourceOptions.map((item) => (
                  <MenuItem key={item || "all-source"} value={item}>
                    {item || "All"}
                  </MenuItem>
                ))}
              </TextField>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
              <TextField
                fullWidth
                type="date"
                label="From"
                InputLabelProps={{ shrink: true }}
                value={filters.createdFrom}
                onChange={(e) =>
                  setFilters((c) => ({ ...c, createdFrom: e.target.value }))
                }
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
              <TextField
                fullWidth
                type="date"
                label="To"
                InputLabelProps={{ shrink: true }}
                value={filters.createdTo}
                onChange={(e) =>
                  setFilters((c) => ({ ...c, createdTo: e.target.value }))
                }
              />
            </Grid2>
          </Grid2>
          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
            {hasPermission(PERMISSIONS.LEAD_WRITE) ? (
              <GlassButton
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/leads/new")}
              >
                Add Lead
              </GlassButton>
            ) : null}
          </Stack>
        </CardContent>
      </GlassCard>

      <GlassCard>
        <CardContent>
          {loading ? (
            <Skeleton variant="rounded" height={520} />
          ) : (
            <GlassDataGrid
              rows={rows}
              columns={columns}
              getRowId={(row) => row._id}
              disableRowSelectionOnClick
              pagination
              paginationMode="server"
              sortingMode="server"
              rowCount={rowCount}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              sortModel={sortModel}
              onSortModelChange={setSortModel}
              pageSizeOptions={[10, 25, 50, 100]}
              loading={loading}
              slots={{
                noRowsOverlay: () => (
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{ height: "100%" }}
                  >
                    <Typography color="text.secondary">
                      No leads found
                    </Typography>
                  </Stack>
                ),
              }}
            />
          )}
        </CardContent>
      </GlassCard>
    </>
  );
}
