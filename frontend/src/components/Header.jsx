import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import api from '../api';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogged = Boolean(localStorage.getItem('access_token'));
  const isHome = location.pathname === '/';
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [menuOpen]);

  useEffect(() => {
    let active = true;

    if (!isLogged) {
      setIsAdmin(false);
      return () => { active = false; };
    }

    api.get('me/')
      .then((response) => {
        if (active) {
          setIsAdmin(Boolean(response.data?.is_staff));
        }
      })
      .catch(() => {
        if (active) {
          setIsAdmin(false);
        }
      });

    return () => {
      active = false;
    };
  }, [isLogged]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setMenuOpen(false);
    navigate('/login', { replace: true });
  };

  const menuItems = [
    { to: '/', label: 'Home' },
    { to: '/posts', label: 'Posts' },
    { to: '/react', label: 'React' },
    { to: '/django', label: 'Django' },
    { to: '/drf', label: 'DRF' },
    { to: '/projects', label: 'My Projects' },
    ...(isAdmin ? [{ to: '/stats', label: 'Statistics' }] : []),
  ];

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

          <nav className={styles.nav} aria-label="Main navigation">
            {menuItems.map((item) => (
              <Link key={item.to} to={item.to} className={styles.link}>{item.label}</Link>
            ))}
            {isLogged ? (
              <button type="button" onClick={handleLogout} className={styles.authBtn}>Log out</button>
            ) : (
              <>
                <Link to="/login" className={styles.authBtn}>Log in</Link>
                <Link to="/register" className={styles.authBtn}>Sign up</Link>
              </>
            )}
          </nav>

          <button
            type="button"
            className={styles.menuToggle}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <span aria-hidden="true" className={styles.closeIcon}>×</span>
            ) : (
              <span className={styles.hamburger} aria-hidden="true"><i /><i /><i /></span>
            )}
          </button>

          {menuOpen && (
            <nav id="mobile-navigation" className={styles.mobileMenu} aria-label="Mobile navigation">
              <div className={styles.mobileMenuLinks}>
                {menuItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`${styles.mobileLink} ${location.pathname === item.to ? styles.mobileActive : ''}`}
                    aria-current={location.pathname === item.to ? 'page' : undefined}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className={styles.mobileAuth}>
                {isLogged ? (
                  <button type="button" onClick={handleLogout} className={styles.mobileAuthButton}>Log out</button>
                ) : (
                  <>
                    <Link to="/login" className={styles.mobileAuthButton} onClick={() => setMenuOpen(false)}>Log in</Link>
                    <Link to="/register" className={styles.mobileAuthButton} onClick={() => setMenuOpen(false)}>Sign up</Link>
                  </>
                )}
              </div>
            </nav>
          )}
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
