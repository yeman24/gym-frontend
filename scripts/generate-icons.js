import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "..", "public");

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Base standard SVG (full bleed with dark background and vibrant orange dumbbell badge)
function createSvg(size, isMaskable = false) {
  // If maskable, safe zone requires the key content to fit inside 80% circle (10% padding on each side)
  const scale = isMaskable ? 0.65 : 0.82;
  const offset = ((1 - scale) * size) / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1f1e1c" />
      <stop offset="100%" stop-color="#0f0f0e" />
    </linearGradient>
    <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff6b3d" />
      <stop offset="100%" stop-color="#e9542c" />
    </linearGradient>
    <linearGradient id="accentGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#e9542c" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#d8f45b" stop-opacity="0.1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${isMaskable ? 0 : size * 0.22}" fill="url(#bgGrad)" />

  ${
    !isMaskable
      ? `<rect x="${size * 0.04}" y="${size * 0.04}" width="${size * 0.92}" height="${size * 0.92}" rx="${size * 0.18}" fill="none" stroke="url(#accentGlow)" stroke-width="${size * 0.02}" />`
      : ""
  }

  <!-- Emblem Group -->
  <g transform="translate(${offset}, ${offset}) scale(${scale * (size / 100)})">
    <!-- Center Orange Disc -->
    <circle cx="50" cy="50" r="38" fill="url(#orangeGrad)" />
    
    <!-- Stylized Dumbbell / Athletic Monogram in #f3f0e9 -->
    <g fill="#f3f0e9" stroke="#f3f0e9" stroke-linecap="round" stroke-linejoin="round">
      <!-- Left plate outer -->
      <rect x="23" y="32" width="7" height="36" rx="3.5" fill="#f3f0e9" stroke="none" />
      <!-- Left plate inner -->
      <rect x="32" y="37" width="5" height="26" rx="2.5" fill="#f3f0e9" stroke="none" />
      <!-- Central Bar -->
      <rect x="37" y="46" width="26" height="8" rx="2" fill="#f3f0e9" stroke="none" />
      <!-- Right plate inner -->
      <rect x="63" y="37" width="5" height="26" rx="2.5" fill="#f3f0e9" stroke="none" />
      <!-- Right plate outer -->
      <rect x="70" y="32" width="7" height="36" rx="3.5" fill="#f3f0e9" stroke="none" />
      
      <!-- Knurling ridges on bar -->
      <line x1="47" y1="46" x2="47" y2="54" stroke="#e9542c" stroke-width="1.8" />
      <line x1="50" y1="46" x2="50" y2="54" stroke="#e9542c" stroke-width="1.8" />
      <line x1="53" y1="46" x2="53" y2="54" stroke="#e9542c" stroke-width="1.8" />
    </g>

    <!-- Tiny Lime Accent dot symbolizing performance -->
    <circle cx="76" cy="24" r="4.5" fill="#d8f45b" />
  </g>
</svg>`;
}

async function run() {
  console.log("Generating PWA icons...");

  // Write SVG favicon
  const svgFavicon = createSvg(100, false);
  fs.writeFileSync(path.join(publicDir, "favicon.svg"), svgFavicon, "utf8");
  console.log("Created favicon.svg");

  // Generate PNGs
  const targets = [
    { name: "apple-touch-icon.png", size: 180, maskable: false },
    { name: "pwa-192x192.png", size: 192, maskable: false },
    { name: "pwa-512x512.png", size: 512, maskable: false },
    { name: "pwa-maskable-192x192.png", size: 192, maskable: true },
    { name: "pwa-maskable-512x512.png", size: 512, maskable: true },
    { name: "favicon-32x32.png", size: 32, maskable: false },
    { name: "favicon-16x16.png", size: 16, maskable: false }
  ];

  for (const { name, size, maskable } of targets) {
    const svg = createSvg(size, maskable);
    const outputPath = path.join(publicDir, name);
    await sharp(Buffer.from(svg)).png().toFile(outputPath);
    console.log(`Generated ${name} (${size}x${size})`);
  }

  // Generate simple favicon.ico from 32x32 PNG
  const icoPath = path.join(publicDir, "favicon.ico");
  await sharp(Buffer.from(createSvg(64, false))).png().toFile(icoPath);
  console.log("Generated favicon.ico");

  console.log("All icons generated successfully!");
}

run().catch((err) => {
  console.error("Error generating icons:", err);
  process.exit(1);
});
