import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Seo, { getSiteUrl } from '../components/Seo';
import styles from './Home.module.css';

const technologyLabels = {
  react: 'React',
  django: 'Django',
  'rest-api': 'REST API',
  python: 'Python',
  'web-design': 'Web Design',
};

const postMatchesTechnology = (post, technology) => {
  if (!technology) return true;

  const category = (post.category || '').toLowerCase();
  const searchableText = `${post.title || ''} ${post.content || ''}`.toLowerCase();

  switch (technology) {
    case 'react':
      return category === 'react' || category === 'fullstack' || searchableText.includes('react');
    case 'django':
      return category === 'django' || category === 'fullstack' || searchableText.includes('django');
    case 'rest-api':
      return (
        searchableText.includes('rest api') ||
        searchableText.includes('django rest framework') ||
        searchableText.includes('rest framework') ||
        searchableText.includes('drf') ||
        searchableText.includes('api endpoint')
      );
    case 'python':
      return (
        category === 'python' ||
        category === 'django' ||
        searchableText.includes('python')
      );
    case 'web-design':
      return (
        searchableText.includes('web design') ||
        searchableText.includes('responsive') ||
        searchableText.includes('css') ||
        searchableText.includes('html') ||
        searchableText.includes('frontend') ||
        searchableText.includes('front-end') ||
        searchableText.includes('user interface') ||
        searchableText.includes(' ui ')
      );
    default:
      return true;
  }
};

const formatDate = (value) => {
  if (!value) return '';
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
};

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchParams] = useSearchParams();

  const technology = searchParams.get('technology') || '';
  const technologyLabel = technologyLabels[technology] || '';

  useEffect(() => {
    api.get('posts/')
      .then(res => {
        setPosts(Array.isArray(res.data) ? res.data : res.data.results || []);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const filteredPosts = useMemo(
    () => posts.filter((post) => postMatchesTechnology(post, technology)),
    [posts, technology]
  );

  const websiteSchema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ReactoDjango',
    url: getSiteUrl(),
    description: 'Practical tutorials about React, Django, REST APIs, authentication, deployment, and full-stack development.',
  }), []);

  return (
    <section className={styles.section}>
      <Seo
        title={technologyLabel
          ? `${technologyLabel} Tutorials | ReactoDjango`
          : 'ReactoDjango | Practical React + Django Tutorials'}
        description={technologyLabel
          ? `Browse practical ${technologyLabel} tutorials, examples, and development notes on ReactoDjango.`
          : 'Practical React and Django tutorials covering REST APIs, authentication, CORS, Axios, PostgreSQL, Render deployment, and full-stack development.'}
        path="/"
        schema={websiteSchema}
      />

      <div className={styles.headingRow}>
        <div>
          <span className={styles.kicker}>{technologyLabel ? 'TECHNOLOGY' : 'LATEST'}</span>
          <h2>{technologyLabel ? `${technologyLabel} posts` : 'Latest posts'}</h2>
          <p>
            {technologyLabel
              ? `Articles related to ${technologyLabel}.`
              : 'Notes, solutions, and lessons from everyday software development.'}
            {technologyLabel && (
              <>
                {' '}
                <Link to="/" className={styles.clearFilter}>Show all posts</Link>
              </>
            )}
          </p>
        </div>
        {!loading && !error && (
          <span className={styles.counter}>
            {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
          </span>
        )}
      </div>

      {loading && (
        <div className={styles.statusCard}>
          <span className={styles.loader} />
          Loading posts...
        </div>
      )}

      {error && (
        <div className={styles.errorCard}>
          Could not load posts. Please try again in a moment.
        </div>
      )}

      {!loading && !error && filteredPosts.length === 0 && (
        <div className={styles.emptyCard}>
          No posts found for {technologyLabel || 'this technology'}.
          {technologyLabel && (
            <>
              {' '}<Link to="/" className={styles.clearFilter}>Show all posts</Link>
            </>
          )}
        </div>
      )}

      <div className={styles.list}>
        {filteredPosts.map((post, index) => (
          <article
            key={post.slug}
            className={`${styles.postCard} ${index === 0 ? 'post-card' : ''}`}
          >
            <div className={styles.cardTop}>
              <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
              <div className={styles.meta}>
                <span>{post.author_name || 'Author'}</span>
                {post.created_at && <span className={styles.dot}>•</span>}
                {post.created_at && <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>}
              </div>
            </div>

            <h3>
              <Link to={`/post/${post.slug}`} className={styles.titleLink}>
                {post.title}
              </Link>
            </h3>

            <div className={styles.excerpt}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {(post.content || '').slice(0, 230) + ((post.content || '').length > 230 ? '…' : '')}
              </ReactMarkdown>
            </div>

            <Link to={`/post/${post.slug}`} className={styles.readMore}>
              Read article <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
