import { runWorkerLoop } from "../src/jobs/worker.js";
import prisma from "../src/config/prisma.js";

const POLL_INTERVAL_MS = 2000;

let isProcessing = false;
let shuttingDown = false;

const intervalId = setInterval(async () => {
  if (isProcessing) return;
  isProcessing = true;
  try {
    await runWorkerLoop();
  } catch (error) {
    console.error("Worker loop error:", error);
  } finally {
    isProcessing = false;
  }
}, POLL_INTERVAL_MS);

console.log("Worker started, polling every 2s...");

const shutdown = async (signal) => {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`${signal} received, stopping worker...`);

  clearInterval(intervalId);

  const forceExitTimer = setTimeout(() => {
    console.error("Forced worker shutdown after timeout");
    process.exit(1);
  }, 10000);

  while (isProcessing) {
    await new Promise((r) => setTimeout(r, 100));
  }

  await prisma.$disconnect();
  clearTimeout(forceExitTimer);
  console.log("Worker shut down cleanly");
  process.exit(0);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
