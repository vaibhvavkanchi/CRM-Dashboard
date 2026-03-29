import dayjs from "dayjs";

/**
 * Formats an ISO date into a human-readable CRM timestamp.
 * @param {string | Date | undefined | null} value
 * @returns {string}
 */
export const formatDate = (value) => {
  if (!value) return "—";
  return dayjs(value).format("DD MMM YYYY, hh:mm A");
};

/**
 * Converts a key/value object into chart-friendly array items.
 * @param {Record<string, number>} [record={}]
 * @returns {{ name: string, value: number }[]}
 */
export const toChartData = (record = {}) =>
  Object.entries(record).map(([name, value]) => ({ name, value }));

/**
 * Builds server query params for the paginated lead list endpoint.
 * @param {{ page: number, pageSize: number, search?: string, status?: string, source?: string, createdFrom?: string, createdTo?: string, sortField?: string, sortOrder?: string }} params
 * @returns {Record<string, string | number>}
 */
export const buildLeadQueryParams = ({
  page,
  pageSize,
  search,
  status,
  source,
  createdFrom,
  createdTo,
  sortField,
  sortOrder,
}) => {
  const params = {
    page: page + 1,
    limit: pageSize,
  };

  if (search) params.q = search;
  if (status) params.status = status;
  if (source) params.source = source;
  if (createdFrom) params.createdFrom = createdFrom;
  if (createdTo) params.createdTo = createdTo;
  if (sortField && sortOrder) params.sort = `${sortField}:${sortOrder}`;

  return params;
};
