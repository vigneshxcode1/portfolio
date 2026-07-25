import { NAV_LINKS } from "../constants";
import SocialIcon from "../icons/SocialIcon";
import "./Footer.css";

export default function Footer({ onNavClick }) {
  return (
    <footer className="footer">
      <span className="footer__logo">vignesh portfolio</span>

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
        <a href="mailto:vvigneshwaran518@gmail.com">
          ✉ vvigneshwaran518@gmail.com
        </a>
        <a href="tel:+917338821735">📞 +91 7338821735</a>
      </div>

    
    </footer>
  );
}