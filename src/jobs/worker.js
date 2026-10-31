import prisma from "../config/prisma.js";
import handlers from "./handlers/index.js";

const BASE_DELAY_MS = 1000;
const STALE_THRESHOLD_MS = 5 * 60 * 1000;

const backoffDelay = (attempts) => BASE_DELAY_MS * Math.pow(2, attempts);

const claimJob = async () => {
  const dueJob = await prisma.job.findFirst({
    where: { status: "pending", nextRunAt: { lte: new Date() } },
    orderBy: { nextRunAt: "asc" },
  });

  if (!dueJob) return null;

  const result = await prisma.job.updateMany({
    where: { id: dueJob.id, status: "pending" },
    data: { status: "processing" },
  });

  if (result.count === 0) return null;

  return dueJob;
};

const processJob = async (job) => {
  const handler = handlers[job.type];

  try {
    await handler(job.payload);
    await prisma.job.update({
      where: { id: job.id },
      data: { status: "completed" },
    });
  } catch (error) {
    const attempts = job.attempts + 1;

    if (attempts >= job.maxAttempts) {
      await prisma.job.update({
        where: { id: job.id },
        data: { status: "dead", attempts, lastError: error.message },
      });
      return;
    }
    await prisma.job.update({
      where: { id: job.id },
      data: {
        status: "pending",
        attempts,
        lastError: error.message,
        nextRunAt: new Date(Date.now() + backoffDelay(attempts)),
      },
    });
  }
};

const reclaimStaleJobs = async () => {
  await prisma.job.updateMany({
    where: {
      status: "processing",
      updatedAt: { lt: new Date(Date.now() - STALE_THRESHOLD_MS) },
    },
    data: { status: "pending" },
  });
};

export const runWorkerLoop = async () => {
  await reclaimStaleJobs();

  const job = await claimJob();
  if (job) {
    await processJob(job);
  }
};
