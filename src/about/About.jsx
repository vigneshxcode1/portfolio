import { SKILLS, ORANGE } from "../constants";
// import CircleSkill from "./CircleSkill.css";
import "./About.css";
import heroimg from "../assets/heroimg3.jpeg"
import SocialIcon from "../home/SocialIcon";

export default function About() {
  return (
    <section id="about" className="about">
      <div className="about__header reveal-fade">
        <h2 className="about__title">About Me</h2>
        <p className="about__subtitle">
          Building scalable web and mobile applications with MERN, NestJS, PostgreSQL, and Flutter
        </p>
      </div>

      <div className="about__body">
        {/* ── Profile graphic ── */}
        <div className="about__profile-card reveal-slide-left">

          <img src={heroimg} alt="Vigneshwaran S" className="about__profile-img" />

        </div>

        {/* ── Bio ── */}
        <div className="reveal-slide-right stagger-1">
          <p className="about__bio">
            'im a  web Developer and Flutter App Developer with hands-on experience building scalable web and mobile applications. I completed my B.Tech in Information Technology and gained industry experience as a  Developer  at Zuntra, contributing to end-to-end application development using React.js, Node.js, Express.js, MongoDB, NestJS, PostgreSQL, Prisma ORM, and Flutter.

            I specialize in developing responsive web applications, designing secure REST APIs, and building production-ready backend systems. My experience includes developing a client-freelancer platform, a rental property application, and a cross-platform dating application. I have experience building, testing, and deploying Flutter applications for both the Google Play Store and the Apple App Store, ensuring high performance and a consistent user experience across Android and iOS. (Your resume mentions Google Play Store deployments; if you have also deployed to the Apple App Store, it's appropriate to include that.)

            I focus on writing clean, maintainable code, building scalable system architectures, and delivering reliable digital solutions. Passionate about continuous learning and solving real-world problems, I enjoy transforming ideas into high-quality products using modern technologies and best development practices.
          </p>


          <div className="hero__socials reveal-fade stagger-3" style={{ display: 'flex', gap: '12px', transition: 'opacity 0.15s ease-out' }}>
            {["in", "Be", "Dr", "Ig"].map((s, idx) => (
              <div key={s} className={`reveal-fade stagger-${idx + 1}`}>
                <SocialIcon label={s} />
              </div>
            ))}
          </div>

          <button className="about__cv-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 1v9M4 7l4 4 4-4M2 14h12"
                stroke="#fff"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>


            <a
              href="/Vigneshwaran_S_Resume_ATS.docx"
              download="Vigneshwaran_S_Resume_ATS.docx"
              className="about__cv-btn_resume"
            >
              Download Resume
            </a>
          </button>
        </div>
      </div>

      {/* ── Skill circles ── */}
      <div className="about__skills">
        {/* {SKILLS.map((s) => (
          <CircleSkill key={s.name} {...s} />
        ))} */}
      </div>
    </section>
  );
}