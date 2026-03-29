import {
  default as React,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { storage } from "../utils/storage";
import { hasPermission } from "../utils/rbac";
import { setAuthHandlers } from "../services/api";
import authService from "../services/authService";

/** Global auth context storing the active user session and authorization helpers. */
export const AuthContext = createContext(null);

/**
 * Provides authentication state, login/register/logout actions, and RBAC helpers.
 */
export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(storage.getToken());
  const [user, setUser] = useState(storage.getUser());

  const persistAuth = useCallback((nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    storage.setToken(nextToken);
    storage.setUser(nextUser);
  }, []);

  const logout = useCallback(
    async (reason, { skipRequest = false } = {}) => {
      if (!skipRequest && storage.getToken()) {
        try {
          await authService.logout();
        } catch (_error) {
          // Ignore logout request failures and clear local auth state anyway.
        }
      }

      setToken(null);
      setUser(null);
      storage.clearAuth();
      if (reason) toast.error(reason);
      navigate("/login", { replace: true });
    },
    [navigate],
  );

  const login = useCallback(
    async (payload) => {
      const response = await authService.login(payload);
      persistAuth(response.token, response.data);
      toast.success("Welcome back");
      navigate("/dashboard", { replace: true });
      return response;
    },
    [navigate, persistAuth],
  );

  const register = useCallback(
    async (payload) => {
      const response = await authService.register(payload);
      persistAuth(response.token, response.data);
      toast.success("Account created successfully");
      navigate("/dashboard", { replace: true });
      return response;
    },
    [navigate, persistAuth],
  );

  useEffect(() => {
    setAuthHandlers({
      getToken: () => storage.getToken(),
      onUnauthorized: () =>
        logout("Session expired. Please login again.", { skipRequest: true }),
    });
  }, [logout]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      hasPermission: (permission) => hasPermission(user?.role, permission),
      hasRole: (roles) => roles.includes(user?.role),
    }),
    [token, user, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
