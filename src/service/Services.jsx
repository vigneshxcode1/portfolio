import { useState } from "react";
import { SERVICES } from "../constants";
import "./Services.css";

// Distinct customized icons for each specific service domain
const ICONS = {
  0: ( // Full Stack Web
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
      <polyline points="2 17 12 22 22 17"></polyline>
      <polyline points="2 12 12 17 22 12"></polyline>
    </svg>
  ),
  1: ( // Backend NestJS
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
      <line x1="6" y1="6" x2="6.01" y2="6"></line>
      <line x1="6" y1="18" x2="6.01" y2="18"></line>
    </svg>
  ),
  2: ( // PostgreSQL Database
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
    </svg>
  ),
  3: ( // Flutter App Dev
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
      <line x1="12" y1="18" x2="12.01" y2="18"></line>
    </svg>
  ),
  4: ( // API Integration
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="18" r="3"></circle>
      <circle cx="6" cy="6" r="3"></circle>
      <path d="M13 6h3a2 2 0 0 1 2 2v7"></path>
      <line x1="6" y1="9" x2="6" y2="21"></line>
    </svg>
  ),
  5: ( // UI Implementation
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  ),
};

const SERVICE_TAGS = [
  ["React.js", "Node.js", "Express", "MongoDB"],
  ["NestJS", "TypeScript", "REST APIs", "Microservices"],
  ["PostgreSQL", "Prisma ORM", "Query Tuning", "Schema Design"],
  ["Flutter", "Dart", "Android", "iOS"],
  ["Third-party APIs", "Auth0/JWT", "Payment Gateways", "WebSockets"],
  ["Figma to Code", "Responsive UI", "CSS Animations", "Cross-Browser"],
];

export default function Services() {
  const [mouseCoord, setMouseCoord] = useState({});

  const handleCardMouseMove = (idx, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMouseCoord((prev) => ({ ...prev, [idx]: { x, y } }));
  };

  return (
    <section id="services" className="services">
      <div className="services__header reveal-fade">
        <span className="services__pre-badge">WHAT I OFFER</span>
        <h2 className="services__title">Specialized Services</h2>
        <p className="services__subtitle">
          Engineering scalable web architectures and fluid cross-platform mobile apps with modern engineering standards.
        </p>
      </div>

      <div className="services__grid">
        {SERVICES.map(({ title, desc }, idx) => {
          const coord = mouseCoord[idx] || { x: 100, y: 100 };
          return (
            <div
              key={title}
              className={`services__card reveal-fade stagger-${(idx % 3) + 1}`}
              onMouseMove={(e) => handleCardMouseMove(idx, e)}
              style={{
                "--mouse-x": `${coord.x}px`,
                "--mouse-y": `${coord.y}px`,
              }}
            >
              <div className="services__card-spotlight" />

              <div className="services__card-icon-wrap">
                {ICONS[idx] || ICONS[0]}
              </div>

              <h3 className="services__card-title">{title}</h3>
              <p className="services__card-desc">{desc}</p>

              {/* Technology Tags */}
              <div className="services__tags">
                {SERVICE_TAGS[idx]?.map((tag) => (
                  <span key={tag} className="services__tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}