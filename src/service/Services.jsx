import { SERVICES, ORANGE } from "../constants";
import "./Services.css";

function ServiceIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <circle cx="20" cy="18" r="8" stroke={ORANGE} strokeWidth="2.5" />
      <path
        d="M6 44c0-9 6.5-15 14-15s14 6 14 15"
        stroke={ORANGE}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="36" cy="16" r="5.5" stroke={ORANGE} strokeWidth="2" />
      <path
        d="M30 44c0-6.5 4-12 9-13.5"
        stroke={ORANGE}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Services() {
  return (
    <section id="services" className="services">
      <div className="services__header reveal-fade">
        <h2 className="services__title">Services</h2>
        <p className="services__subtitle">
          Scalable web and mobile solutions with modern design and clean architecture
        </p>
      </div>

      <div className="services__grid">
        {SERVICES.map(({ title, desc }, idx) => (
          <div key={title} className={`services__card reveal-fade stagger-${(idx % 3) + 1}`}>
            <div className="services__card-icon">
              <ServiceIcon />
            </div>
            <h3 className="services__card-title">{title}</h3>
            <p className="services__card-desc">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}