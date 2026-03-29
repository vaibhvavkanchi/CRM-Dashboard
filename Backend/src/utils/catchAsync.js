/**
 * Wraps an async Express handler and forwards rejected promises to `next`.
 * @param {(req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<unknown>} handler
 * @returns {import("express").RequestHandler}
 */
export const catchAsync = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};
