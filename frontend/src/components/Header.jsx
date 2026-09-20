import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogged = Boolean(localStorage.getItem('access_token'));
  const isHome = location.pathname === '/';

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login', { replace: true });
  };

  return (
    <header className={`${styles.header} ${!isHome ? styles.compactHeader : ''}`}>
      {isHome && (
        <>
          <div className={styles.glowOne} />
          <div className={styles.glowTwo} />
        </>
      )}

      <div className={styles.container}>
        <div className={styles.topBar}>
          <Link to="/" className={styles.brand} aria-label="ReactoDjango - home">
            <span className={styles.brandMark}>RD</span>
            <span>ReactoDjango</span>
          </Link>

          <nav className={styles.nav}>
            <Link to="/" className={styles.link}>Home</Link>
            <Link to="/posts" className={styles.link}>Posts</Link>
            {isLogged ? (
              <button type="button" onClick={handleLogout} className={styles.authBtn}>Log out</button>
            ) : (
              <Link to="/login" className={styles.authBtn}>Log in</Link>
            )}
          </nav>
        </div>

        {isHome && (
          <div className={styles.hero}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>WEB DEVELOPMENT BLOG</span>
              <h1>React on the frontend.<br />Django on the backend.</h1>
              <p>
                Practical articles, examples, and experiments focused on building modern
                web applications with React and Django.
              </p>

              <div className={styles.actions}>
                <Link to="/posts" className={styles.primaryCta}>
                  Read the latest posts <span aria-hidden="true">→</span>
                </Link>
                <span className={styles.techBadge}>React + Django REST</span>
              </div>
            </div>

            <div className={styles.visual} aria-hidden="true">
              <div className={styles.logoCard}>
                <div className={styles.logoCardTop}>
                  <span />
                  <span />
                  <span />
                </div>
                <img src="/images/logo.jpg" alt="" />
              </div>
              <div className={styles.codeChip}>API ready</div>
              <div className={styles.reactChip}>React UI</div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
