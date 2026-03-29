import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Provides access to the global authentication context.
 * @returns {import("react").ContextType<typeof AuthContext>}
 */
export default function useAuth() {
  return useContext(AuthContext);
}
