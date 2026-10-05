import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://example.com/', lastModified: new Date() },
    { url: 'https://example.com/about', lastModified: new Date() },
    { url: 'https://example.com/contact', lastModified: new Date() },
    { url: 'https://example.com/privacy-policy', lastModified: new Date() },
    { url: 'https://example.com/refund-policy', lastModified: new Date() },
    { url: 'https://example.com/disclaimer', lastModified: new Date() },
  ];
}
