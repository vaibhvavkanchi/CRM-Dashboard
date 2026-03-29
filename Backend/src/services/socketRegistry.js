let ioInstance = null;

/**
 * Stores the active Socket.IO server instance for later event emission.
 * @param {import("socket.io").Server} io
 */
export const setIO = (io) => {
  ioInstance = io;
};

/**
 * Returns the active Socket.IO server instance.
 * @returns {import("socket.io").Server | null}
 */
export const getIO = () => ioInstance;
