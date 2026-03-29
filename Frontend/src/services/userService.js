import api from "./api";

/** Admin user management API wrapper. */
const userService = {
  /** Retrieves a lightweight user list for assignment dropdowns. */
  list: async () => {
    const { data } = await api.get("/users", {
      params: { page: 1, limit: 100 },
    });
    return data;
  },
  /** Retrieves a paginated admin user listing. */
  getUsers: async (page = 1, limit = 10) => {
    const { data } = await api.get("/users", { params: { page, limit } });
    return data;
  },
  /** Updates the RBAC role of a target user. */
  updateUserRole: async (userId, role) => {
    const { data } = await api.patch(`/users/${userId}/role`, { role });
    return data;
  },
};

export default userService;
