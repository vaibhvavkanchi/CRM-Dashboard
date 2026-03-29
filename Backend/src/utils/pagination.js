/**
 * Builds a normalized pagination object for list responses.
 * @param {{ page: number, limit: number, total: number }} params
 * @returns {{ page: number, limit: number, total: number, totalPages: number }}
 */
export const buildPagination = ({ page, limit, total }) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit) || 1,
});
