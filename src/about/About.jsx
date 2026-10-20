import { useState, useRef } from "react";
import "./About.css";
import heroimg from "../assets/heroimg3.jpeg";
import SocialIcon from "../home/SocialIcon";

const TECH_SKILLS = [
  { name: "React.js / Next.js", pct: 95, category: "Frontend" },
  { name: "Flutter & Dart", pct: 90, category: "Mobile" },
  { name: "Node.js & NestJS", pct: 88, category: "Backend" },
  { name: "PostgreSQL & Prisma", pct: 86, category: "Database" },
  { name: "MongoDB & Express", pct: 85, category: "Database" },
  { name: "REST APIs & Architecture", pct: 92, category: "Backend" },
];

const HIGHLIGHTS = [
  { title: "B.Tech in IT", desc: "Solid CS Foundation" },
  { title: "Ex-Dev @ Zuntra", desc: "Production Experience" },
  { title: "Play Store", desc: "Live Mobile Apps" },
  { title: "Clean Architecture", desc: "Scalable Systems" },
];

export default function About() {
  const [activeTab, setActiveTab] = useState("all");
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });
  const [isCardHovered, setIsCardHovered] = useState(false);
  const cardRef = useRef(null);

  const handleCardMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    setCardTilt({ x: rotateX, y: rotateY });
  };

  return (
    <section id="about" className="about">
      <div className="about__header reveal-fade">
        <span className="about__pre-badge">GET TO KNOW ME</span>
        <h2 className="about__title">About Me</h2>
        <p className="about__subtitle">
          Building scalable web and mobile applications with MERN, NestJS, PostgreSQL, and Flutter
        </p>
      </div>

      <div className="about__body">
        {/* ── Profile card with 3D Tilt ── */}
        <div
          ref={cardRef}
          className="about__profile-card reveal-slide-left"
          onMouseMove={handleCardMouseMove}
          onMouseEnter={() => setIsCardHovered(true)}
          onMouseLeave={() => {
            setIsCardHovered(false);
            setCardTilt({ x: 0, y: 0 });
          }}
          style={{
            transform: isCardHovered
              ? `perspective(1000px) rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg) scale3d(1.02, 1.02, 1.02)`
              : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
            transition: isCardHovered ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
          }}
        >
          <img src={heroimg} alt="Vigneshwaran S" className="about__profile-img" />
          
          <div className="about__card-badge">
            <span className="about__card-badge-dot" />
            <span>Full Stack & Flutter</span>
          </div>
        </div>

        {/* ── Bio & Highlights ── */}
        <div className="reveal-slide-right stagger-1">
          <p className="about__bio">
            I am a <strong>Full Stack Web Developer</strong> and <strong>Flutter Mobile App Developer</strong> with hands-on experience building scalable, production-ready applications.
            <br /><br />
            With a B.Tech in Information Technology and industry experience as a Developer at <strong>Zuntra</strong>, I specialize in end-to-end software development using React.js, NestJS, PostgreSQL, Prisma ORM, and Flutter for cross-platform Android & iOS deployments.
          </p>

          {/* Quick Highlight Cards */}
          <div className="about__highlights">
            {HIGHLIGHTS.map(({ title, desc }) => (
              <div key={title} className="about__highlight-card">
                <div className="about__highlight-title">{title}</div>
                <div className="about__highlight-desc">{desc}</div>
              </div>
            ))}
          </div>

          <div className="about__actions">
            <a
              href="/Vigneshwaran_S_Resume_ATS.docx"
              download="Vigneshwaran_S_Resume_ATS.docx"
              className="about__cv-btn"
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1v9M4 7l4 4 4-4M2 14h12"
                  stroke="#fff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Download Resume</span>
            </a>

            {/* Social Links */}
            <div className="hero__socials" style={{ margin: 0 }}>
              {["in", "Be", "Dr", "Ig"].map((s, idx) => (
                <div key={s} className={`reveal-fade stagger-${idx + 1}`}>
                  <SocialIcon label={s} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Interactive Skill Progress Meters ── */}
      <div className="about__skills-section reveal-fade">
        <h3 className="about__skills-title">Core Technical Competencies</h3>
        
        <div className="about__skills-grid">
          {TECH_SKILLS.map(({ name, pct, category }) => (
            <div key={name} className="about__skill-item">
              <div className="about__skill-header">
                <span className="about__skill-name">{name}</span>
                <span className="about__skill-pct">{pct}%</span>
              </div>
              <div className="about__skill-track">
                <div
                  className="about__skill-fill"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}