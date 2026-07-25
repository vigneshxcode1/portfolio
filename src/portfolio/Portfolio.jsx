import { useState, useEffect } from "react";
import { CATEGORIES, PROJECTS } from "../constants";
import MiniUI from "./MiniUI.jsx";
import "./Portfolio.css";

export default function Portfolio() {
  const [activeCat, setActiveCat] = useState("All");

  const filtered =
    activeCat === "All"
      ? PROJECTS
      : PROJECTS.filter((p) => p.cat === activeCat);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    }, { 
      root: null,
      rootMargin: "0px 0px -30px 0px",
      threshold: 0.05 
    });

    const cards = document.querySelectorAll(".portfolio__card");
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [activeCat]);

  return (
    <section id="portfolio" className="portfolio">
      <div className="portfolio__header reveal-fade">
        <h2 className="portfolio__title">Portfolio</h2>
      </div>

      {/* ── Filter tabs ── */}
      <div className="portfolio__filters reveal-fade stagger-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`portfolio__filter-btn${activeCat === cat ? " portfolio__filter-btn--active" : ""}`}
            onClick={() => setActiveCat(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Cards grid ── */}
      <div className="portfolio__grid">
        {filtered.map(({ name, cat, img, desc, link }, i) => (
          <div key={name} className={`portfolio__card reveal-scale stagger-${(i % 3) + 1}`}>

            <img
              src={img}
              alt={name}
              className="portfolio__card-img"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />

            <div className="portfolio__overlay">
              <div className="portfolio__card-name">{name}</div>
              <div className="portfolio__card-cat">{cat}</div>

              {/* NEW */}
              <p className="portfolio__card-desc">{desc}</p>

              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="portfolio__card-link"
              >
                View Project →
              </a>
            </div>
          </div>
        ))}
      </div>


    </section>
  );
}