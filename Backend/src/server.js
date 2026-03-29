import http from "http";
import app from "./app.js";
import env from "./config/env.js";
import { connectDB } from "./config/db.js";
import { ensureDefaultAdmin } from "./services/authService.js";
import { initializeSocket } from "./sockets/index.js";

/**
 * Connects infrastructure dependencies and starts the HTTP + Socket.IO server.
 * @returns {Promise<void>}
 */
const startServer = async () => {
  await connectDB(env.mongoUri);
  await ensureDefaultAdmin(env);

  const server = http.createServer(app);
  initializeSocket(server);

  server.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
