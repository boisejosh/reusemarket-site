import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const posts = await getCollection('news');
  const siteUrl = 'https://www.reusemarket.org';
  const today = new Date().toISOString().split('T')[0];

  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/about', priority: '0.8', changefreq: 'monthly' },
    { url: '/the-market', priority: '0.8', changefreq: 'monthly' },
    { url: '/news', priority: '0.9', changefreq: 'weekly' },
    { url: '/volunteer', priority: '0.9', changefreq: 'monthly' },
    { url: '/donate', priority: '0.9', changefreq: 'monthly' },
    { url: '/donate/guidelines', priority: '0.6', changefreq: 'monthly' },
    { url: '/hours', priority: '0.8', changefreq: 'weekly' },
    { url: '/contact', priority: '0.7', changefreq: 'monthly' },
  ];

  const postUrls = posts.map((post) => ({
    url: `/news/${post.id}`,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: post.data.date.toISOString().split('T')[0],
  }));

  const allPages = [...staticPages, ...postUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${('lastmod' in page && page.lastmod) ? page.lastmod : today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
