import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <strong>ReactoDjango</strong>
          <span>A blog built with React + Django</span>
        </div>
        <p>© 2026 ReactoDjango</p>
      </div>
    </footer>
  );
}
