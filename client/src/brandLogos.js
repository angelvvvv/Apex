const LOGOS = {
  ferrari: "/logos/ferrari.svg",
  lamborghini: "/logos/lamborghini.svg",
  mclaren: "/logos/mclaren.svg",
  porsche: "/logos/porsche.png",
  "rolls-royce": "/logos/rolls-royce.svg",
  "aston martin": "/logos/aston-martin.svg",
  bugatti: "/logos/bugatti.svg",
  bentley: "/logos/bentley.svg",
  "mercedes-amg": "/logos/mercedes-amg.svg",
  "mercedes-benz": "/logos/mercedes-amg.svg",
  audi: "/logos/audi.svg",
  maserati: "/logos/maserati.svg",
};

export function logoFor(make) {
  if (!make) return null;
  return LOGOS[make.trim().toLowerCase()] || null;
}
