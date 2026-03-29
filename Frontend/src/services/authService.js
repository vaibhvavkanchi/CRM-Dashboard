import api from "./api";

/** Authentication API wrapper used by the auth context. */
const authService = {
  /** @param {{ email: string, password: string }} payload */
  login: async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    return data;
  },
  /** @param {{ name: string, email: string, password: string, role?: string }} payload */
  register: async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    return data;
  },
  /** Calls the backend logout endpoint to invalidate the active token. */
  logout: async () => {
    const { data } = await api.post("/auth/logout");
    return data;
  },
};

export default authService;
