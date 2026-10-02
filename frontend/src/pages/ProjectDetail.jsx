import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import api from '../api';
import Seo from '../components/Seo';
import styles from './PostDetail.module.css';
import projectStyles from './ProjectDetail.module.css';

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

    items.push({ level, title, id: count ? `${base}-${count + 1}` : base });
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

    return <Tag id={id} className={styles.anchorHeading} {...props}>{children}</Tag>;
  };
};

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setProject(null);
    setError(false);
    api.get(`projects/${slug}/`)
      .then((response) => setProject(response.data))
      .catch(() => setError(true));
  }, [slug]);

  const toc = useMemo(() => buildToc(project?.content || ''), [project?.content]);

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
          <SyntaxHighlighter style={materialLight} language={match ? match[1] : null} PreTag="div" {...props}>
            {code}
          </SyntaxHighlighter>
        </div>
      );
    },
  };

  if (error) {
    return (
      <div className={styles.container}>
        <Seo title="Project not found | ReactoDjango" description="The requested project could not be found." path={`/projects/${slug}`} noindex />
        <Link to="/projects" className={styles.back}>← Back to projects</Link>
        <h1>Project not found</h1>
      </div>
    );
  }

  if (!project) return <p className={styles.loading}>Loading project...</p>;

  return (
    <div className={styles.page}>
      <Seo
        title={`${project.title} | ReactoDjango`}
        description={project.short_description}
        path={`/projects/${project.slug}`}
      />

      {toc.length > 0 && (
        <aside className={styles.toc} aria-label="Project contents">
          <div className={styles.tocInner}>
            <Link to="/projects" className={styles.seriesLink}>My Projects</Link>
            <div className={styles.tocDivider} />
            <span className={styles.tocLabel}>ON THIS PAGE</span>
            <nav className={styles.tocNav}>
              {toc.map((item) => (
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
        <Link to="/projects" className={styles.back}>← Back to projects</Link>

        <article className={styles.article}>
          {project.image_url && (
            <img className={projectStyles.heroImage} src={project.image_url} alt="" />
          )}

          <div className={styles.articleMeta}>
            <span className={styles.category}>Project</span>
            {project.is_featured && <span className={projectStyles.featured}>Featured</span>}
          </div>

          <h1>{project.title}</h1>
          <p className={styles.lead}>{project.short_description}</p>

          {project.technology_list?.length > 0 && (
            <div className={projectStyles.techList}>
              {project.technology_list.map((tech) => <span key={tech}>{tech}</span>)}
            </div>
          )}

          {(project.live_url || project.github_url) && (
            <div className={projectStyles.actions}>
              {project.live_url && (
                <a href={project.live_url} target="_blank" rel="noreferrer" className={projectStyles.primaryAction}>
                  Open live project ↗
                </a>
              )}
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noreferrer" className={projectStyles.secondaryAction}>
                  View GitHub ↗
                </a>
              )}
            </div>
          )}

          {project.content && (
            <div className={styles.body}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {project.content}
              </ReactMarkdown>
            </div>
          )}
        </article>
      </main>
    </div>
  );
}
