import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Seo from '../components/Seo';
import styles from './Projects.module.css';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get('projects/')
      .then((response) => setProjects(response.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className={styles.page}>
      <Seo
        title="My Projects | ReactoDjango"
        description="Selected React, Django and Django REST Framework projects built and documented on ReactoDjango."
        path="/projects"
      />

      <div className={styles.intro}>
        <span className={styles.kicker}>PORTFOLIO</span>
        <h1>My Projects</h1>
        <p>
          A collection of practical projects built with React, Django, Django REST Framework
          and related technologies.
        </p>
      </div>

      {loading && <p className={styles.status}>Loading projects...</p>}
      {error && <p className={styles.status}>Projects could not be loaded.</p>}

      {!loading && !error && projects.length === 0 && (
        <div className={styles.empty}>
          <h2>No projects yet</h2>
          <p>Add your first published project in Django Admin.</p>
        </div>
      )}

      <div className={styles.grid}>
        {projects.map((project) => (
          <article key={project.id} className={styles.card}>
            {project.image_url && (
              <img className={styles.image} src={project.image_url} alt="" loading="lazy" />
            )}

            <div className={styles.cardBody}>
              {project.is_featured && <span className={styles.featured}>Featured</span>}
              <h2>{project.title}</h2>
              <p>{project.short_description}</p>

              {project.technology_list?.length > 0 && (
                <div className={styles.techList}>
                  {project.technology_list.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
              )}

              <div className={styles.actions}>
                <Link className={styles.primaryLink} to={`/projects/${project.slug}`}>
                  View project <span aria-hidden="true">→</span>
                </Link>

                {project.live_url && (
                  <a href={project.live_url} target="_blank" rel="noreferrer" className={styles.secondaryLink}>
                    Live
                  </a>
                )}

                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noreferrer" className={styles.secondaryLink}>
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
