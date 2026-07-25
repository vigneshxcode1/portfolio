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
    setMenuOpen(false); // close menu on click
  };

  return (
    <nav className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
      <span className="navbar__logo">portfolio</span>

      {/* ── Links ── */}
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
          </button>
        ))}
      </div>

      {/* ── CTA ── */}
      <button
        className="navbar__cta"
        onClick={() => handleNavClick("contact")}
      >
        Hire Me
      </button>

      {/* ── Hamburger ── */}
      <div
        className={`navbar__hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span />
        <span />
        <span />
      </div>
    </nav>
  );
}