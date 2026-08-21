export default function ApexLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="apexLogoGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d1546f" />
          <stop offset="100%" stopColor="#6b2737" />
        </linearGradient>
      </defs>
      <path
        d="M24 4 L44 42 L4 42 Z"
        fill="none"
        stroke="url(#apexLogoGrad)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M13.5 30 L34.5 30" stroke="url(#apexLogoGrad)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="24" cy="4" r="2.75" fill="url(#apexLogoGrad)" />
    </svg>
  );
}
