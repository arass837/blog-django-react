import { useEffect } from 'react';

const DEFAULT_SITE_NAME = 'ReactoDjango';
const DEFAULT_DESCRIPTION =
  'Practical React and Django tutorials, REST API examples, deployment guides, and full-stack development notes.';

const getSiteUrl = () => {
  const configured = (process.env.REACT_APP_SITE_URL || '').replace(/\/$/, '');
  if (configured) return configured;
  if (typeof window !== 'undefined') return window.location.origin;
  return 'https://blog-django-react-frontend.onrender.com';
};

const ensureMeta = (selector, attrs) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    document.head.appendChild(el);
  }
  return el;
};

const ensureCanonical = () => {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  return el;
};

export const plainText = (value = '') =>
  value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[-#>*_~]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const makeDescription = (content = '', fallback = DEFAULT_DESCRIPTION) => {
  const text = plainText(content) || fallback;
  if (text.length <= 160) return text;
  return `${text.slice(0, 157).trimEnd()}...`;
};

export default function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  type = 'website',
  image = '/logo512.png',
  noindex = false,
  schema = null,
}) {
  useEffect(() => {
    const siteUrl = getSiteUrl();
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const canonicalUrl = `${siteUrl}${normalizedPath === '/' ? '' : normalizedPath}`;
    const fullTitle = title || `${DEFAULT_SITE_NAME} | React + Django Blog`;
    const cleanDescription = makeDescription(description);
    const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image.startsWith('/') ? image : `/${image}`}`;

    document.title = fullTitle;

    const metaDescription = ensureMeta('meta[name="description"]', { name: 'description' });
    metaDescription.setAttribute('content', cleanDescription);

    const robots = ensureMeta('meta[name="robots"]', { name: 'robots' });
    robots.setAttribute('content', noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large');

    const values = [
      ['meta[property="og:type"]', { property: 'og:type' }, type],
      ['meta[property="og:site_name"]', { property: 'og:site_name' }, DEFAULT_SITE_NAME],
      ['meta[property="og:title"]', { property: 'og:title' }, fullTitle],
      ['meta[property="og:description"]', { property: 'og:description' }, cleanDescription],
      ['meta[property="og:url"]', { property: 'og:url' }, canonicalUrl],
      ['meta[property="og:image"]', { property: 'og:image' }, imageUrl],
      ['meta[name="twitter:card"]', { name: 'twitter:card' }, 'summary_large_image'],
      ['meta[name="twitter:title"]', { name: 'twitter:title' }, fullTitle],
      ['meta[name="twitter:description"]', { name: 'twitter:description' }, cleanDescription],
      ['meta[name="twitter:image"]', { name: 'twitter:image' }, imageUrl],
    ];

    values.forEach(([selector, attrs, value]) => {
      ensureMeta(selector, attrs).setAttribute('content', value);
    });

    ensureCanonical().setAttribute('href', canonicalUrl);

    let jsonLd = document.head.querySelector('script[data-reactodjango-seo="jsonld"]');
    if (schema) {
      if (!jsonLd) {
        jsonLd = document.createElement('script');
        jsonLd.type = 'application/ld+json';
        jsonLd.dataset.reactodjangoSeo = 'jsonld';
        document.head.appendChild(jsonLd);
      }
      jsonLd.textContent = JSON.stringify(schema);
    } else if (jsonLd) {
      jsonLd.remove();
    }

    return () => {
      // The next route updates these tags. We intentionally keep them in <head>
      // to avoid flashing the generic metadata during client-side navigation.
    };
  }, [title, description, path, type, image, noindex, schema]);

  return null;
}

export { getSiteUrl };
