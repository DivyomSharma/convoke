import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/workspace', '/messages', '/notifications', '/settings', '/api/'],
    },
    sitemap: 'https://convoke.com/sitemap.xml',
  };
}
