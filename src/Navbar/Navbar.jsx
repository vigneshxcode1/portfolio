import { useState, useEffect } from "react";
import { NAV_LINKS } from "../constants";
import "../Navbar/Navbar.css";

export default function Navbar({ activeNav, onNavClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (id) => {
    onNavClick(id);
    setMenuOpen(false); // close mobile menu on click
  };

  return (
    <nav className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
      <div className="navbar__logo" onClick={() => handleNavClick("home")}>
        <span className="navbar__logo-text">vignesh</span>
        <span className="navbar__logo-dot">.dev</span>
      </div>

      {/* ── Desktop Links ── */}
      <div className={`navbar__links ${menuOpen ? "active" : ""}`}>
        {NAV_LINKS.map(({ label, id }) => (
          <button
            key={id}
            className={`navbar__link${
              activeNav === id ? " navbar__link--active" : ""
            }`}
            onClick={() => handleNavClick(id)}
          >
            {label}
            {activeNav === id && <span className="navbar__link-indicator" />}
          </button>
        ))}
      </div>

      {/* ── CTA ── */}
      <button
        className="navbar__cta"
        onClick={() => handleNavClick("contact")}
      >
        <span>Hire Me</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>

      {/* ── Hamburger ── */}
      <div
        className={`navbar__hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
      >
        <span />
        <span />
        <span />
      </div>
    </nav>
  );
}