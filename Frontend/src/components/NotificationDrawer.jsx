import React from "react";
import {
  Badge,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
  Button,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import useNotifications from "../hooks/useNotifications";
import { useState } from "react";
import { formatDate } from "../utils/formatters";

export default function NotificationDrawer() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markRead, markAllRead } =
    useNotifications();

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton color="inherit" onClick={() => setOpen(true)}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: { xs: 320, sm: 400 },
            p: 2,
            height: "100%",
            background: "rgba(15,23,42,0.52)",
            backdropFilter: "blur(20px)",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Typography variant="h6">Notifications</Typography>
            <Button onClick={markAllRead} size="small">
              Mark all read
            </Button>
          </Stack>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />
          {notifications.length === 0 ? (
            <Typography color="text.secondary" sx={{ mt: 3 }}>
              No notifications yet.
            </Typography>
          ) : (
            <List sx={{ mt: 1 }}>
              {notifications.map((notification) => (
                <ListItem
                  key={notification._id}
                  disablePadding
                  sx={{ py: 0.5 }}
                >
                  <ListItemButton
                    onClick={() => markRead(notification._id)}
                    sx={{
                      borderRadius: 3,
                      background: notification.isRead
                        ? "rgba(255,255,255,0.04)"
                        : "rgba(139,92,246,0.14)",
                    }}
                  >
                    <ListItemText
                      primary={notification.message}
                      secondary={formatDate(notification.createdAt)}
                      primaryTypographyProps={{
                        fontWeight: notification.isRead ? 400 : 700,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Drawer>
    </>
  );
}
