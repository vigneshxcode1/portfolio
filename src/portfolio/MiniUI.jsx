import { ORANGE } from "../constants";

/**
 * Decorative placeholder UI rendered inside portfolio cards.
 * Replace with real <img src="..." /> when you have project screenshots.
 */
export default function MiniUI({ c1, c2, idx }) {
  const patterns = [
    /* pattern 0 – dashboard-style */
    <svg key={0} width="100%" height="100%" viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <rect width="220" height="140" fill={c1} />
      <rect x="12" y="12" width="196" height="24" rx="4" fill={c2} opacity="0.8" />
      <rect x="12" y="44" width="120" height="12" rx="3" fill={c2} opacity="0.6" />
      <rect x="12" y="62" width="80" height="8" rx="2" fill={c2} opacity="0.4" />
      <rect x="12" y="80" width="196" height="48" rx="4" fill={c2} opacity="0.5" />
      <circle cx="148" cy="104" r="18" fill={ORANGE} opacity="0.15" />
    </svg>,

    /* pattern 1 – split-panel */
    <svg key={1} width="100%" height="100%" viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <rect width="220" height="140" fill={c1} />
      <rect x="12" y="12" width="72" height="116" rx="4" fill={c2} opacity="0.7" />
      <rect x="92" y="12" width="116" height="54" rx="4" fill={c2} opacity="0.6" />
      <rect x="92" y="74" width="54" height="54" rx="4" fill={ORANGE} opacity="0.12" />
      <rect x="154" y="74" width="54" height="54" rx="4" fill={c2} opacity="0.5" />
    </svg>,

    /* pattern 2 – circle hero */
    <svg key={2} width="100%" height="100%" viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice">
      <rect width="220" height="140" fill={c1} />
      <circle cx="110" cy="70" r="50" fill={c2} opacity="0.5" />
      <circle cx="110" cy="70" r="32" fill={ORANGE} opacity="0.1" />
      <rect x="12" y="12" width="100" height="10" rx="3" fill={c2} opacity="0.5" />
      <rect x="12" y="118" width="196" height="10" rx="3" fill={c2} opacity="0.4" />
    </svg>,
  ];

  return patterns[idx % patterns.length];
}