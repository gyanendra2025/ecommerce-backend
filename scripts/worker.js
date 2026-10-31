import { runWorkerLoop } from "../src/jobs/worker.js";

const POLL_INTERVAL_MS = 2000;

setInterval(() => {
  runWorkerLoop().catch((error) => console.error("Worker loop error:", error));
}, POLL_INTERVAL_MS);

console.log("Worker started, polling every 2s...");
