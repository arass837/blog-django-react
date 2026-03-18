import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Login from './pages/Login';
import styles from './App.module.css';

export default function App() {
  return (
    <Router>
      <div className={styles.appContainer}>
        <Header />
        
        <div className={styles.layoutWrapper}>
          <main className={styles.mainContent}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>
          <Sidebar />
        </div>

        <Footer />
      </div>
    </Router>
  );
}
