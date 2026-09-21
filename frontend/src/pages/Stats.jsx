import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import styles from './Stats.module.css';

const statCards = [
  ['all_time', 'All time'],
  ['today', 'Today'],
  ['yesterday', 'Yesterday'],
  ['last_7_days', 'Last 7 days'],
  ['last_30_days', 'Last 30 days'],
];

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('views/stats/')
      .then((response) => {
        setStats(response.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          setError('Please log in to view statistics.');
        } else if (err.response?.status === 403) {
          setError('Administrator access is required to view statistics.');
        } else {
          setError('Could not load visitor statistics.');
        }
        setLoading(false);
      });
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.headerRow}>
        <div>
          <span className={styles.kicker}>PRIVATE</span>
          <h1>Visitor statistics</h1>
          <p>Only an administrator account can open this page.</p>
        </div>
        <Link to="/" className={styles.backLink}>Back to blog</Link>
      </div>

      {loading && <div className={styles.message}>Loading statistics...</div>}
      {!loading && error && <div className={styles.error}>{error}</div>}

      {!loading && !error && stats && (
        <>
          <div className={styles.grid}>
            {statCards.map(([key, label]) => (
              <article className={styles.card} key={key}>
                <span className={styles.label}>{label}</span>
                <strong>{stats.unique_visitors?.[key] ?? 0}</strong>
                <p>Unique browser/device visitors.</p>
              </article>
            ))}
          </div>

          <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <div>
                <span className={styles.kicker}>ARTICLES</span>
                <h2>Post views</h2>
              </div>
              <span className={styles.dateLabel}>Updated: {stats.generated_for_date}</span>
            </div>

            {stats.posts?.length ? (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Article</th>
                      <th>Total views</th>
                      <th>Unique readers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.posts.map((post) => (
                      <tr key={post.id}>
                        <td>
                          <Link to={`/post/${post.slug}`} className={styles.postLink}>
                            {post.title}
                          </Link>
                        </td>
                        <td>{post.total_views ?? 0}</td>
                        <td>{post.unique_readers ?? 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={styles.message}>No published posts yet.</div>
            )}
          </div>

          <p className={styles.note}>
            Visitors are counted anonymously by a random browser identifier stored locally.
            No IP address is stored. Private browsing, cleared browser storage, or another
            device can be counted as a new visitor.
          </p>
        </>
      )}
    </section>
  );
}
