import http from "http";
import app from "./app.js";
import env from "./config/env.js";
import { initSocket } from "./websocket/socket.js";

// const server = app.listen(env.port, () => {
//   console.log(`server is running at ${env.port}`);
// });

const httpServer = http.createServer(app);
initSocket(httpServer);

httpServer.listen(env.port, () => {
  console.log(`server is running at ${env.port}`);
});
