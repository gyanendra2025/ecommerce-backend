import { Server, Socket } from "socket.io";
import { verifyToken } from "../utils/jwt.js";

let io;
export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Authetication required"));
    }
    try {
      const decoded = verifyToken(token);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error("Invalid or expired Token"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(socket.userId);
  });

  return io;
};

export const emitOrderUpdate = (userId, order) => {
  if (!io) return;
  io.to(userId).emit("order:update", {
    orderId: order.id,
    status: order.status,
  });
};
