const FAILURE_RATE = 0.2;

export const updateAnalytics = async (payload) => {
  if (Math.random() < FAILURE_RATE) {
    throw new Error("Failed to update analytics");
  }
  console.log(`[analytics] Recorded order ${payload.orderId}`);
};
