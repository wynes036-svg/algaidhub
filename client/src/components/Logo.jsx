export default function Logo({ size = 36 }) {
  const h = size;
  const scale = h / 40;

  return (
    <svg
      width={200 * scale}
      height={h}
      viewBox="0 0 200 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff1a1a" />
          <stop offset="100%" stopColor="#b30000" />
        </linearGradient>
        <linearGradient id="textGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cccccc" />
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Icon background — rounded square */}
      <rect x="0" y="2" width="36" height="36" rx="8" fill="url(#redGrad)" filter="url(#shadow)" />

      {/* Film strip holes */}
      <rect x="3" y="6" width="4" height="4" rx="1" fill="rgba(0,0,0,0.4)" />
      <rect x="3" y="13" width="4" height="4" rx="1" fill="rgba(0,0,0,0.4)" />
      <rect x="3" y="20" width="4" height="4" rx="1" fill="rgba(0,0,0,0.4)" />
      <rect x="3" y="27" width="4" height="4" rx="1" fill="rgba(0,0,0,0.4)" />
      <rect x="29" y="6" width="4" height="4" rx="1" fill="rgba(0,0,0,0.4)" />
      <rect x="29" y="13" width="4" height="4" rx="1" fill="rgba(0,0,0,0.4)" />
      <rect x="29" y="20" width="4" height="4" rx="1" fill="rgba(0,0,0,0.4)" />
      <rect x="29" y="27" width="4" height="4" rx="1" fill="rgba(0,0,0,0.4)" />

      {/* Play triangle */}
      <polygon points="13,11 13,29 27,20" fill="white" opacity="0.95" />

      {/* "Algaid" text */}
      <text
        x="44"
        y="29"
        fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
        fontSize="23"
        fontWeight="900"
        fill="url(#textGrad)"
        letterSpacing="-0.5"
      >
        Algaid
      </text>

      {/* "Hub" text in red with slight italic */}
      <text
        x="122"
        y="29"
        fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
        fontSize="23"
        fontWeight="900"
        fill="url(#redGrad)"
        letterSpacing="-0.5"
        fontStyle="italic"
      >
        Hub
      </text>

      {/* Underline accent */}
      <rect x="44" y="32" width="152" height="2.5" rx="1.25" fill="url(#redGrad)" opacity="0.6" />
    </svg>
  );
}
