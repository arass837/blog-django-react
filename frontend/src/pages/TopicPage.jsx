import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import api from '../api';
import Seo, { makeDescription } from '../components/Seo';
import styles from './PostDetail.module.css';

const TOPICS = {
  react: {
    label: 'React',
    postSlug: 'react',
  },
  django: {
    label: 'Django',
    postSlug: 'django',
  },
  drf: {
    label: 'Django REST Framework',
    postSlug: 'drf',
  },
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

    items.push({
      level,
      title,
      id: count ? `${base}-${count + 1}` : base,
    });

    return items;
  }, []);
};

const makeHeadingRenderer = (Tag) => {
  const used = new Map();

  return function Heading({ children, ...props }) {
    const text = getNodeText(children);
    const base = slugifyHeading(text);
    const count = used.get(base) || 0;
    used.set(base, count + 1);
    const id = count ? `${base}-${count + 1}` : base;

    return (
      <Tag id={id} className={styles.anchorHeading} {...props}>
        {children}
      </Tag>
    );
  };
};

export default function TopicPage({ topic }) {
  const topicConfig = TOPICS[topic];
  const [post, setPost] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setPost(null);
    setError(false);

    if (!topicConfig) {
      setError(true);
      return;
    }

    api.get(`posts/${topicConfig.postSlug}/`)
      .then(response => setPost(response.data))
      .catch(() => setError(true));
  }, [topic, topicConfig]);

  const toc = useMemo(() => buildToc(post?.content || ''), [post?.content]);
  const seoDescription = post
    ? (post.seo_description || makeDescription(post.content))
    : '';

  const markdownComponents = {
    h2: makeHeadingRenderer('h2'),
    h3: makeHeadingRenderer('h3'),
    code({ inline, className, children, ...props }) {
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
            onClick={() => navigator.clipboard.writeText(code)}
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
    },
  };

  if (!topicConfig || error) {
    return (
      <div className={styles.container}>
        <Seo
          title="Topic page not found | ReactoDjango"
          description="The requested topic page could not be loaded."
          path={`/${topic || ''}`}
          noindex
        />
        <Link to="/" className={styles.back}>← Back to home</Link>
        <h1>{topicConfig?.label || 'Topic'} page</h1>
        <p>
          Create a published Django post with the slug <code>{topicConfig?.postSlug || topic}</code>.
          Its Markdown content will be displayed here, and headings written as <code>##</code> and
          <code>###</code> will automatically become navigation links on the left.
        </p>
      </div>
    );
  }

  if (!post) {
    return <p className={styles.loading}>Loading {topicConfig.label}...</p>;
  }

  return (
    <div className={styles.page}>
      <Seo
        title={post.seo_title || `${topicConfig.label} | ReactoDjango`}
        description={seoDescription}
        path={`/${topic}`}
      />

      {toc.length > 0 && (
        <aside className={styles.toc} aria-label={`${topicConfig.label} contents`}>
          <div className={styles.tocInner}>
            <Link to={`/${topic}`} className={styles.seriesLink}>{topicConfig.label}</Link>
            <div className={styles.tocDivider} />
            <span className={styles.tocLabel}>ON THIS PAGE</span>
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
        <Link to="/" className={styles.back}>← Back to home</Link>
        <article className={styles.article}>
          <div className={styles.articleMeta}>
            <span className={styles.category}>{topicConfig.label}</span>
          </div>

          <h1>{post.title}</h1>
          {seoDescription && <p className={styles.lead}>{seoDescription}</p>}

          <div className={styles.body}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>
    </div>
  );
}
