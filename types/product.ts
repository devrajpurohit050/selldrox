export type ProductConfig = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  categories: string[];
  featureHighlights: { label: string; value: string }[];
  images: string[];
  faq: { question: string; answer: string }[];
  deliveryMode: 'protected-file' | 'external-resource';
  paymentTerms: string[];
};
