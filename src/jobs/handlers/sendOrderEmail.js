const FAILURE_RATE = 0.3;

export const sendOrderEmail = async (payload) => {
  if (Math.random() < FAILURE_RATE) {
    throw new Error("Failed to send order email");
  }
  console.log(`[email] Oder confirmation send for order ${payload.orderId}`);
};
