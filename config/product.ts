import type { ProductConfig } from '@/types/product';

export const productConfig: ProductConfig = {
  id: 'prod_selldrox_digital_vault',
  slug: 'selldrox-digital-vault',
  name: 'SELLDROX Ultimate Digital Vault',
  shortDescription: 'A premium collection of digital resources, templates, source code, creative assets, training material, and business resources in one accessible bundle.',
  longDescription:
    'A curated digital vault built for creators, developers, freelancers, and entrepreneurs who want practical tools, resources, and inspiration in one organized, easy-to-access library.',
  categories: [
    'Digital Templates',
    'Landing Pages',
    'Source Code',
    'AI Resources',
    'Courses',
    'Business Resources',
    'Video Assets',
    'Photo Assets',
    'Design Resources',
    'Software/Tools',
    'Lead Resources',
    'Other Digital Resources',
  ],
  featureHighlights: [
    { label: 'Digital resources', value: '5,000+' },
    { label: 'Landing page templates', value: '1,000+' },
    { label: 'Source code projects', value: '500+' },
    { label: 'Creative assets', value: 'Included' },
    { label: 'Courses & learning resources', value: 'Included' },
  ],
  images: [
    '/asstes/Digital Product Banner.png',
    '/asstes/Product img 1.png',
    '/asstes/Product img 2.png',
    '/asstes/Product img 3.png',
  ],
  faq: [
    {
      question: 'What exactly do I receive?',
      answer:
        'You receive access to the SELLDROX digital vault, which includes a curated mix of templates, source code, learning resources, creative assets, and business tools in a single digital bundle.',
    },
    {
      question: 'Is this a physical product?',
      answer: 'No. This is a digital product bundle delivered via secure digital access after payment verification.',
    },
    {
      question: 'How do I access the bundle?',
      answer: 'After successful payment, you receive a secure access link and a confirmation email with instructions to access the vault.',
    },
    {
      question: 'Can I pay in INR or USD?',
      answer: 'Yes. The storefront automatically suggests an appropriate currency based on your region, and you can switch manually at any time.',
    },
    {
      question: 'Can I use the resources commercially?',
      answer: 'License terms depend on the specific resource. The product configuration and legal pages explain usage limits and any restrictions.',
    },
    {
      question: 'Are third-party subscriptions included?',
      answer: 'Only when specifically represented in the product configuration. SELLDROX does not claim any third-party subscription unless it is actually supported.',
    },
    {
      question: 'How quickly do I receive access?',
      answer: 'Access is usually granted immediately after successful payment verification and order confirmation.',
    },
    {
      question: 'What payment methods are supported?',
      answer: 'INR payments use Cashfree and USD payments use PayPal in the configured production environment.',
    },
    {
      question: 'Can international customers purchase?',
      answer: 'Yes. Customers outside India can pay in USD using the PayPal flow.',
    },
    {
      question: 'What happens if I lose access?',
      answer: 'Contact support with your order ID and email, and the team can help restore or verify your entitlement.',
    },
    {
      question: 'What is the refund policy?',
      answer: 'The refund policy is designed for digital products and explains eligibility, support handling, and processing timelines. It should be reviewed with the business owner for local legal requirements.',
    },
    {
      question: 'Is the product updated?',
      answer: 'The product configuration allows the bundle to evolve over time, and the delivery and access model is designed to support future updates.',
    },
    {
      question: 'How do I contact support?',
      answer: 'Use the contact form or the support email configured in the environment variables.',
    },
  ],
  deliveryMode: 'protected-file',
  paymentTerms: ['Secure checkout', 'Digital delivery', 'Transparent policies'],
};
