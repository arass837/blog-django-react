import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as api from '../api'; // <-- zmiana importu
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './PostDetail.module.css';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    api.fetchPostById(id) // <-- użycie named export
      .then(res => setPost(res.data))
      .catch(() => setPost(null));
  }, [id]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Kod skopiowany!');
    });
  };

  if (!post) return <p>Pobieranie treści...</p>;

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.back}>← Wróć</Link>
      <article className={styles.article}>
        <h1>{post.title}</h1>
        <p className={styles.author}>Autor: {post.author_name}</p>
        <div className={styles.body}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const code = String(children).replace(/\n$/, '');
                if (inline) {
                  return <code className={styles.inlineCode} {...props}>{children}</code>;
                }
                return (
                  <div className={styles.codeBlock}>
                    <button
                      className={styles.copyBtn}
                      onClick={() => copyToClipboard(code)}
                    >
                      Kopiuj
                    </button>
                    <SyntaxHighlighter
                      style={materialLight}
                      language={match ? match[1] : null}
                      PreTag="div"
                      {...props}
                    >
                      {code}
                    </SyntaxHighlighter>
                  </div>
                );
              }
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}