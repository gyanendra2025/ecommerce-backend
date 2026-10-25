const SUCCESS_RATE = 0.9;
const TIMEOUT_RATE = 0.05;
// remaining 0.05 = failure

const randomDelay = () =>
  new Promise((resolve) => setTimeout(resolve, Math.random() * 500));

export const charge = async (amount) => {
  await randomDelay();

  const roll = Math.random();

  if (roll < TIMEOUT_RATE) {
    throw new Error("TIMEOUT");
  }

  if (roll < TIMEOUT_RATE + (1 - SUCCESS_RATE)) {
    return { success: false, reason: "card_declined" };
  }

  return {
    success: true,
    transactionRef: `txn_${Date.now()}_${Math.random().toString(36).slice(2)}`,
  };
};
