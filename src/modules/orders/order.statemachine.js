const TRANSITIONS = {
  pending: ["payment_processing", "cancelled"],
  payment_processing: ["paid", "failed"],
  paid: ["confirmed"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
  failed: [],
};

export const canTransition = (from, to) => {
  return TRANSITIONS[from]?.includes(to) ?? false;
};
