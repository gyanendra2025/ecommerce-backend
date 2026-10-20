import express from "express";
import helmet from "helmet";
import PinoHttp from "pino-http";
import healthRouter from "./routes/health.routes.js";
import authRouter from "./modules/auth/auth.routes.js";
import userRouter from "./modules/users/user.routes.js";
import addressRouter from "./modules/addresses/address.routes.js";

const app = express();
app.use(helmet());
app.use(express.json()); // it attach incoming data and attach it t the req.body
app.use(PinoHttp());

app.use("/health", healthRouter);

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/address", addressRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "route not found",
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Internal Server Error";
  if (!err.isOperational) console.log(err);
  res.status(statusCode).json({
    success: false,
    message,
  });
});

export default app;
