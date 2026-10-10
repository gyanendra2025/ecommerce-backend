
import express from "express";
import helmet from "helmet";
import PinoHttp from "pino-http";
import healthRouter from "./routes/health.routes.js";
import { success } from "zod";


const app=express();
app.use(helmet());
app.use(express.json());// it attach incoming data and attach it t the req.body
app.use(PinoHttp());

app.use("/health", healthRouter);

app.use((req,res)=>{
res.status(404).json({
    success:false,
    message:"route not found",
});
})

app.use((err,req,res,next)=>{
console.log(err);
res.status(500).json({
    success:false,
    message:"Internal Server error",
});
})

export default app;
