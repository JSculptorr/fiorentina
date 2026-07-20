import sharp from "sharp";

const width = 1600;
const height = 900;
const crowdDots = Array.from(
  { length: 120 },
  (_, index) =>
    `<circle cx="${70 + index * 13}" cy="${710 + Math.sin(index) * 18}" r="2.2"/>`,
).join("");
const scanLines = Array.from(
  { length: 34 },
  (_, index) => `<path d="M${index * 52} 0 V900" stroke="#fff" stroke-width="1"/>`,
).join("");

const stadiumScene = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#100817"/>
      <stop offset="0.52" stop-color="#2a1640"/>
      <stop offset="1" stop-color="#080b10"/>
    </linearGradient>
    <radialGradient id="glow" cx="30%" cy="26%" r="60%">
      <stop offset="0" stop-color="#a66cff" stop-opacity=".55"/>
      <stop offset=".42" stop-color="#5b2c83" stop-opacity=".22"/>
      <stop offset="1" stop-color="#0f1117" stop-opacity="0"/>
    </radialGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="18"/></filter>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#sky)"/>
  <rect width="${width}" height="${height}" fill="url(#glow)"/>
  <path d="M0 620 C270 500 460 540 690 590 C900 635 1110 600 1600 500 L1600 900 L0 900 Z" fill="#080b10" opacity=".78"/>
  <path d="M88 610 C360 520 680 515 1030 575 C1240 612 1410 584 1530 535" fill="none" stroke="#f7f2ea" stroke-opacity=".18" stroke-width="3"/>
  <path d="M140 660 C445 570 775 568 1120 625 C1290 653 1430 638 1530 595" fill="none" stroke="#c9a95f" stroke-opacity=".26" stroke-width="2"/>
  <g opacity=".9">
    <path d="M176 676 L304 358 L334 676" fill="none" stroke="#d8c4ff" stroke-opacity=".28" stroke-width="8"/>
    <path d="M1300 670 L1414 330 L1450 670" fill="none" stroke="#d8c4ff" stroke-opacity=".22" stroke-width="8"/>
    <circle cx="304" cy="358" r="26" fill="#f7f2ea" opacity=".55" filter="url(#blur)"/>
    <circle cx="1414" cy="330" r="30" fill="#f7f2ea" opacity=".48" filter="url(#blur)"/>
  </g>
  <g opacity=".32">
    <rect x="0" y="712" width="${width}" height="188" fill="#160f20"/>
    <path d="M0 760 H1600" stroke="#f7f2ea" stroke-opacity=".12"/>
    <path d="M0 810 H1600" stroke="#f7f2ea" stroke-opacity=".08"/>
    <path d="M80 730 H1520" stroke="#a66cff" stroke-opacity=".28" stroke-width="6"/>
  </g>
  <g fill="#f7f2ea" opacity=".28">${crowdDots}</g>
  <g opacity=".18">${scanLines}</g>
  <rect width="${width}" height="${height}" fill="none" stroke="#ffffff" stroke-opacity=".10" stroke-width="2"/>
</svg>`;

await sharp(Buffer.from(stadiumScene))
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile("public/images/viola-stadium-atmosphere.jpg");

console.log("created public/images/viola-stadium-atmosphere.jpg");
