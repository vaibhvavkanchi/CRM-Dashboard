/**
 * Standard operational error used across controllers, middleware, and services.
 */
export default class AppError extends Error {
  /**
   * @param {string} message Human-readable error message.
   * @param {number} [statusCode=500] HTTP status code.
   * @param {Record<string, unknown>|null} [details=null] Optional structured error details.
   */
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
