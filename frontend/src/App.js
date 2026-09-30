import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Login from './pages/Login';
import Stats from './pages/Stats';
import { trackSiteVisit } from './analytics';
import styles from './App.module.css';

function AppLayout() {
  const location = useLocation();
  const isArticle = location.pathname.startsWith('/post/');

  useEffect(() => {
    trackSiteVisit();
  }, []);

  return (
    <div className={styles.appContainer}>
      <Header />

      <div className={`${styles.layoutWrapper} ${isArticle ? styles.articleLayout : ''}`}>
        <main className={styles.mainContent}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts" element={<Home />} />
            <Route path="/post/:slug" element={<PostDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/stats" element={<Stats />} />
          </Routes>
        </main>
        {!isArticle && <Sidebar />}
      </div>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
