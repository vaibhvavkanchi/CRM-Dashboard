import React from "react";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import GroupIcon from "@mui/icons-material/Group";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import useAuth from "../hooks/useAuth";
import NotificationDrawer from "../components/NotificationDrawer";
import { PERMISSIONS, ROLES } from "../utils/rbac";
import GlassButton from "../components/GlassButton";

const drawerWidth = 260;

/**
 * Responsive authenticated layout with app bar, sidebar navigation, and content outlet.
 * Navigation items are derived from the active user's permissions.
 */
export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout, user, hasPermission } = useAuth();

  const navItems = useMemo(() => {
    const items = [
      { label: "Leads", path: "/leads", icon: <AssignmentIcon /> },
    ];

    if (hasPermission(PERMISSIONS.DASHBOARD_READ)) {
      items.unshift({
        label: "Dashboard",
        path: "/dashboard",
        icon: <DashboardIcon />,
      });
    }

    if (hasPermission(PERMISSIONS.LEAD_WRITE)) {
      items.push({
        label: "Create Lead",
        path: "/leads/new",
        icon: <AddIcon />,
      });
    }

    if (user?.role === ROLES.ADMIN && hasPermission(PERMISSIONS.USER_WRITE)) {
      items.push({ label: "Users", path: "/users", icon: <GroupIcon /> });
    }

    return items;
  }, [user?.role, hasPermission]);

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "rgba(255,255,255,0.04)",
      }}
    >
      <Toolbar>
        <Typography variant="h6" fontWeight={700}>
          Lead CRM
        </Typography>
      </Toolbar>
      <List sx={{ flexGrow: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={pathname === item.path}
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Signed in as
        </Typography>
        <Typography fontWeight={700}>{user?.name}</Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textTransform: "capitalize", mb: 2 }}
        >
          {user?.role}
        </Typography>
        <GlassButton
          fullWidth
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={() => logout()}
        >
          Logout
        </GlassButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxShadow: "none",
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            sx={{ mr: 2, display: { sm: "none" } }}
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            CRM Lead Management
          </Typography>
          <NotificationDrawer />
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: "1px solid #e9edf5",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
