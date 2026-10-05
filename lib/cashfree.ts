const appId = process.env.CASHFREE_APP_ID;
const secretKey = process.env.CASHFREE_SECRET_KEY;
const cashfreeEnv = process.env.CASHFREE_ENV || 'sandbox';

const cashfreeBaseUrl =
  cashfreeEnv === 'production' ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg';

type CashfreeLinkResponse = {
  cf_link_id?: string;
  link_id?: string;
  link_url?: string;
};

export async function createCashfreePaymentLink(input: {
  amount: number;
  currency: 'INR';
  orderId: string;
  returnUrl: string;
  notifyUrl: string;
}) {
  if (!appId || !secretKey) {
    throw new Error('Cashfree is not configured. Add CASHFREE_APP_ID and CASHFREE_SECRET_KEY.');
  }

  const response = await fetch(`${cashfreeBaseUrl}/links`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-version': '2023-08-01',
      'x-client-id': appId,
      'x-client-secret': secretKey,
      'x-idempotency-key': input.orderId,
    },
    body: JSON.stringify({
      link_id: input.orderId,
      link_amount: input.amount,
      link_currency: input.currency,
      link_purpose: 'SELLDROX Ultimate Digital Vault',
      customer_details: {
        customer_name: 'SELLDROX Customer',
        customer_phone: '9999999999',
        customer_email: 'support@selldrox.com',
      },
      link_meta: {
        return_url: input.returnUrl,
        notify_url: input.notifyUrl,
        upi_intent: false,
      },
      link_notify: {
        send_email: false,
        send_sms: false,
      },
      link_partial_payments: false,
      link_notes: {
        product_id: 'selldrox-digital-vault',
      },
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Unable to create Cashfree payment link (${response.status}): ${details}`);
  }

  const data: CashfreeLinkResponse = await response.json();

  if (!data.link_url || !data.link_id) {
    throw new Error('Cashfree did not return a payment link URL.');
  }

  return {
    cashfreeLinkId: data.cf_link_id || data.link_id,
    linkId: data.link_id,
    paymentUrl: data.link_url,
  };
}
