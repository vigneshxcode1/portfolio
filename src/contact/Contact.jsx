import { useState } from "react";
import { SERVICES } from "../constants";
import "./Contact.css";

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  service: "",
  timeline: "",
  details: "",
};

export default function Contact() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.details) {
      setStatusMessage("⚠️ Please fill in Name, Phone, and Project Details.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("");

    setTimeout(() => {
      const message = `
Hello Vigneshwaran, I'm reaching out from your portfolio.

• Name: ${form.name}
• Email: ${form.email || "N/A"}
• Phone: ${form.phone}
• Service: ${form.service || "General Inquiry"}
• Timeline: ${form.timeline || "Flexible"}

• Project Details:
${form.details}
      `.trim();

      const phone = "917338821735";
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
      setIsSubmitting(false);
      setStatusMessage("✅ Opening WhatsApp with your message!");
    }, 600);
  };

  return (
    <section id="contact" className="contact">
      <div className="contact__header reveal-fade">
        <span className="contact__pre-badge">GET IN TOUCH</span>
        <h2 className="contact__title">Let's Build Something Great</h2>
        <p className="contact__subtitle">
          Have an idea, project, or open role? Send a message directly or connect via instant channels below.
        </p>
      </div>

      {/* Quick Connect Cards */}
      <div className="contact__quick-grid reveal-fade stagger-1">
        <a
          href="https://wa.me/917338821735"
          target="_blank"
          rel="noopener noreferrer"
          className="contact__quick-card"
        >
          <div className="contact__quick-icon">💬</div>
          <div>
            <div className="contact__quick-label">WhatsApp Direct</div>
            <div className="contact__quick-value">+91 7338821735</div>
          </div>
        </a>

        <a
          href="mailto:vvigneshwaran518@gmail.com"
          className="contact__quick-card"
        >
          <div className="contact__quick-icon">✉️</div>
          <div>
            <div className="contact__quick-label">Email Me</div>
            <div className="contact__quick-value">vvigneshwaran518@gmail.com</div>
          </div>
        </a>

        <a
          href="tel:+917338821735"
          className="contact__quick-card"
        >
          <div className="contact__quick-icon">📞</div>
          <div>
            <div className="contact__quick-label">Direct Phone</div>
            <div className="contact__quick-value">+91 7338821735</div>
          </div>
        </a>
      </div>

      {/* Main Interactive Form */}
      <form className="contact__form" onSubmit={handleSubmit}>
        {statusMessage && (
          <div className="contact__status-banner">{statusMessage}</div>
        )}

        {/* Row 1 – Name & Email */}
        <div className="contact__row reveal-slide-left stagger-2">
          <div className="contact__field-group">
            <input
              className="contact__input"
              placeholder="Your Name *"
              value={form.name}
              onChange={set("name")}
              required
            />
          </div>
          <div className="contact__field-group">
            <input
              className="contact__input"
              placeholder="Email Address"
              type="email"
              value={form.email}
              onChange={set("email")}
            />
          </div>
        </div>

        {/* Row 2 – Phone & Service */}
        <div className="contact__row reveal-slide-right stagger-3">
          <div className="contact__field-group">
            <input
              className="contact__input"
              placeholder="Phone Number *"
              value={form.phone}
              onChange={set("phone")}
              required
            />
          </div>
          <div className="contact__field-group">
            <select
              className={`contact__select${!form.service ? " contact__select--empty" : ""}`}
              value={form.service}
              onChange={set("service")}
            >
              <option value="">Service Of Interest</option>
              {SERVICES.map((s) => (
                <option key={s.title} value={s.title}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3 – Timeline & Details */}
        <div className="contact__row contact__row--last reveal-slide-left stagger-4">
          <div className="contact__field-group">
            <input
              className="contact__input"
              placeholder="Estimated Timeline (e.g. 2 weeks, 1 month)"
              value={form.timeline}
              onChange={set("timeline")}
            />
          </div>
          <div className="contact__field-group">
            <textarea
              className="contact__textarea"
              placeholder="Tell me about your project, goals, or requirements... *"
              value={form.details}
              onChange={set("details")}
              rows={4}
              required
            />
          </div>
        </div>

        <div className="contact__footer reveal-fade stagger-5">
          <button
            type="submit"
            className={`contact__submit${isSubmitting ? " contact__submit--loading" : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="contact__spinner" />
                <span>Connecting to WhatsApp...</span>
              </>
            ) : (
              <>
                <span>Send Message via WhatsApp</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}