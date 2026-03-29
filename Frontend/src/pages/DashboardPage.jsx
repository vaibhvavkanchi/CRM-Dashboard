import React from "react";
import { CardContent, Grid2, Skeleton, Stack, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import GlassCard from "../components/GlassCard";
import leadService from "../services/leadService";
import { extractApiError } from "../services/api";
import { toChartData } from "../utils/formatters";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { PERMISSIONS } from "../utils/rbac";

const colors = [
  "#1976d2",
  "#2e7d32",
  "#ed6c02",
  "#9c27b0",
  "#d32f2f",
  "#0288d1",
  "#5d4037",
];

/**
 * Dashboard page that renders analytics cards and charts when dashboard access is permitted.
 */
export default function DashboardPage() {
  const { hasPermission } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const canReadDashboard = hasPermission(PERMISSIONS.DASHBOARD_READ);

  useEffect(() => {
    if (!canReadDashboard) {
      setLoading(false);
      return;
    }

    const loadSummary = async () => {
      try {
        const response = await leadService.summary();
        setSummary(response.data);
      } catch (error) {
        toast.error(extractApiError(error));
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, [canReadDashboard]);

  const statusData = toChartData(summary?.byStatus);
  const sourceData = toChartData(summary?.bySource);

  if (!canReadDashboard) {
    return (
      <>
        <PageHeader
          title="Dashboard"
          subtitle="High-level overview of your pipeline and lead sources."
        />
        <Alert severity="info">
          You do not have permission to view dashboard analytics.
        </Alert>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="High-level overview of your pipeline and lead sources."
      />
      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, md: 4 }}>
          {loading ? (
            <GlassCard sx={{ height: "100%" }}>
              <CardContent>
                <Skeleton variant="text" width={140} />
                <Skeleton variant="text" width={100} sx={{ fontSize: 32 }} />
                <Skeleton variant="text" width={180} />
              </CardContent>
            </GlassCard>
          ) : (
            <StatCard
              title="Total Leads"
              value={summary?.totalLeads || 0}
              subtitle="Across all accessible leads"
            />
          )}
        </Grid2>
        {statusData.slice(0, 2).map((item) => (
          <Grid2 key={item.name} size={{ xs: 12, md: 4 }}>
            {loading ? (
              <GlassCard sx={{ height: "100%" }}>
                <CardContent>
                  <Skeleton variant="text" width={140} />
                  <Skeleton variant="text" width={100} sx={{ fontSize: 32 }} />
                  <Skeleton variant="text" width={180} />
                </CardContent>
              </GlassCard>
            ) : (
              <StatCard
                title={`Status: ${item.name}`}
                value={item.value}
                subtitle="Current lead count"
              />
            )}
          </Grid2>
        ))}

        <Grid2 size={{ xs: 12, lg: 6 }}>
          <GlassCard sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Leads by Status
              </Typography>
              {loading ? (
                <Skeleton variant="rounded" height={320} />
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#1976d2" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </GlassCard>
        </Grid2>
        <Grid2 size={{ xs: 12, lg: 6 }}>
          <GlassCard sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Leads by Source
              </Typography>
              {loading ? (
                <Skeleton variant="rounded" height={320} />
              ) : (
                <Stack alignItems="center">
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={sourceData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        label
                      >
                        {sourceData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={colors[index % colors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Stack>
              )}
            </CardContent>
          </GlassCard>
        </Grid2>
      </Grid2>
    </>
  );
}
