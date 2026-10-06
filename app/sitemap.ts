import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routes = ['', '/about', '/checkout', '/contact', '/login', '/signup', '/privacy-policy', '/refund-policy', '/disclaimer'];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.7,
  }));
}
