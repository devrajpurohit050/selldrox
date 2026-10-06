const appId = process.env.CASHFREE_APP_ID;
const secretKey = process.env.CASHFREE_SECRET_KEY;
const cashfreeEnv = process.env.CASHFREE_ENV || 'sandbox';

const cashfreeBaseUrl =
  cashfreeEnv === 'production' ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg';

type CashfreeOrderResponse = {
  cf_order_id?: string;
  order_id?: string;
  payment_session_id?: string;
};

export async function createCashfreeOrder(input: {
  amount: number;
  currency: 'INR';
  orderId: string;
  buyerName: string;
  buyerEmail: string;
  returnUrl: string;
  notifyUrl: string;
}) {
  if (!appId || !secretKey) {
    throw new Error('Cashfree is not configured. Add CASHFREE_APP_ID and CASHFREE_SECRET_KEY.');
  }

  const response = await fetch(`${cashfreeBaseUrl}/orders`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-api-version': '2023-08-01',
      'x-client-id': appId,
      'x-client-secret': secretKey,
      'x-idempotency-key': input.orderId,
    },
    body: JSON.stringify({
      order_id: input.orderId,
      order_amount: input.amount,
      order_currency: input.currency,
      customer_details: {
        customer_id: input.orderId.replace(/[^a-zA-Z0-9_-]/g, '_'),
        customer_name: input.buyerName,
        customer_email: input.buyerEmail,
        customer_phone: '9999999999',
      },
      order_meta: {
        return_url: `${input.returnUrl}&cf_order_id={order_id}`,
        notify_url: input.notifyUrl,
      },
      order_note: 'SELLDROX Ultimate Digital Vault',
      order_tags: {
        product_id: 'selldrox-digital-vault',
        buyer_name: input.buyerName,
        buyer_email: input.buyerEmail,
      },
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Unable to create Cashfree order (${response.status}): ${details}`);
  }

  const data: CashfreeOrderResponse = await response.json();

  if (!data.payment_session_id || !data.order_id) {
    throw new Error('Cashfree did not return a payment session.');
  }

  return {
    cashfreeOrderId: data.cf_order_id || data.order_id,
    orderId: data.order_id,
    paymentSessionId: data.payment_session_id,
  };
}
