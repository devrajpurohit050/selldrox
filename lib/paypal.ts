const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
const paypalEnv = process.env.PAYPAL_ENV || 'sandbox';

const paypalBaseUrl =
  paypalEnv === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

type PayPalLink = {
  href: string;
  rel: string;
};

type PayPalOrderResponse = {
  id: string;
  links?: PayPalLink[];
};

async function getPayPalAccessToken() {
  if (!clientId || !clientSecret) {
    throw new Error('PayPal is not configured. Add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET.');
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch(`${paypalBaseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Unable to authenticate with PayPal (${response.status}): ${details}`);
  }

  const data: { access_token?: string } = await response.json();

  if (!data.access_token) {
    throw new Error('PayPal did not return an access token.');
  }

  return data.access_token;
}

export async function verifyPayPalWebhook(
  headers: Record<string, string>,
  webhookEvent: unknown,
) {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) {
    throw new Error('PayPal webhook verification is not configured. Add PAYPAL_WEBHOOK_ID.');
  }

  const accessToken = await getPayPalAccessToken();
  const response = await fetch(`${paypalBaseUrl}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      auth_algo: headers['paypal-auth-algo'],
      cert_url: headers['paypal-cert-url'],
      transmission_id: headers['paypal-transmission-id'],
      transmission_sig: headers['paypal-transmission-sig'],
      transmission_time: headers['paypal-transmission-time'],
      webhook_id: webhookId,
      webhook_event: webhookEvent,
    }),
  });

  if (!response.ok) {
    throw new Error(`Unable to verify PayPal webhook (${response.status}).`);
  }

  const result: { verification_status?: string } = await response.json();
  return result.verification_status === 'SUCCESS';
}

export async function capturePayPalOrder(orderId: string) {
  const accessToken = await getPayPalAccessToken();
  const response = await fetch(`${paypalBaseUrl}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Unable to capture PayPal order (${response.status}): ${details}`);
  }

  const result: {
    status?: string;
    purchase_units?: Array<{ payments?: { captures?: Array<{ status?: string }> } }>;
  } = await response.json();
  return result.status === 'COMPLETED' ||
    result.purchase_units?.some((unit) => unit.payments?.captures?.some((capture) => capture.status === 'COMPLETED')) === true;
}

export async function createPayPalOrder(input: {
  amount: number;
  currency: 'USD';
  orderId: string;
  buyerName: string;
  buyerEmail: string;
  returnUrl: string;
  cancelUrl: string;
}) {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(`${paypalBaseUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: input.orderId,
          custom_id: input.orderId,
          description: 'SELLDROX Ultimate Digital Vault',
          amount: {
            currency_code: input.currency,
            value: input.amount.toFixed(2),
          },
        },
      ],
      payer: {
        email_address: input.buyerEmail,
        name: {
          given_name: input.buyerName,
        },
      },
      application_context: {
        brand_name: 'SELLDROX',
        landing_page: 'LOGIN',
        user_action: 'PAY_NOW',
        return_url: input.returnUrl,
        cancel_url: input.cancelUrl,
      },
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Unable to create PayPal order (${response.status}): ${details}`);
  }

  const data: PayPalOrderResponse = await response.json();
  const approvalUrl = data.links?.find((link) => link.rel === 'approve')?.href;

  if (!data.id || !approvalUrl) {
    throw new Error('PayPal did not return an approval URL.');
  }

  return {
    paypalOrderId: data.id,
    approvalUrl,
  };
}
