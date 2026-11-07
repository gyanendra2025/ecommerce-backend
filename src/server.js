import http from "http";
import app from "./app.js";
import env from "./config/env.js";
import { initSocket, closeSocket } from "./websocket/socket.js";
import prisma from "./config/prisma.js";
import redis from "./config/redis.js";

const httpServer = http.createServer(app);
initSocket(httpServer);

httpServer.listen(env.port, () => {
  console.log(`server is running at ${env.port}`);
});

const shutdown = async (signal) => {
  console.log(`${signal} received, shutting down gracefully...`);

  const forceExitTimer = setTimeout(() => {
    console.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);

  closeSocket();

  httpServer.close(async () => {
    console.log("HTTP server closed, no longer accepting connections");
    await prisma.$disconnect();
    await redis.quit();
    clearTimeout(forceExitTimer);
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
