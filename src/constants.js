export const ORANGE = "#b83567";
export const BG = "#0e0e0e";
export const CARD = "#161616";
export const CARD2 = "#1a1a1a";
export const BORDER = "#252525";

import img1 from "../src/assets/huzzlerbanner.jpeg"
import img2 from "../src/assets/muthupetal.png"
import img3 from "../src/assets/zculture.jpeg"
import imgDatingApp from "../src/assets/black-portfolio.png"
import imgBooking from "../src/assets/mountain.png"

export const NAV_LINKS = [
  { label: "Home", id: "home" },
  { label: "Services", id: "services" },
  { label: "About me", id: "about" },
  { label: "Portfolio", id: "portfolio" },
  { label: "Contact me", id: "contact" },
];

export const SERVICES = [
  {
    title: "Full Stack Web Development",
    desc: "Building scalable and high-performance web applications using MERN stack with clean architecture and modern UI.",
  },
  {
    title: "Backend Development (NestJS)",
    desc: "Designing secure, scalable APIs and backend systems using NestJS with proper architecture and best practices.",
  },
  {
    title: "Database Design (PostgreSQL)",
    desc: "Structuring efficient and optimized relational databases with PostgreSQL for performance and reliability.",
  },
  {
    title: "Flutter App Development",
    desc: "Developing cross-platform mobile applications with smooth performance and consistent UI across Android and iOS.",
  },
  {
    title: "API Integration",
    desc: "Integrating third-party APIs, authentication systems, and real-time features into web and mobile applications.",
  },
  {
    title: "UI Implementation",
    desc: "Converting modern UI/UX designs into responsive, pixel-perfect frontend applications using React.",
  },
];
export const SKILLS = [
  { name: "Figma", pct: 100 },
  { name: "Adobe XD", pct: 100 },
  { name: "Adobe Photoshop", pct: 85 },
  { name: "Adobe Illustrator", pct: 60 },
  { name: "Adobe Premiere", pct: 70 },
];

export const CATEGORIES = ["All", "Website Design", "Website Design & Mobile app", "App Mobile Design", "flutter app", "Branding"];
export const PROJECTS = [
  {
    name: "Huzzler",
    cat: "Website Design & Mobile app",
    img: img1,
    desc: "Huzzler is the smarter freelance marketplace built for the gig economy generation, connecting remote professionals with top business talent.",
    link: "https://play.google.com/store/apps/details?id=com.huzzler.app",
  },
  {
    name: "Wiviy",
    cat: "App Mobile Design",
    img: imgDatingApp,
    desc: "Wiviy is a modern dating platform designed for meaningful relationships, genuine conversations, and real emotional connections.",
    link: "https://play.google.com/store/apps/details?id=com.with.app",
  },

  {
    name: "Rentit",
    cat: "flutter app",
    img: imgBooking,
    desc: "A complete property discovery experience. Finding flats, apartments, PGs, roommates, and commercial properties made simple and transparent.",
    link: "https://play.google.com/store/apps/details?id=com.zuntra.rentit",
  },
  {
    name: "Muthu's petals",
    cat: "Mern stack",
    img: img2,
    desc: "Muthu's Petals is a modern e-commerce platform for custom floral arrangements, flowers, and bouquets.",
    link: "https://share.google/VAG8WG4d6mlRcdg5q",
  },

  {
    name: "Zculter",
    cat: "Website Design",
    img: img3,
    desc: "A music streaming desktop application with modern interactive UX and sleek UI design.",
    link: "https://share.google/gWD1ZF2KsMsnIE84p",
  },
];