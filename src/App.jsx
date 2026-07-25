import { useState, useEffect } from "react";
import "./styles/global.css";

import Navbar    from "./Navbar/Navbar";
import Hero      from "./home/Home";
import Services  from "./service/Services";
import About     from "./about/About";
import Portfolio from "./portfolio/Portfolio";
import Contact   from "./contact/Contact";
import Footer    from "./footer/Footer";

export default function App() {
  const [activeNav, setActiveNav] = useState("home");

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveNav(id);
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -50px 0px", // Trigger when element is slightly above the bottom of viewport
      threshold: 0.05,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    }, observerOptions);

    // Observe all static elements that want scroll reveal
    const revealElements = document.querySelectorAll(
      ".reveal-fade, .reveal-slide-left, .reveal-slide-right, .reveal-scale"
    );
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar activeNav={activeNav} onNavClick={scrollTo} />
      <Hero      onNavClick={scrollTo} />
      <Services  />
      <About     />
      <Portfolio />
      <Contact   />
      <Footer    onNavClick={scrollTo} />
    </>
  );
}