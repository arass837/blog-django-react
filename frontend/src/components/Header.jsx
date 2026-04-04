import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import logo from "../assets/logo.jpg";

export default function Header() {
  const navigate = useNavigate();
  const isLogged = Boolean(localStorage.getItem('access_token'));

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login', { replace: true });
  };

// const scrollToFirstPost = (e) => {
//   e.preventDefault();

//   const firstPost = document.getElementById('first-post');
//   if (firstPost) {
//     firstPost.scrollIntoView({ behavior: 'smooth' });
//   }
// };

  return (
    <header
      className={styles.header}
      style={{ 
 backgroundImage: `url(${logo})`, 
  backgroundSize: 'cover', 
  backgroundPosition: 'center'
}}
    >
      <div className={styles.overlay} />

      <div className={styles.container}>
        <div className={styles.topBar}>
          <Link to="/" className={styles.logo}>ReactoDjango</Link>
          <nav className={styles.nav}>
            <Link to="/" className={styles.link}>Start</Link>
            {isLogged ? (
              <button type="button" onClick={handleLogout} className={styles.authBtn}>Wyloguj</button>
            ) : (
              <Link to="/login" className={styles.authBtn}>Zaloguj</Link>
            )}
          </nav>
        </div>

        <div className={styles.hero}>
          <h1 className={styles.title}>Witaj w ReactoDjango</h1>
          <div className={styles.heroBottom}>
  <p className={styles.subtitle}>Frontend w React + Backend w Django</p>
  <button
    type="button"
    className={styles.cta}
    onClick={() => navigate("/", { state: { scrollToFirstPost: true } })}
  >
    Zacznij teraz
  </button>

  <div className={styles.introLinks}>
    <span>Wprowadzenie do: </span>
    <Link to="/python" className={styles.introLink}>Python</Link>
    <Link to="/django" className={styles.introLink}>Django</Link>
    <Link to="/react" className={styles.introLink}>React</Link>
  </div>
</div>
        </div>
      </div>
    </header>
  );
}