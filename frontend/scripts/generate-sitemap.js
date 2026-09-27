const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

const siteUrl = (process.env.REACT_APP_SITE_URL || 'https://blog-django-react-frontend.onrender.com').replace(/\/$/, '');
const apiBase = (process.env.REACT_APP_API_URL || 'https://blog-django-react-r6eq.onrender.com/api/').replace(/\/$/, '');
const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');

const escapeXml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

function requestJson(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'ReactoDjango-Sitemap-Builder/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        resolve(requestJson(new URL(res.headers.location, url).toString()));
        return;
      }
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`API returned ${res.statusCode}`));
        return;
      }
      let body = '';
      res.setEncoding('utf8');
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });
    });
    req.setTimeout(20000, () => req.destroy(new Error('Sitemap API request timed out')));
    req.on('error', reject);
  });
}

function buildXml(posts) {
  const urls = [
    `  <url>\n    <loc>${escapeXml(`${siteUrl}/`)}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>`,
    ...posts.map(post => {
      const lastmod = post.updated_at || post.created_at;
      return [
        '  <url>',
        `    <loc>${escapeXml(`${siteUrl}/post/${post.slug}`)}</loc>`,
        lastmod ? `    <lastmod>${escapeXml(new Date(lastmod).toISOString())}</lastmod>` : '',
        '    <changefreq>monthly</changefreq>',
        '    <priority>0.8</priority>',
        '  </url>',
      ].filter(Boolean).join('\n');
    }),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

(async () => {
  try {
    const data = await requestJson(`${apiBase}/posts/`);
    const posts = (Array.isArray(data) ? data : data.results || [])
      .filter(post => post && post.slug && post.is_published !== false);
    fs.writeFileSync(outputPath, buildXml(posts), 'utf8');
    console.log(`Generated sitemap.xml with ${posts.length + 1} URLs.`);
  } catch (error) {
    console.warn(`Could not fetch posts for sitemap: ${error.message}`);
    console.warn('Keeping the existing homepage-only sitemap so the build can continue.');
  }
})();
