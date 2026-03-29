import { Server } from "socket.io";
import User from "../models/User.js";
import env from "../config/env.js";
import { verifyJwt } from "../utils/jwt.js";
import { setIO } from "../services/socketRegistry.js";

/**
 * Initializes Socket.IO on the shared HTTP server and authenticates socket connections via JWT.
 * Each authenticated client joins a user-specific room for targeted notification delivery.
 * @param {import("http").Server} httpServer
 * @returns {import("socket.io").Server}
 */
export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: env.clientOrigin === "*" ? true : env.clientOrigin,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const authToken = socket.handshake.auth?.token;
      const headerToken = socket.handshake.headers.authorization?.startsWith(
        "Bearer ",
      )
        ? socket.handshake.headers.authorization.split(" ")[1]
        : null;
      const token = authToken || headerToken;

      if (!token) {
        return next(new Error("Authentication token missing"));
      }

      const decoded = verifyJwt(token, env.jwtSecret);
      const user = await User.findById(decoded.sub);

      if (!user) {
        return next(new Error("Unauthorized"));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(String(socket.user._id));
    socket.emit("socket:ready", { userId: String(socket.user._id) });
  });

  setIO(io);
  return io;
};
