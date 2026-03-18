import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './Home.module.css';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('posts/')
      .then(res => { setPosts(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Ładowanie wpisów...</p>;

  return (
    <div className={styles.list}>
      <h1>NEW POSTS...</h1>
      {posts.map(post => (
        <article key={post.id} className={`${styles.postCard} ${post.id === posts[0].id ? 'post-card' : ''}`}>

          <h2>{post.title}</h2>
          <p className={styles.meta}>Autor: {post.author_name}</p>
          {/* Renderowanie Markdown */}
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content.substring(0, 150) + '...'}
          </ReactMarkdown>
          <Link to={`/post/${post.id}`} className={styles.link}>Czytaj więcej</Link>
        </article>
      ))}
    </div>
  );
}
