import { useState, useEffect } from "react";
import { CATEGORIES, PROJECTS } from "../constants";
import "./Portfolio.css";

export default function Portfolio() {
  const [activeCat, setActiveCat] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const [cardMouse, setCardMouse] = useState({});

  const filtered =
    activeCat === "All"
      ? PROJECTS
      : PROJECTS.filter((p) => p.cat === activeCat);

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedProject(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [selectedProject]);

  const handleCardMouseMove = (idx, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCardMouse((prev) => ({ ...prev, [idx]: { x, y } }));
  };

  return (
    <section id="portfolio" className="portfolio">
      <div className="portfolio__header reveal-fade">
        <span className="portfolio__pre-badge">FEATURED WORK</span>
        <h2 className="portfolio__title">Recent Projects</h2>
        <p className="portfolio__subtitle">
          Showcasing production-ready web platforms, cross-platform mobile apps, and full-stack solutions.
        </p>
      </div>

      {/* ── Filter tabs ── */}
      <div className="portfolio__filters reveal-fade stagger-1">
        {CATEGORIES.map((cat) => {
          const count =
            cat === "All"
              ? PROJECTS.length
              : PROJECTS.filter((p) => p.cat === cat).length;
          return (
            <button
              key={cat}
              className={`portfolio__filter-btn${activeCat === cat ? " portfolio__filter-btn--active" : ""}`}
              onClick={() => setActiveCat(cat)}
            >
              <span>{cat}</span>
              <span className="portfolio__filter-count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* ── Cards grid ── */}
      <div className="portfolio__grid">
        {filtered.map(({ name, cat, img, desc, link }, i) => {
          const coord = cardMouse[i] || { x: 100, y: 100 };
          return (
            <div
              key={name}
              className={`portfolio__card reveal-scale stagger-${(i % 3) + 1}`}
              onClick={() => setSelectedProject({ name, cat, img, desc, link })}
              onMouseMove={(e) => handleCardMouseMove(i, e)}
              style={{
                "--mouse-x": `${coord.x}px`,
                "--mouse-y": `${coord.y}px`,
              }}
            >
              <div className="portfolio__card-spotlight" />

              <img
                src={img}
                alt={name}
                className="portfolio__card-img"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />

              <div className="portfolio__card-badge-preview">
                <span>View Details</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </div>

              <div className="portfolio__overlay">
                <div className="portfolio__card-name">{name}</div>
                <div className="portfolio__card-cat">{cat}</div>
                <p className="portfolio__card-desc">{desc}</p>
                <div className="portfolio__card-cta">
                  <span>Explore Project →</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Interactive Project Details Modal ── */}
      {selectedProject && (
        <div
          className="portfolio__modal-backdrop"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="portfolio__modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="portfolio__modal-close"
              onClick={() => setSelectedProject(null)}
              aria-label="Close modal"
            >
              ✕
            </button>

            <div className="portfolio__modal-img-wrap">
              <img
                src={selectedProject.img}
                alt={selectedProject.name}
                className="portfolio__modal-img"
              />
            </div>

            <div className="portfolio__modal-body">
              <span className="portfolio__modal-cat">{selectedProject.cat}</span>
              <h3 className="portfolio__modal-title">{selectedProject.name}</h3>
              <p className="portfolio__modal-desc">{selectedProject.desc}</p>

              <div className="portfolio__modal-footer">
                <a
                  href={selectedProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="portfolio__modal-link"
                >
                  <span>Launch Live Project</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}