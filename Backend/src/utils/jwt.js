import jwt from "jsonwebtoken";

/**
 * Signs an access token containing subject and role claims.
 * @param {{ userId: string, role: string, secret: string, expiresIn: string | number }} params
 * @returns {string}
 */
export const signToken = ({ userId, role, secret, expiresIn }) =>
  jwt.sign({ sub: userId, role }, secret, { expiresIn });

/**
 * Verifies and decodes a JWT access token.
 * @param {string} token
 * @param {string} secret
 * @returns {import("jsonwebtoken").JwtPayload & { sub: string, role: string }}
 */
export const verifyJwt = (token, secret) => jwt.verify(token, secret);
