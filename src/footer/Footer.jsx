import { NAV_LINKS } from "../constants";
import SocialIcon from "../icons/SocialIcon";
import "./Footer.css";

export default function Footer({ onNavClick }) {
  return (
    <footer className="footer">
      <div className="footer__logo" onClick={() => onNavClick("home")}>
        <span>vignesh</span>
        <span className="footer__logo-dot">.dev</span>
      </div>

      {/* Nav links */}
      <nav className="footer__nav">
        {NAV_LINKS.map(({ label, id }) => (
          <button
            key={id}
            className="footer__nav-link"
            onClick={() => onNavClick(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Social icons */}
      <div className="footer__socials">
        {["Ig", "in", "Dr", "Be"].map((s) => (
          <SocialIcon key={s} label={s} />
        ))}
      </div>

      {/* Contact info */}
      <div className="footer__contact-info">
        <a href="mailto:vvigneshwaran518@gmail.com" className="footer__contact-link">
          <span>✉ vvigneshwaran518@gmail.com</span>
        </a>
        <a href="tel:+917338821735" className="footer__contact-link">
          <span>📞 +91 7338821735</span>
        </a>
      </div>

      {/* Copyright */}
      <div className="footer__copyright">
        © {new Date().getFullYear()} Vigneshwaran S. Crafted with modern web & mobile technologies.
      </div>
    </footer>
  );
}