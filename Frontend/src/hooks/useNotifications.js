import { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";

/**
 * Provides access to the global notification context.
 * @returns {import("react").ContextType<typeof NotificationContext>}
 */
export default function useNotifications() {
  return useContext(NotificationContext);
}
