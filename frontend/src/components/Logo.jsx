export default function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bridge base */}
      <path d="M4 36 L24 16 L44 36" stroke="url(#grad)" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      {/* Bridge pillars */}
      <line x1="14" y1="26" x2="14" y2="38" stroke="url(#grad)" strokeWidth="3" strokeLinecap="round"/>
      <line x1="34" y1="26" x2="34" y2="38" stroke="url(#grad)" strokeWidth="3" strokeLinecap="round"/>
      {/* Bridge road */}
      <line x1="4" y1="38" x2="44" y2="38" stroke="url(#grad)" strokeWidth="3.5" strokeLinecap="round"/>
      {/* Graduation cap */}
      <rect x="18" y="8" width="12" height="3" rx="1" fill="url(#grad)"/>
      <polygon points="24,4 32,8 24,12 16,8" fill="url(#grad)"/>
      <line x1="32" y1="8" x2="32" y2="13" stroke="url(#grad)" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="32" cy="14" r="1.5" fill="#00C9B1"/>
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00C9B1"/>
          <stop offset="100%" stopColor="#00A8E8"/>
        </linearGradient>
      </defs>
    </svg>
  )
}
