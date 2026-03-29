import {
  default as React,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import useAuth from "../hooks/useAuth";
import notificationService from "../services/notificationService";

const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

/** Global notification context used for unread counts and real-time notification actions. */
export const NotificationContext = createContext(null);

/**
 * Hydrates notifications and manages the authenticated Socket.IO connection.
 */
export function NotificationProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const socketRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const fetchNotifications = useCallback(
    async (params = {}) => {
      if (!isAuthenticated) return;
      const response = await notificationService.list(params);
      setNotifications(response.data);
      setPagination(response.pagination);
    },
    [isAuthenticated],
  );

  const markRead = useCallback(async (id) => {
    const response = await notificationService.markRead(id);
    setNotifications((current) =>
      current.map((item) => (item._id === id ? response.data : item)),
    );
  }, []);

  const markAllRead = useCallback(async () => {
    await notificationService.markAllRead();
    setNotifications((current) =>
      current.map((item) => ({ ...item, isRead: true })),
    );
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setNotifications([]);
      socketRef.current?.disconnect();
      socketRef.current = null;
      return undefined;
    }

    fetchNotifications();

    const socket = io(socketUrl, {
      auth: { token },
      transports: ["websocket"],
    });

    socket.on("notification:new", (payload) => {
      setNotifications((current) => [payload, ...current]);
      setPagination((current) => ({ ...current, total: current.total + 1 }));
    });

    socketRef.current = socket;

    return () => socket.disconnect();
  }, [isAuthenticated, token, fetchNotifications]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      pagination,
      fetchNotifications,
      markRead,
      markAllRead,
    }),
    [
      notifications,
      unreadCount,
      pagination,
      fetchNotifications,
      markRead,
      markAllRead,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
