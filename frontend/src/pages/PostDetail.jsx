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

const plainText = (value) => String(value || '')
  .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  .replace(/[`*_~]/g, '')
  .trim();

const slugifyHeading = (value) => plainText(value)
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'section';

const getNodeText = (children) => {
  if (typeof children === 'string' || typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(getNodeText).join('');
  if (children?.props?.children) return getNodeText(children.props.children);
  return '';
};

const buildToc = (markdown = '') => {
  const used = new Map();
  return markdown.split('\n').reduce((items, line) => {
    const match = line.match(/^(#{2,3})\s+(.+?)\s*#*\s*$/);
    if (!match) return items;

    const level = match[1].length;
    const title = plainText(match[2]);
    const base = slugifyHeading(title);
    const count = used.get(base) || 0;
    used.set(base, count + 1);
    const id = count ? `${base}-${count + 1}` : base;

    items.push({ level, title, id });
    return items;
  }, []);
};

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [error, setError] = useState(false);
  const [likeBusy, setLikeBusy] = useState(false);
  const isLogged = Boolean(localStorage.getItem('access_token'));

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

  const toc = useMemo(() => buildToc(post?.content || ''), [post?.content]);
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


  const handleLike = async () => {
    if (!isLogged) return;
    setLikeBusy(true);
    try {
      const response = await api.post(`posts/${post.slug}/like/`);
      setPost(current => ({
        ...current,
        liked_by_me: response.data.liked,
        likes_count: response.data.likes_count,
      }));
    } catch (likeError) {
      console.error('Could not update like.', likeError);
    } finally {
      setLikeBusy(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Code copied!');
    });
  };

  const makeHeading = (Tag) => ({ children, ...props }) => {
    const text = getNodeText(children);
    const id = slugifyHeading(text);
    return <Tag id={id} className={styles.anchorHeading} {...props}>{children}</Tag>;
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

  if (!post) return <p className={styles.loading}>Loading article...</p>;

  return (
    <div className={styles.page}>
      <Seo
        title={post.seo_title || `${post.title} | ReactoDjango`}
        description={seoDescription}
        path={`/post/${post.slug}`}
        type="article"
        schema={articleSchema}
      />

      {toc.length > 0 && (
        <aside className={styles.toc} aria-label="Table of contents">
          <div className={styles.tocInner}>
            <Link to="/posts" className={styles.seriesLink}>ReactoDjango articles</Link>
            <div className={styles.tocDivider} />
            <span className={styles.tocLabel}>IN THIS ARTICLE</span>
            <nav className={styles.tocNav}>
              {toc.map(item => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`${styles.tocLink} ${item.level === 3 ? styles.tocSubLink : ''}`}
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      )}

      <main className={styles.container}>
        <Link to="/posts" className={styles.back}>← All articles</Link>
        <article className={styles.article}>
          <div className={styles.articleMeta}>
            <span className={styles.category}>{post.category}</span>
            {post.created_at && (
              <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
            )}
          </div>

          <h1>{post.title}</h1>
          <p className={styles.lead}>{seoDescription}</p>
          <p className={styles.author}>By {post.author_name || 'ReactoDjango Author'}</p>

          <div className={styles.likeRow}>
            {isLogged ? (
              <button
                type="button"
                className={`${styles.likeButton} ${post.liked_by_me ? styles.likeButtonActive : ''}`}
                onClick={handleLike}
                disabled={likeBusy}
              >
                {post.liked_by_me ? '♥ Liked' : '♡ Like'}
              </button>
            ) : (
              <Link to="/login" className={styles.loginToLike}>Log in to like this post</Link>
            )}
            <span className={styles.likeCount}>
              {post.likes_count || 0} {(post.likes_count || 0) === 1 ? 'like' : 'likes'}
            </span>
          </div>

          <div className={styles.body}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: makeHeading('h2'),
                h3: makeHeading('h3'),
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const code = String(children).replace(/\n$/, '');
                  if (inline) {
                    return <code className={styles.inlineCode} {...props}>{children}</code>;
                  }
                  return (
                    <div className={styles.codeBlock}>
                      <button
                        type="button"
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
      </main>
    </div>
  );
}
