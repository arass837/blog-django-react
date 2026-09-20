import React from 'react';
import styles from './Sidebar.module.css';

export default function Sidebar() {
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
          <span>React</span>
          <span>Django</span>
          <span>REST API</span>
          <span>Python</span>
          <span>Web Design</span>
        </div>
      </div>
    </aside>
  );
}
