import { useState, useEffect, useRef } from "react";
import SocialIcon from "./SocialIcon.jsx";
import "./Hero.css";
import heroimg from "../assets/heroimg2.jpeg";

const STATS = [
  { num: "1+", label: "Experiences", bg: "#1a1a1a" },
  { num: "6+", label: "Project done", bg: "#171717" },
  { num: "6+", label: "Happy Clients", bg: "#141414" },
];

// Helper to draw image like background-size: cover on canvas
const drawImageProp = (ctx, img, x, y, w, h, offsetX = 0.5, offsetY = 0.5) => {
  const iw = img.width;
  const ih = img.height;
  const r = Math.min(w / iw, h / ih);
  let nw = iw * r;
  let nh = ih * r;
  let cx, cy, cw, ch;

  if (nw < w) nw = w;
  if (nh < h) nh = h;

  cw = iw / (nw / w);
  ch = ih / (nh / h);

  cx = (iw - cw) * offsetX;
  cy = (ih - ch) * offsetY;

  if (cx < 0) cx = 0;
  if (cy < 0) cy = 0;
  if (cw > iw) cw = iw;
  if (ch > ih) ch = ih;

  ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
};

// Dynamically discover all PNG frame assets in src/assets/frames/
const frameModules = import.meta.glob("../assets/frames/frame_*.png", { eager: true });
const frameUrls = Object.keys(frameModules)
  .sort()
  .map((key) => frameModules[key].default);

