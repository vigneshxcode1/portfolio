import { useState, useEffect, useRef } from "react";
import "./Hero.css";
import heroImg from "../assets/hero.jpeg";

const ROLES = [
  "WEB & APP DEVELOPER",
  "FULL STACK ENGINEER",
  "FLUTTER MOBILE DEV",
  "NESTJS BACKEND SPECIALIST",
];

const STATS = [
  { num: "1+", label: "Years Experience", bg: "rgba(255, 255, 255, 0.03)" },
  { num: "6+", label: "Projects Completed", bg: "rgba(255, 255, 255, 0.03)" },
  { num: "100%", label: "Client Satisfaction", bg: "rgba(255, 255, 255, 0.03)" },
];

export default function Hero({ onNavClick }) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  // 3D Tilt calculation state
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const profileRef = useRef(null);

  // Smooth Typewriter effect for roles
  useEffect(() => {
    const currentRole = ROLES[roleIndex];
    let timer;

    if (!isDeleting && displayedText === currentRole) {
      timer = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && displayedText === "") {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
      setTypingSpeed(100);
    } else {
      timer = setTimeout(() => {
        const nextText = isDeleting
          ? currentRole.substring(0, displayedText.length - 1)
          : currentRole.substring(0, displayedText.length + 1);
        setDisplayedText(nextText);
        setTypingSpeed(isDeleting ? 45 : 85);
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, roleIndex, typingSpeed]);

  // Interactive 3D Card Tilt
  const handleMouseMove = (e) => {
    if (!profileRef.current) return;
    const rect = profileRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -14;
    const rotateY = ((x - centerX) / centerX) * 14;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section id="home" className="hero">
      {/* ── Left content ── */}
      <div className="hero__content">
        {/* Availability Status Badge */}


        <div className="hero__intro">
          <p className="hero__greeting reveal-slide-left">Hi I am</p>
          <h2 className="hero__name reveal-slide-left stagger-1">VIGNESHWARAN S</h2>

          <h1 className="hero__title reveal-slide-left stagger-2">
            <span className="hero__title-line">I AM A</span>
            <span className="hero__role-animated">
              {displayedText}
              <span className="hero__cursor">|</span>
            </span>
          </h1>
        </div>

        <p className="hero__bio-lead reveal-fade stagger-3">
          Transforming concepts into high-performance web applications and fluid cross-platform mobile experiences with clean, modern architecture.
        </p>

        <div className="hero__actions reveal-fade stagger-4">
          <button
            className="hero__btn-primary"
            onClick={() => onNavClick("contact")}
          >
            <span>Hire Me</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
          <a
            href="/Vigneshwaran_S_Resume_ATS.docx"
            download="Vigneshwaran_S_Resume_ATS.docx"
            className="hero__btn-outline"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>Download CV</span>
          </a>
        </div>

        <div className="hero__stats reveal-fade stagger-5">
          {STATS.map(({ num, label, bg }, idx) => (
            <div key={label} className={`hero__stat reveal-fade stagger-${idx + 1}`} style={{ background: bg }}>
              <div className="hero__stat-num">{num}</div>
              <div className="hero__stat-label">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right profile static image with 3D Tilt & Floating Badges ── */}
      <div className="hero__profile-wrapper reveal-slide-right stagger-2">
        <div className="hero__bg-circle" />

        {/* Floating Interactive Badges */}
        <div className="hero__floating-badge hero__floating-badge--1">

          <div>
            <div className="hero__badge-title">Full Stack</div>
            <div className="hero__badge-sub">MERN & NestJS</div>
          </div>
        </div>

        <div className="hero__floating-badge hero__floating-badge--2">

          <div>
            <div className="hero__badge-title">Flutter App</div>
            <div className="hero__badge-sub">iOS & Android</div>
          </div>
        </div>

        <div className="hero__floating-badge hero__floating-badge--3">

          <div>
            <div className="hero__badge-title">Databases</div>
            <div className="hero__badge-sub">PostgreSQL & Prisma</div>
          </div>
        </div>

        {/* 3D Tilt Container */}
        <div
          ref={profileRef}
          className="hero__profile"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: isHovered
              ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.03, 1.03, 1.03)`
              : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
            transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
          }}
        >
          <img src={heroImg} alt="Vigneshwaran S" className="hero__profile-img" />
          <div className="hero__profile-glare" />
        </div>
      </div>
    </section>
  );
}