export default function PrivacyPolicyPage() {
  return (
    <main className="container-shell py-20">
      <div className="mx-auto max-w-4xl rounded-[32px] border border-white/10 bg-slate-900/60 p-8 md:p-12">
        <div className="text-xs uppercase tracking-[0.2em] text-blue-200">Privacy policy</div>
        <h1 className="mt-4 text-4xl font-black text-white">Privacy policy</h1>
        <div className="mt-8 space-y-5 text-slate-300">
          <p>SELLDROX may collect account information, payment information, order data, analytics, cookies, and support communication to provide the digital product experience safely and effectively.</p>
          <p>Payment details are handled by the selected provider and are not stored directly in the storefront database. IP and country information may be used for default currency detection and fraud mitigation.</p>
          <p>We use third-party services such as Supabase, Vercel, Cashfree and PayPal as part of the product and payment stack. Data retention periods are limited to what is needed for service delivery, support, legal compliance and security monitoring.</p>
          <p>Users may request access, correction, deletion, or information about their data according to the applicable privacy terms governing the service and jurisdictions.</p>
        </div>
      </div>
    </main>
  );
}
