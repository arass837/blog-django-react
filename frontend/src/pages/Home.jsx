
// ========================================================================================================================
import { useEffect, useState } from "react";
import * as api from "../api";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./Home.module.css";
import { useLocation } from 'react-router-dom';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  api.fetchPosts()
    .then(res => {
      console.log("Odpowiedź API:", res.data);
      const data = res.data;

      if (Array.isArray(data)) {
        setPosts(data);
      } else if (data.results) {
        setPosts(data.results);
      } else {
        setPosts([]);
      }

      setLoading(false);
    })
    .catch(err => {
      console.error("Błąd pobierania:", err);
      setError("Nie udało się pobrać postów");
      setLoading(false);
    });
}, []);

// ===============================================================
useEffect(() => {
  const key = "visited_homepage";

  if (!localStorage.getItem(key)) {
    api.incrementViews()   // 👈 używamy Twojego api.js
      .then(res => console.log("Views:", res.data.views))
      .catch(err => console.error(err));

    localStorage.setItem(key, "true");
  }
}, []);
// ==================================================================
  // ===============================================================
  // przewinięcie po kliknięciu przycisku w Header
  const loc = useLocation();  // <-- zmiana nazwy

  useEffect(() => {
    if (loc.state?.scrollToFirstPost) {
      const firstPost = document.getElementById('first-post');
      if (firstPost) firstPost.scrollIntoView({ behavior: 'smooth' });
    }
  }, [loc]);

  // ===============================================================




// =================================================================

  // ⏳ loading
  if (loading) return <p>⏳ Ładowanie wpisów...</p>;

  // ❌ error
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // 📭 brak postów
  if (!posts.length) return <p>Brak postów 😢</p>;



  return (
    <div className={styles.list}>
      <h1>🆕 NEW POSTS</h1>

      {posts.map((post, index) => (
        <article
          key={post.id}
             id={index === 0 ? "first-post" : undefined}  // <-- tutaj id
          className={`${styles.postCard} ${
            index === 0 ? styles.featured : ""
          }`}
        >
          <h2>{post.title}</h2>

          <p className={styles.meta}>
            Autor: {post.author_name || "Nieznany"}
          </p>

          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {(post.content || "").substring(0, 150) + "..."}
          </ReactMarkdown>

          <Link to={`/post/${post.id}`} className={styles.link}>
            Czytaj więcej →
          </Link>
        </article>
      ))}
    </div>
  );
}