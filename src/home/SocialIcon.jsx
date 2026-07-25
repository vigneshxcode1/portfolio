import "../icons/SocialIcon";

export default function SocialIcon({ label }) {
  return (
    <button className="social-icon" aria-label={label}>
      {label}
    </button>
  );
}