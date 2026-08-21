const LOGOS = {
  ferrari: "/logos/ferrari.svg",
  lamborghini: "/logos/lamborghini.svg",
  mclaren: "/logos/mclaren.svg",
  porsche: "/logos/porsche.png",
  "rolls-royce": "/logos/rolls-royce.svg",
  "aston martin": "/logos/aston-martin.svg",
};

export function logoFor(make) {
  if (!make) return null;
  return LOGOS[make.trim().toLowerCase()] || null;
}
