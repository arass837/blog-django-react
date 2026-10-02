import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Stats from './pages/Stats';
import TopicPage from './pages/TopicPage';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import { trackSiteVisit } from './analytics';
import styles from './App.module.css';

function AppLayout() {
  const location = useLocation();
  const isTopicPage = ['/react', '/django', '/drf'].includes(location.pathname);
  const isProjectsPage = location.pathname === '/projects' || location.pathname.startsWith('/projects/');
  const isArticle = location.pathname.startsWith('/post/') || isTopicPage || isProjectsPage;

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
            <Route path="/react" element={<TopicPage topic="react" />} />
            <Route path="/django" element={<TopicPage topic="django" />} />
            <Route path="/drf" element={<TopicPage topic="drf" />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
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
