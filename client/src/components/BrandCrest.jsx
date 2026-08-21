function initialsFor(make) {
  if (!make) return "?";
  const words = make.trim().split(/[\s-]+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function BrandCrest({ make, size = 44 }) {
  const initials = initialsFor(make);
  return (
    <svg
      className="brand-crest"
      width={size}
      height={size}
      viewBox="0 0 44 44"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`${make} crest`}
    >
      <circle cx="22" cy="22" r="21" fill="var(--navy)" stroke="var(--wine-light)" strokeWidth="1" />
      <circle cx="22" cy="22" r="17.5" fill="none" stroke="var(--wine-light)" strokeWidth="0.75" />
      <text
        x="22"
        y="23"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="'Playfair Display', Georgia, serif"
        fontSize={initials.length > 1 ? 13 : 16}
        fontWeight="600"
        letterSpacing="0.5"
        fill="var(--ivory)"
      >
        {initials}
      </text>
    </svg>
  );
}
