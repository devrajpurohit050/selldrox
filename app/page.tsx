import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  CreditCard,
  Database,
  FileCode2,
  Globe,
  Headphones,
  Image as ImageIcon,
  Layers3,
  MonitorPlay,
  Palette,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Video,
  Wand2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { getCurrencyPreference } from '@/lib/currency';
import { formatPrice } from '@/lib/pricing';
import { productConfig } from '@/config/product';

const valuePoints = [
  { value: '5,000+', label: 'Digital Resources' },
  { value: '1,000+', label: 'Landing Pages' },
  { value: '500+', label: 'Source Code Projects' },
  { value: 'Creative', label: 'Assets Included' },
  { value: 'Courses', label: 'Learning Resources' },
];

const categories = [
  { title: 'Digital Templates', count: '1,000+', icon: Layers3 },
  { title: 'Landing Pages', count: '1,000+', icon: MonitorPlay },
  { title: 'Source Code', count: '500+', icon: FileCode2 },
  { title: 'AI Resources', count: 'Included', icon: Sparkles },
  { title: 'Courses', count: 'Included', icon: Star },
  { title: 'Business Resources', count: 'Included', icon: BriefcaseBusiness },
  { title: 'Video Assets', count: 'Included', icon: Video },
  { title: 'Photo Assets', count: 'Included', icon: ImageIcon },
  { title: 'Design Resources', count: 'Included', icon: Palette },
  { title: 'Software/Tools', count: 'Included', icon: Wand2 },
  { title: 'Lead Resources', count: 'Included', icon: Database },
  { title: 'Other Digital Assets', count: 'Included', icon: ShieldCheck },
];

const testimonials = [
  { name: 'Arjun', role: 'Freelance Designer', quote: 'The bundle gave me a fast way to access templates, inspiration, and assets without wasting hours hunting around the web.' },
  { name: 'Neha', role: 'Startup Founder', quote: 'It feels like a to-do list for growth: smart resources, source code, and enough material to move faster without the usual chaos.' },
  { name: 'Ravi', role: 'Developer', quote: 'The code and design references are practical, usable, and a lot more helpful than generic templates that need work before shipping.' },
];

const faqs = productConfig.faq;