export default function Hero({ onNavClick }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const loadedImagesRef = useRef([]);
  const currentFrameRef = useRef(0);
  const [isPreloading, setIsPreloading] = useState(true);

  // Draw target frame index to canvas
  const drawFrame = (index, loadedImagesArray) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let img = loadedImagesArray[index];
    if (!img) {
      // Find the closest loaded frame to keep the display filled during progressive load
      let step = 1;
      while (!img && (index - step >= 0 || index + step < loadedImagesArray.length)) {
        if (index - step >= 0 && loadedImagesArray[index - step]) {
          img = loadedImagesArray[index - step];
          break;
        }
        if (index + step < loadedImagesArray.length && loadedImagesArray[index + step]) {
          img = loadedImagesArray[index + step];
          break;
        }
        step++;
      }
    }

    if (img) {
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
      drawImageProp(ctx, img, 0, 0, canvas.width, canvas.height);
    }
  };

  // Preload first frame immediately, then load remaining progressively
  useEffect(() => {
    const totalFrames = frameUrls.length;
    if (totalFrames === 0) return;

    const firstImg = new Image();
    firstImg.src = frameUrls[0];
    firstImg.onload = () => {
      loadedImagesRef.current[0] = firstImg;
      setIsPreloading(false);
      drawFrame(0, loadedImagesRef.current);
    };

    const loadRemaining = async () => {
      const chunkSize = 5;
      for (let i = 1; i < totalFrames; i += chunkSize) {
        const chunk = frameUrls.slice(i, i + chunkSize);
        await Promise.all(
          chunk.map((url, idx) => {
            const index = i + idx;
            return new Promise((resolve) => {
              const img = new Image();
              img.src = url;
              img.onload = () => {
                loadedImagesRef.current[index] = img;
                if (currentFrameRef.current === index) {
                  drawFrame(index, loadedImagesRef.current);
                }
                resolve();
              };
              img.onerror = () => {
                resolve();
              };
            });
          })
        );
      }
    };

    loadRemaining();
  }, []);

  // Listen to scrolling to animate frames and content opacity
  useEffect(() => {
    if (isPreloading) return;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const containerHeight = rect.height;
      const scrollY = -rect.top;
      const viewportHeight = window.innerHeight;
      const maxScroll = containerHeight - viewportHeight;

      if (maxScroll <= 0) return;

      const progress = Math.max(0, Math.min(1, scrollY / maxScroll));

      const totalFrames = frameUrls.length;
      const frameIndex = Math.floor(progress * (totalFrames - 1));
      currentFrameRef.current = frameIndex;

      drawFrame(frameIndex, loadedImagesRef.current);

      // Helper to calculate segment opacities for text layers
      const getLayerOpacities = (p) => {
        const opacities = [0, 0, 0, 0];
        // Layer 0: [0, 0.20]
        if (p < 0.15) opacities[0] = 1;
        else if (p < 0.20) opacities[0] = (0.20 - p) / 0.05;
        else opacities[0] = 0;

        // Layer 1: [0.20, 0.40]
        if (p >= 0.20 && p < 0.25) opacities[1] = (p - 0.20) / 0.05;
        else if (p >= 0.25 && p < 0.35) opacities[1] = 1;
        else if (p >= 0.35 && p < 0.40) opacities[1] = (0.40 - p) / 0.05;
        else opacities[1] = 0;

        // Layer 2: [0.40, 0.60]
        if (p >= 0.40 && p < 0.45) opacities[2] = (p - 0.40) / 0.05;
        else if (p >= 0.45 && p < 0.55) opacities[2] = 1;
        else if (p >= 0.55 && p < 0.60) opacities[2] = (0.60 - p) / 0.05;
        else opacities[2] = 0;

        // Layer 3: [0.60, 0.80+]
        if (p >= 0.60 && p < 0.65) opacities[3] = (p - 0.60) / 0.05;
        else if (p >= 0.65 && p < 0.80) opacities[3] = 1;
        else if (p >= 0.80 && p <= 1.0) opacities[3] = Math.max(0, (0.95 - p) / 0.15);
        else opacities[3] = 0;

        return opacities;
      };

      // Set individual opacities and translate offsets
      const opacities = getLayerOpacities(progress);
      const layers = container.querySelectorAll(".hero__text-layer");
      layers.forEach((layer, idx) => {
        if (opacities[idx] !== undefined) {
          const opacity = opacities[idx];
          layer.style.opacity = opacity;
          layer.style.transform = `translateY(${(1 - opacity) * 15}px)`;
          layer.style.pointerEvents = opacity === 0 ? "none" : "auto";
        }
      });

      // Smoothly fade out remaining static parts (socials, actions, stats, bgCircle) between 0.80 and 0.95
      const endOpacity = Math.max(0, Math.min(1, (0.95 - progress) / 0.15));
      const socials = container.querySelector(".hero__socials");
      const actions = container.querySelector(".hero__actions");
      const stats = container.querySelector(".hero__stats");
      const bgCircle = container.querySelector(".hero__bg-circle");

      [socials, actions, stats, bgCircle].forEach((el) => {
        if (el) {
          el.style.opacity = endOpacity;
          el.style.pointerEvents = endOpacity === 0 ? "none" : "auto";
        }
      });
    };

    const handleResize = () => {
      drawFrame(currentFrameRef.current, loadedImagesRef.current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    // Trigger initial calculation
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [isPreloading]);

  return (
    <section id="home" className="hero-scroll-container" ref={containerRef}>
      <div className="hero-sticky-wrapper">
        <canvas ref={canvasRef} className="hero-canvas" />
        <div className="hero-canvas-overlay" />

        {isPreloading && (
          <div className="hero-preloader" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg)',
            zIndex: 10,
            color: '#fff',
            fontFamily: 'var(--font-display)'
          }}>
            <div style={{
              border: '3px solid rgba(221, 26, 26, 0.1)',
              borderTop: '3px solid var(--orange)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              animation: 'spin 1s linear infinite'
            }} />
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        <div className="hero">
          {/* decorative bg circle */}
          <div className="hero__bg-circle" />

          {/* ── Left content ── */}
          <div className="hero__content">
            <div className="hero__text-slider">
              {/* Layer 0: Hi I am Vigneshwaran S Web & App Dev */}
              <div className="hero__text-layer">
                <p className="hero__greeting reveal-slide-left">Hi I am</p>
                <h2 className="hero__name reveal-slide-left stagger-1">VIGNESHWARAN S</h2>
                <h1 className="hero__title reveal-slide-left stagger-2">
                  WEB & APP<br />DEVELOPER
                </h1>
              </div>

              {/* Layer 1: Web Development */}
              <div className="hero__text-layer">
                <p className="hero__greeting reveal-slide-left">I specialize in</p>
                <h2 className="hero__name reveal-slide-left stagger-1">WEB</h2>
                <h1 className="hero__title reveal-slide-left stagger-2">DEV</h1>
              </div>

              {/* Layer 2: App Development */}
              <div className="hero__text-layer">
                <p className="hero__greeting reveal-slide-left">I excel in cross-platform</p>
                <h2 className="hero__name reveal-slide-left stagger-1">APP</h2>
                <h1 className="hero__title reveal-slide-left stagger-2">DEV</h1>
              </div>

              {/* Layer 3: Backend Development */}
              <div className="hero__text-layer">
                <p className="hero__greeting reveal-slide-left">I engineer scalable</p>
                <h2 className="hero__name reveal-slide-left stagger-1">BACKEND</h2>
                <h1 className="hero__title reveal-slide-left stagger-2">DEV</h1>
              </div>
            </div>

            <br />
            <br />

            <div className="hero__actions reveal-fade stagger-4" style={{ transition: 'opacity 0.15s ease-out' }}>
              <button
                className="hero__btn-primary"
                onClick={() => onNavClick("contact")}
              >
                Hire Me
              </button>
              <button className="hero__btn-outline">
                <a
                  href="/Vigneshwaran_S_Resume_ATS.docx"
                  download="Vigneshwaran_S_Resume_ATS.docx"
                  className="about__cv-btn_resume"
                >
                  Download CV
                </a>
              </button>
            </div>

            <div className="hero__stats reveal-fade stagger-5" style={{ transition: 'opacity 0.15s ease-out' }}>
              {STATS.map(({ num, label, bg }, idx) => (
                <div key={label} className={`hero__stat reveal-fade stagger-${idx + 1}`} style={{ background: bg }}>
                  <div className="hero__stat-num">{num}</div>
                  <div className="hero__stat-label">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}