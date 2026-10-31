const FAILURE_RATE = 0.2;

export const sendPaymentConfirmation = async (payload) => {
  if (Math.random() < FAILURE_RATE) {
    throw new Error("Failed to send payment confirmation");
  }
  console.log(`[email] Payment confirmation sent for order ${payload.orderId}`);
};
