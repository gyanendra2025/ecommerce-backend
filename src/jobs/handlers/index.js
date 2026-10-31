import { sendOrderEmail } from "./sendOrderEmail.js";
import { sendPaymentConfirmation } from "./sendPaymentConfirmation.js";
import { generateInvoice } from "./generateInvoice.js";
import { updateAnalytics } from "./updateAnalytics.js";

const handlers = {
  send_order_email: sendOrderEmail,
  send_payment_confirmation: sendPaymentConfirmation,
  generate_invoice: generateInvoice,
  update_analytics: updateAnalytics,
};

export default handlers;
