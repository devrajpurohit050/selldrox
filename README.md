# SELLDROX

A premium digital-resource e-commerce platform built with Next.js, Tailwind CSS, and Supabase-ready backend architecture. The project includes a premium landing page, currency-aware pricing, server-side checkout flows, webhooks, secure download handling, and legal pages.

## Quick start

1. Install dependencies:
   npm install
2. Copy environment variables:
   cp .env.example .env.local
3. Start the app:
   npm run dev

## Environment variables

See `.env.example` for all required environment variables.

## Supabase setup

1. Create or select a Supabase project dedicated to SELLDROX.
2. In the Supabase dashboard, open **Project Settings → API** and copy the Project URL and public anon/publishable key to `.env.local` as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. In **Authentication → URL Configuration**, set the Site URL to `https://selldrox.store` and add `http://localhost:3000/account`, `https://selldrox.store/account`, and your Vercel deployment URL followed by `/account` to the redirect allow list. OAuth and confirmation callbacks use the current site's origin, so they return to the domain where the user started sign-in.
4. In **Google Cloud Console → Google Auth Platform → Branding**, set the app name to **SELLDROX** and configure the support email and authorized domain (`selldrox.store`). In **Clients**, create a Google OAuth Web client with `https://selldrox.store` and `http://localhost:3000` as authorized JavaScript origins, and `https://rnnawwxrawesqwcxfpbg.supabase.co/auth/v1/callback` as an authorized redirect URI. Add the resulting client ID and secret to the Google provider settings in Supabase. The Google consent screen's displayed app name is controlled by this Google branding configuration, not by the storefront code. Apple sign-in similarly requires credentials from Apple Developer.
5. Run `supabase/migrations/001_init.sql`, then `supabase/migrations/002_account_order_isolation.sql` in the Supabase SQL Editor. The second migration creates per-account order history and tightens policies so accounts cannot read unowned or unlinked orders. Keep `SUPABASE_SERVICE_ROLE_KEY` configured only as a server-side Vercel environment variable.
6. Restart the Next.js server after changing `.env.local`. The login and signup pages support Google, Apple, and email/password authentication.

Checkout requires a signed-in account. New orders are stored against the authenticated Supabase user and appear in that account after payment verification. Orders from the older checkout implementation were not stored in Supabase, so they cannot be assigned to accounts automatically.

Never use a Supabase service-role key in a `NEXT_PUBLIC_*` variable or expose it in browser code. The service-role key is only for trusted server-side operations.

## Cashfree setup

1. Create a Cashfree merchant account.
2. Add app ID and secret keys in `.env.local`.
3. Configure a payment-success webhook event and its URL:
   https://your-domain.com/api/webhooks/cashfree
   Cashfree signs callbacks using the configured `CASHFREE_SECRET_KEY`.

## PayPal setup

1. Create a PayPal developer app.
2. Add client ID, secret, and the webhook ID as `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, and `PAYPAL_WEBHOOK_ID`.
3. Subscribe to `PAYMENT.CAPTURE.COMPLETED` and configure its webhook URL:
   https://your-domain.com/api/webhooks/paypal

## Vercel deployment

1. Push project to GitHub.
2. Import into Vercel.
3. Add all env variables.
4. Set `NEXT_PUBLIC_SITE_URL` to the production URL.
5. Do not set a fixed `NEXT_PUBLIC_SUPABASE_REDIRECT_URL`; authentication callbacks use the active site's origin. Configure the matching production callback URL in Supabase as described above.
6. Add `SUPABASE_SERVICE_ROLE_KEY`, `PAYPAL_WEBHOOK_ID`, and the other required server-only payment variables in Vercel. Never prefix secret keys with `NEXT_PUBLIC_`.
7. Run both Supabase migrations before deploying the account-linked checkout.
8. Deploy.

## Notes

- Payment verification must always happen server-side.
- Do not expose payment credentials in client code.
- Currency detection uses Vercel geolocation headers when available; when unavailable, the browser's India locale/time zone selects INR and other locales/time zones default to USD. A manually selected currency is saved as a preference.
- The storefront defaults to light theme; a user's explicit theme selection is remembered.
- The project is ready for future admin tooling and product configuration updates.
