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

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = () => {
    // Basic validation
    if (!form.name || !form.phone || !form.details) {
      alert("Please fill Name, Phone, and Project Details");
      return;
    }

    const message = `
Hello, I'm interested in your services.

Name: ${form.name}
Email: ${form.email}
Phone: ${form.phone}
Service: ${form.service}
Timeline: ${form.timeline}

Project Details:
${form.details}
  `;

    const phone = "917338821735"; // India country code

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  };

  return (
    <section id="contact" className="contact">
      <div className="contact__header reveal-fade">
        <h2 className="contact__title">Contact me</h2>
        <p className="contact__subtitle">
          Cultivating Connections: Reach Out And Connect With Me
        </p>
      </div>

      <div className="contact__form">
        {/* Row 1 – Name & Email */}
        <div className="contact__row reveal-slide-left stagger-1">
          <input
            className="contact__input"
            placeholder="Name"
            value={form.name}
            onChange={set("name")}
          />
          <input
            className="contact__input"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={set("email")}
          />
        </div>

        {/* Row 2 – Phone & Service */}
        <div className="contact__row reveal-slide-right stagger-2">
          <input
            className="contact__input"
            placeholder="Phone Number"
            value={form.phone}
            onChange={set("phone")}
          />
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

        {/* Row 3 – Timeline & Details */}
        <div className="contact__row contact__row--last reveal-slide-left stagger-3">
          <input
            className="contact__input"
            placeholder="Timeline"
            value={form.timeline}
            onChange={set("timeline")}
          />
          <textarea
            className="contact__textarea"
            placeholder="Project Details..."
            value={form.details}
            onChange={set("details")}
            rows={4}
          />
        </div>

        <div className="contact__footer reveal-fade stagger-4">
          <button className="contact__submit" onClick={handleSubmit}>
            Send
          </button>
        </div>
      </div>
    </section>
  );
}