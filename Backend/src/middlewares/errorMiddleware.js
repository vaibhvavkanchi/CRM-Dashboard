import AppError from "../utils/appError.js";

/**
 * Handles unmatched routes by converting them into operational 404 errors.
 * @type {import("express").RequestHandler}
 */
export const notFoundHandler = (req, _res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

/**
 * Normalizes operational and framework errors into a consistent JSON response.
 * @type {import("express").ErrorRequestHandler}
 */
export const errorHandler = (err, _req, res, _next) => {
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    err.statusCode = 401;
    err.status = "fail";
    err.message = "Invalid or expired authentication token";
  }

  if (err.code === 11000) {
    err.statusCode = 409;
    err.status = "fail";
    err.message = `Duplicate value for ${Object.keys(err.keyPattern || {}).join(", ") || "unique field"}`;
  }

  if (err.name === "ValidationError") {
    err.statusCode = 400;
    err.status = "fail";
    err.message = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");
  }

  const statusCode = err.statusCode || 500;
  const response = {
    status: err.status || "error",
    message: err.message || "Internal Server Error",
  };

  if (err.details) {
    Object.assign(response, err.details);
  }

  if (process.env.NODE_ENV !== "production" && !err.isOperational) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
