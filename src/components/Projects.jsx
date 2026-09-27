import { useEffect, useState } from "react";
import SectionTitle from "./SectionTitle";
import { getProjects } from "../services/portfolioService";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    getProjects()
      .then((data) => setProjects(data))
      .catch(() => {});
  }, []);

  /* Lock scroll when modal opens */
  useEffect(() => {
    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [active]);

  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        <SectionTitle
          number="05"
          title="Projects"
          subtitle="Selected design work"
        />

        <div className="projects-grid">
          {projects.map((p, i) => (
            <article
              className="project-card"
              key={p.id || i}
            >
              <div className="project-number">0{i + 1}</div>

              <div className="project-top">
                <span className="project-category">{p.category}</span>
              </div>

              {p.image && (
                <div
                  className="project-image"
                  onClick={() => setActive(p)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setActive(p)}
                >
                  <img src={p.image} alt={p.title} />
                  <div className="project-image-overlay">
                    <span>VIEW DESIGN →</span>
                  </div>
                </div>
              )}

              <h3>{p.title}</h3>
              <p>{p.description}</p>

              {Array.isArray(p.tools) && p.tools.length > 0 && (
                <div className="project-tech">
                  {p.tools.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              )}

              <div className="project-actions">
                <button
                  className="project-btn project-btn-view"
                  onClick={() => setActive(p)}
                >
                  VIEW DETAILS →
                </button>

                {p.pdfUrl && (
                  <a
                    href={p.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="project-btn project-btn-pdf"
                  >
                    VIEW PDF ↗
                  </a>
                )}
              </div>
            </article>
          ))}

          {projects.length === 0 && (
            <p style={{ color: "var(--text-muted)" }}>
              No projects added yet.
            </p>
          )}
        </div>
      </div>

      {/* ── PROJECT MODAL ── */}
      {active && (
        <div className="modal-backdrop" onClick={() => setActive(null)}>
          <div
            className="modal project-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setActive(null)}>
              ×
            </button>

            <div className="project-modal-header">
              <span className="project-modal-num">PROJECT</span>
              <h3>{active.title}</h3>
              <p className="project-modal-cat">{active.category}</p>
            </div>

            {active.image && (
              <div className="project-modal-image">
                <img src={active.image} alt={active.title} />
              </div>
            )}

            <p className="project-modal-desc">{active.description}</p>

            {Array.isArray(active.tools) && active.tools.length > 0 && (
              <div className="project-tech project-modal-tech">
                {active.tools.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            )}

            <div className="project-modal-links">
              {active.pdfUrl && (
                <a
                  href={active.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  VIEW PDF ↗
                </a>
              )}
              {active.github && (
                <a
                  href={active.github}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline"
                >
                  GITHUB
                </a>
              )}
              {active.live && (
                <a
                  href={active.live}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline"
                >
                  VIEW LIVE
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Projects;