export default function Logo({ size = 36 }) {
  const scale = size / 40;
  return (
    <svg width={200 * scale} height={size} viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff1a1a" />
          <stop offset="100%" stopColor="#b30000" />
        </linearGradient>
        <linearGradient id="textGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cccccc" />
        </linearGradient>
      </defs>

      {/* Bird image as icon */}
      <image href="/avatar.jpg" x="0" y="0" width="40" height="40" clipPath="url(#birdClip)" />
      <defs>
        <clipPath id="birdClip">
          <rect x="0" y="0" width="40" height="40" rx="8" />
        </clipPath>
      </defs>

      {/* "Algaid" text */}
      <text x="48" y="29"
        fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
        fontSize="23" fontWeight="900" fill="url(#textGrad)" letterSpacing="-0.5">
        Algaid
      </text>

      {/* "Hub" in red italic */}
      <text x="126" y="29"
        fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
        fontSize="23" fontWeight="900" fill="url(#redGrad)" letterSpacing="-0.5" fontStyle="italic">
        Hub
      </text>

      {/* Underline */}
      <rect x="48" y="32" width="148" height="2.5" rx="1.25" fill="url(#redGrad)" opacity="0.6" />
    </svg>
  );
}
