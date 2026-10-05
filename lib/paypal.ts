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

export async function createPayPalOrder(input: {
  amount: number;
  currency: 'USD';
  orderId: string;
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
          description: 'SELLDROX Ultimate Digital Vault',
          amount: {
            currency_code: input.currency,
            value: input.amount.toFixed(2),
          },
        },
      ],
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
