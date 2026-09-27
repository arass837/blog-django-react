import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { trackPostView } from '../analytics';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Seo, { getSiteUrl, makeDescription } from '../components/Seo';
import styles from './PostDetail.module.css';

const formatDate = (value) => {
  if (!value) return '';
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
};

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    setPost(null);
    setError(false);

    Promise.all([
      api.get(`posts/${slug}/`),
      api.get('posts/'),
    ])
      .then(([postResponse, postsResponse]) => {
        const current = postResponse.data;
        const allPosts = Array.isArray(postsResponse.data)
          ? postsResponse.data
          : postsResponse.data.results || [];

        setPost(current);
        trackPostView(slug);

        const others = allPosts.filter(item => item.slug !== current.slug);
        const sameCategory = others.filter(item => item.category === current.category);
        const differentCategory = others.filter(item => item.category !== current.category);
        setRelatedPosts([...sameCategory, ...differentCategory].slice(0, 3));
      })
      .catch(() => setError(true));
  }, [slug]);

  const seoDescription = post
    ? (post.seo_description || makeDescription(post.content))
    : '';

  const articleSchema = useMemo(() => {
    if (!post) return null;
    const siteUrl = getSiteUrl();
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.seo_title || post.title,
      description: seoDescription,
      mainEntityOfPage: `${siteUrl}/post/${post.slug}`,
      url: `${siteUrl}/post/${post.slug}`,
      datePublished: post.created_at,
      dateModified: post.updated_at || post.created_at,
      author: {
        '@type': 'Person',
        name: post.author_name || 'ReactoDjango Author',
      },
      publisher: {
        '@type': 'Organization',
        name: 'ReactoDjango',
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/logo512.png`,
        },
      },
    };
  }, [post, seoDescription]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Code copied!');
    });
  };

  if (error) {
    return (
      <div className={styles.container}>
        <Seo
          title="Article not found | ReactoDjango"
          description="The requested article could not be found."
          path={`/post/${slug}`}
          noindex
        />
        <Link to="/" className={styles.back}>← Back</Link>
        <p>Could not load this article.</p>
      </div>
    );
  }

  if (!post) return <p>Loading article...</p>;

  return (
    <div className={styles.container}>
      <Seo
        title={post.seo_title || `${post.title} | ReactoDjango`}
        description={seoDescription}
        path={`/post/${post.slug}`}
        type="article"
        schema={articleSchema}
      />

      <Link to="/" className={styles.back}>← Back</Link>
      <article className={styles.article}>
        <div className={styles.articleMeta}>
          <span className={styles.category}>{post.category}</span>
          {post.created_at && (
            <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
          )}
        </div>

        <h1>{post.title}</h1>
        <p className={styles.author}>Author: {post.author_name || 'ReactoDjango Author'}</p>

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
                      Copy
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

      {relatedPosts.length > 0 && (
        <aside className={styles.related} aria-labelledby="related-title">
          <div className={styles.relatedHeader}>
            <span className={styles.relatedKicker}>KEEP LEARNING</span>
            <h2 id="related-title">Related articles</h2>
          </div>
          <div className={styles.relatedGrid}>
            {relatedPosts.map(item => (
              <Link key={item.slug} to={`/post/${item.slug}`} className={styles.relatedCard}>
                <span className={styles.relatedCategory}>{item.category}</span>
                <strong>{item.title}</strong>
                <span className={styles.relatedArrow}>Read article →</span>
              </Link>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}
