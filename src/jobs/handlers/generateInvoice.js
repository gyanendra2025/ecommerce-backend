const FAILURE_RATE = 0.2;

export const generateInvoice = async (payload) => {
  if (Math.random() < FAILURE_RATE) {
    throw new Error("Failed to generate invoice");
  }
  console.log(`[invoice] Invoice generated for order ${payload.orderId}`);
};
