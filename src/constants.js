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
import imgZuntra from "./assets/zuntra.png"
import imgZuca from "./assets/zuca.png"
import imgWorkzi from "./assets/workzi_full.png"
import imgHuzzler from "./assets/huzzler.png"
import imgRentit from "./assets/rentit.png"

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

export const CATEGORIES = [
  "All",
  "Web Application",
  "SaaS & AI Platforms",
  "Mobile Apps",
  "UI/UX & Design",
];

export const PROJECTS = [
  {
    name: "Workzi",
    cat: ["Web Application", "SaaS & AI Platforms"],
    img: imgWorkzi,
    desc: "AI-powered workforce management platform simplifying employee attendance tracking, shift scheduling, task workflows, and HR operations into one unified suite.",
    tags: ["React", "AI Platform", "SaaS", "HR Tech"],
    link: "https://www.workzi.app/",
  },
  {
    name: "Zuca",
    cat: "Web Application",
    img: imgZuca,
    desc: "Beauty and wellness on-demand service booking platform connecting clients with top-tier beauty professionals for home sessions or in-salon appointments.",
    tags: ["React", "Booking Engine", "UI/UX", "On-Demand"],
    link: "https://www.zucabooking.com/",
  },
  {
    name: "Zuntra",
    cat: "SaaS & AI Platforms",
    img: imgZuntra,
    desc: "Technology venture ecosystem and enterprise product company engineering intelligent AI solutions, cloud infrastructure, and next-generation digital platforms.",
    tags: ["Enterprise AI", "Cloud Architecture", "Digital Products", "React"],
    link: "https://www.zuntra.com/",
  },
  {
    name: "Huzzler",
    cat: ["Web Application", "Mobile Apps"],
    img: imgHuzzler,
    desc: "Next-gen freelance marketplace and AI-powered freelance dashboard enabling gig economy professionals to discover curated contracts, manage proposals, and track earnings.",
    tags: ["Freelance Platform", "AI Dashboard", "React", "Mobile App"],
    link: "https://www.huzzler.app/freelance-dashboard",
  },
  {
    name: "RentIt",
    cat: ["Web Application", "Mobile Apps"],
    img: imgRentit,
    desc: "Zero-brokerage rental discovery platform and co-living marketplace in Chennai with AI-matched listings for verified apartments, PG hostels, flatmates, and commercial spaces.",
    tags: ["Next.js", "Rental Marketplace", "AI Matching", "Chennai"],
    link: "https://www.myrentitapp.com/",
  },
  {
    name: "Wiviy",
    cat: "Mobile Apps",
    img: imgDatingApp,
    desc: "A modern dating platform designed for meaningful relationships, genuine conversations, and real emotional connections.",
    tags: ["Flutter", "Mobile App", "UI/UX Design"],
    link: "https://play.google.com/store/apps/details?id=com.with.app",
  },
  {
    name: "Muthu's petals",
    cat: "Web Application",
    img: img2,
    desc: "Muthu's Petals is a modern e-commerce platform for custom floral arrangements, flowers, and bouquets.",
    tags: ["MERN Stack", "E-Commerce", "Payment Gateway"],
    link: "https://share.google/VAG8WG4d6mlRcdg5q",
  },
  {
    name: "Zculter",
    cat: "UI/UX & Design",
    img: img3,
    desc: "A music streaming desktop application with modern interactive UX and sleek UI design.",
    tags: ["Desktop UI", "Figma", "Interactive UX"],
    link: "https://share.google/gWD1ZF2KsMsnIE84p",
  },
];