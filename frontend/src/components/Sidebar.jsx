import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styles from './Sidebar.module.css';

const technologies = [
  { slug: 'react', label: 'React' },
  { slug: 'django', label: 'Django' },
  { slug: 'rest-api', label: 'REST API' },
  { slug: 'python', label: 'Python' },
  { slug: 'web-design', label: 'Web Design' },
];

export default function Sidebar() {
  const [searchParams] = useSearchParams();
  const activeTechnology = searchParams.get('technology') || '';

  return (
    <aside className={styles.sidebar}>
      <div className={styles.profileCard}>
        <span className={styles.label}>ABOUT THE BLOG</span>
        <div className={styles.avatar}>A</div>
        <h3>ReactoDjango</h3>
        <p>
          A blog about building web applications, learning software development, and
          combining React with Django REST Framework in real-world projects.
        </p>
      </div>

      <div className={styles.widget}>
        <span className={styles.label}>TECHNOLOGIES</span>
        <div className={styles.tags}>
          {technologies.map((technology) => (
            <Link
              key={technology.slug}
              to={`/?technology=${technology.slug}`}
              className={`${styles.tag} ${
                activeTechnology === technology.slug ? styles.activeTag : ''
              }`}
            >
              {technology.label}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
