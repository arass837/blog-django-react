// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import * as api from '../api';  // <-- zmiana tutaj
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// import styles from './Home.module.css';

// export default function Home() {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api.fetchPosts()
//         setPosts(res.data.results || res.data);
//         setLoading(false);
//   }, []);

//   if (loading) return <p>Ładowanie wpisów...</p>;

//   return (
//     <div className={styles.list}>
//       <h1>NEW POSTS...</h1>
//       {posts.map(post => (
//         <article key={post.id} className={`${styles.postCard} ${post.id === posts[0].id ? 'post-card' : ''}`}>
//           <h2>{post.title}</h2>
//           <p className={styles.meta}>Autor: {post.author_name}</p>
//           <ReactMarkdown remarkPlugins={[remarkGfm]}>
//             {post.content.substring(0, 150) + '...'}
//           </ReactMarkdown>
//           <Link to={`/post/${post.id}`} className={styles.link}>Czytaj więcej</Link>
//         </article>
//       ))}
//     </div>
//   );
// }
// ========================================================================================================================
import { useEffect, useState } from "react";
import * as api from "../api";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./Home.module.css";

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