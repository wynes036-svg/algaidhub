export default function Logo({ size = 36 }) {
  return (
    <svg
      width={size * 4.2}
      height={size}
      viewBox="0 0 168 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bird icon */}
      <g transform="translate(0, 2)">
        {/* Body */}
        <ellipse cx="16" cy="22" rx="9" ry="6" fill="#e50914" />
        {/* Head */}
        <circle cx="24" cy="16" r="5" fill="#e50914" />
        {/* Beak */}
        <polygon points="29,15 34,16 29,17" fill="#fff" />
        {/* Eye */}
        <circle cx="25.5" cy="15" r="1.2" fill="#fff" />
        <circle cx="25.8" cy="14.8" r="0.5" fill="#111" />
        {/* Wing */}
        <path d="M10,20 Q4,12 12,14 Q8,18 14,18 Z" fill="#c0000a" />
        {/* Tail */}
        <path d="M7,22 Q2,18 4,24 Q6,20 8,24 Z" fill="#c0000a" />
        {/* Legs */}
        <line x1="14" y1="28" x2="12" y2="34" stroke="#e50914" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="18" y1="28" x2="18" y2="34" stroke="#e50914" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="12" y1="34" x2="10" y2="36" stroke="#e50914" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="12" y1="34" x2="14" y2="36" stroke="#e50914" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="18" y1="34" x2="16" y2="36" stroke="#e50914" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="18" y1="34" x2="20" y2="36" stroke="#e50914" strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* Algaid text */}
      <text
        x="42"
        y="28"
        fontFamily="Roboto, Arial, sans-serif"
        fontSize="22"
        fontWeight="700"
        fill="#ffffff"
        letterSpacing="0.5"
      >
        Algaid
      </text>

      {/* Hub text in red */}
      <text
        x="114"
        y="28"
        fontFamily="Roboto, Arial, sans-serif"
        fontSize="22"
        fontWeight="700"
        fill="#e50914"
        letterSpacing="0.5"
      >
        Hub
      </text>
    </svg>
  );
}