export default async function HomePage() {
  const currency = getCurrencyPreference();
  const price = formatPrice(currency);

  return (
    <main>
      <section className="container-shell py-10 pb-20 md:py-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-200">
              Digital Resource Bundle
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[0.98] text-white sm:text-5xl lg:text-7xl">
              5,000+ DIGITAL RESOURCES.
              <span className="mt-2 block text-slate-300">ONE PREMIUM VAULT.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-300">
              Access a curated collection of digital products, templates, source code, creative assets, learning resources and business resources from one place.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/checkout" className="primary-btn gap-2">
                GET INSTANT ACCESS <span aria-hidden="true">•</span> {price}
              </Link>
              <a href="#inside" className="secondary-btn gap-2">
                EXPLORE WHAT&apos;S INSIDE <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-blue-300" />Secure checkout</span>
              <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4 text-blue-300" />Instant digital access</span>
              <span className="inline-flex items-center gap-2"><Star className="h-4 w-4 text-blue-300" />Transparent pricing</span>
            </div>
          </div>

          <div className="relative">
            <div className="glass-panel rounded-[32px] p-4 shadow-[0_30px_80px_rgba(17,24,39,0.55)]">
              <div className="overflow-hidden rounded-[24px] border border-white/10 bg-slate-900/70">
                <Image
                  src="/asstes/Digital Product Banner.png"
                  alt="SELLDROX digital vault product mockup"
                  width={900}
                  height={1000}
                  priority
                  className="h-[540px] w-full object-cover"
                />
              </div>
            </div>
            <div className="absolute -left-6 bottom-10 hidden rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-soft md:block">
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Bundle price</div>
              <div className="mt-2 text-3xl font-black text-white">{price}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="light-stat-strip border-y border-white/10 bg-slate-900/40">
        <div className="container-shell grid gap-6 py-8 md:grid-cols-5">
          {valuePoints.map((point) => (
            <div key={point.label} className="light-stat-card rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-5 text-center md:text-left">
              <div className="text-3xl font-black text-white">{point.value}</div>
              <div className="mt-1 text-sm text-slate-300">{point.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="inside" className="container-shell py-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">What&apos;s inside</span>
          <h2 className="mt-4 text-3xl font-black text-white md:text-5xl">One vault. Multiple resource categories.</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="glass-panel group rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-400/40 hover:bg-blue-500/5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-200 transition group-hover:bg-blue-500/20">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-[11px] uppercase tracking-[0.12em] text-slate-400">{item.count}</div>
                <h3 className="mt-3 text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-sm text-slate-300">
                  Practical resources for business, design, automation, development, marketing, and creative execution.
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="container-shell py-20">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">Product breakdown</span>
            <h2 className="mt-4 text-3xl font-black text-white md:text-5xl">Built to save time and increase leverage.</h2>
            <div className="mt-8 space-y-5">
              <div className="glass-panel rounded-3xl p-6">
                <h3 className="text-xl font-bold text-white">Landing page collection</h3>
                <p className="mt-3 text-slate-300">Modern, responsive, conversion-focused layout inspiration for SaaS, agency, portfolio, startup, and e-commerce use cases.</p>
              </div>
              <div className="glass-panel rounded-3xl p-6">
                <h3 className="text-xl font-bold text-white">Source code collection</h3>
                <p className="mt-3 text-slate-300">Front-end, back-end, and starter project references built to accelerate prototyping, product builds, and internal tooling.</p>
              </div>
              <div className="glass-panel rounded-3xl p-6">
                <h3 className="text-xl font-bold text-white">AI courses & resources</h3>
                <p className="mt-3 text-slate-300">Practical productivity, workflow design, prompt strategy, and business workflows for people already building with AI.</p>
              </div>
              <div className="glass-panel rounded-3xl p-6">
                <h3 className="text-xl font-bold text-white">Video & photo assets</h3>
                <p className="mt-3 text-slate-300">Creative assets for editing, thumbnails, design systems, content production, and polished visual output.</p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <Image src="/asstes/product img 1.png" alt="Resource preview" width={900} height={700} className="rounded-[28px] border border-white/10 object-cover" />
            <div className="grid gap-6 sm:grid-cols-2">
              <Image src="/asstes/Product img 2.png" alt="Dashboard preview" width={500} height={400} className="rounded-[24px] border border-white/10 object-cover" />
              <Image src="/asstes/Product img 3.png" alt="Asset preview" width={500} height={400} className="rounded-[24px] border border-white/10 object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="light-audience-section bg-slate-900/40 py-20">
        <div className="container-shell">
          <div className="mx-auto max-w-4xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">Who is this for?</span>
            <h2 className="mt-4 text-3xl font-black text-white md:text-6xl">Built for builders, creators, and operators.</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              { name: 'Developers', icon: FileCode2 },
              { name: 'Designers', icon: Palette },
              { name: 'Creators', icon: Sparkles },
              { name: 'Freelancers', icon: BriefcaseBusiness },
              { name: 'Students', icon: Star },
              { name: 'Entrepreneurs', icon: Users },
              { name: 'Marketers', icon: Globe },
              { name: 'Agency owners', icon: Layers3 },
            ].map((person) => {
              const Icon = person.icon;
              return (
                <div key={person.name} className="light-audience-card glass-panel rounded-3xl p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-blue-400/40">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/15 text-blue-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{person.name}</h3>
                  <p className="mt-2 text-sm text-slate-300">Useful for faster execution, inspiration, practical resources, and easier product-building workflows.</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-shell py-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">Social proof</span>
          <h2 className="mt-4 text-3xl font-black text-white md:text-5xl">What customers are saying</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.name} className="glass-panel rounded-3xl p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/15 text-sm font-bold text-blue-200">{item.name.slice(0, 2).toUpperCase()}</div>
                <div>
                  <div className="font-bold text-white">{item.name}</div>
                  <div className="text-sm text-slate-400">{item.role}</div>
                </div>
              </div>
              <p className="mt-6 text-slate-300">&ldquo;{item.quote}&rdquo;</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell py-20">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">Why buy from SELLDROX?</span>
            <h2 className="mt-4 text-3xl font-black text-white md:text-5xl">Secure access, clear policies, simple buying.</h2>
            <div className="mt-8 space-y-5">
              {[
                { label: 'Transparent pricing', icon: Star },
                { label: 'Customer support', icon: Headphones },
                { label: 'Secure account', icon: Check },
                { label: 'Clear refund policy', icon: Globe },
                { label: 'Global checkout', icon: CreditCard },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="light-policy-item flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/15 text-blue-200"><Icon className="h-4 w-4" /></span>
                    <span className="font-medium text-slate-200">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="light-pricing-card rounded-[32px] border border-white/10 bg-slate-800/70 p-8">
            <div className="text-sm uppercase tracking-[0.2em] text-gray-400">Bundle value</div>
            <h3 className="mt-3 text-3xl font-black text-white">One payment. Multiple categories.</h3>
            <div className="mt-6 space-y-4 text-slate-200">
              {[
                'Landing page resources',
                'Source code',
                'Creative assets',
                'Courses & learning resources',
              ].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3">
                  <span>{item}</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300"><Check className="h-3.5 w-3.5" /></span>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-3xl bg-blue-500/10 p-5 text-center border border-blue-400/20">
              <div className="text-sm uppercase tracking-[0.2em] text-blue-200">ONE PAYMENT</div>
              <div className="mt-3 text-5xl font-black text-white">{price}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-20">
        <div className="light-faq-card rounded-[32px] border border-white/10 bg-slate-900/60 p-8 md:p-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-blue-200">FAQ</div>
              <h2 className="mt-4 text-3xl font-black text-white md:text-5xl">Common questions</h2>
            </div>
            <Link href="/contact" className="secondary-btn whitespace-nowrap">Need help?</Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {faqs.slice(0, 8).map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="font-bold text-white">{faq.question}</h3>
                <p className="mt-2 text-sm text-slate-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell pb-28 pt-8">
        <div className="light-faq-card rounded-[32px] border border-white/10 bg-slate-900/60 p-8 text-center shadow-soft md:p-12">
          <div className="text-xs uppercase tracking-[0.2em] text-blue-200">Ready to unlock the vault?</div>
          <h2 className="mt-4 text-3xl font-black text-white md:text-5xl">Get access to the complete digital bundle.</h2>
          <div className="mt-6 text-4xl font-black text-white">{price}</div>
          <Link href="/checkout" className="primary-btn mt-8">GET INSTANT ACCESS</Link>
          <p className="mt-4 text-sm text-slate-300">Secure checkout - Digital delivery - Transparent policies</p>
        </div>
      </section>
    </main>
  );
}
