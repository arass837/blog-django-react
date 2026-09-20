import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './Home.module.css';

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

  return (
    <section className={styles.section}>
      <div className={styles.headingRow}>
        <div>
          <span className={styles.kicker}>LATEST</span>
          <h2>Latest posts</h2>
          <p>Notes, solutions, and lessons from everyday software development.</p>
        </div>
        {!loading && !error && (
          <span className={styles.counter}>{posts.length} {posts.length === 1 ? 'post' : 'posts'}</span>
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

      {!loading && !error && posts.length === 0 && (
        <div className={styles.emptyCard}>There are no posts yet.</div>
      )}

      <div className={styles.list}>
        {posts.map((post, index) => (
          <article
            key={post.id}
            className={`${styles.postCard} ${index === 0 ? 'post-card' : ''}`}
          >
            <div className={styles.cardTop}>
              <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
              <div className={styles.meta}>
                <span>{post.author_name || 'Author'}</span>
                {post.created_at && <span className={styles.dot}>•</span>}
                {post.created_at && <time>{formatDate(post.created_at)}</time>}
              </div>
            </div>

            <h3>{post.title}</h3>

            <div className={styles.excerpt}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {(post.content || '').slice(0, 230) + ((post.content || '').length > 230 ? '…' : '')}
              </ReactMarkdown>
            </div>

            <Link to={`/post/${post.id}`} className={styles.readMore}>
              Read article <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
