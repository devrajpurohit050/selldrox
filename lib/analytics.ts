export type AnalyticsEventName =
  | 'page_view'
  | 'currency_detected'
  | 'currency_changed'
  | 'product_view'
  | 'buy_now_clicked'
  | 'checkout_started'
  | 'payment_success'
  | 'payment_failed'
  | 'download_started'
  | 'signup'
  | 'login';

export function trackEvent(event: AnalyticsEventName, payload?: Record<string, string | number | boolean>) {
  if (!process.env.ANALYTICS_ID) {
    return;
  }

  if (typeof window !== 'undefined') {
    const target = window as Window & { dataLayer?: Array<Record<string, string | number | boolean>> };
    const existing = target.dataLayer || [];
    target.dataLayer = [...existing, { event, ...payload }];
  }
}
