import api from "./api";

/** Lead API wrapper for CRUD operations and dashboard analytics. */
const leadService = {
  /** @param {Record<string, string | number>} params */
  list: async (params) => {
    const { data } = await api.get("/leads", { params });
    return data;
  },
  /** @param {string} id */
  get: async (id) => {
    const { data } = await api.get(`/leads/${id}`);
    return data;
  },
  /** @param {Record<string, unknown>} payload */
  create: async (payload) => {
    const { data } = await api.post("/leads", payload);
    return data;
  },
  /** @param {string} id @param {Record<string, unknown>} payload */
  update: async (id, payload) => {
    const { data } = await api.patch(`/leads/${id}`, payload);
    return data;
  },
  /** @param {string} id */
  remove: async (id) => {
    const { data } = await api.delete(`/leads/${id}`);
    return data;
  },
  /** Fetches lead summary analytics from `/leads/stats/summary`. */
  summary: async () => {
    const { data } = await api.get("/leads/stats/summary");
    return data;
  },
};

export default leadService;
