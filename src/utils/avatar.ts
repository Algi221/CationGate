/**
 * Utility for generating deterministic local SVG avatars without external network calls.
 * Prevents network timeouts (net::ERR_CONNECTION_TIMED_OUT) and works 100% offline.
 */

const AVATAR_PALETTES = [
  { bg: "#2563EB", fg: "#FFFFFF" }, // Blue
  { bg: "#059669", fg: "#FFFFFF" }, // Emerald
  { bg: "#7C3AED", fg: "#FFFFFF" }, // Violet
  { bg: "#D97706", fg: "#FFFFFF" }, // Amber
  { bg: "#DB2777", fg: "#FFFFFF" }, // Pink
  { bg: "#0891B2", fg: "#FFFFFF" }, // Cyan
  { bg: "#4F46E5", fg: "#FFFFFF" }, // Indigo
  { bg: "#0D9488", fg: "#FFFFFF" }, // Teal
  { bg: "#E11D48", fg: "#FFFFFF" }, // Rose
  { bg: "#475569", fg: "#FFFFFF" }, // Slate
];

export function generateAvatarDataUrl(name: string): string {
  const cleanName = (name || "User").trim();
  let hash = 0;
  for (let i = 0; i < cleanName.length; i++) {
    hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const palette = AVATAR_PALETTES[Math.abs(hash) % AVATAR_PALETTES.length];

  const words = cleanName.split(/\s+/);
  const initials = words.length > 1
    ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
    : cleanName.slice(0, 2).toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <defs>
      <linearGradient id="g_${Math.abs(hash)}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${palette.bg}" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="${palette.bg}"/>
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#g_${Math.abs(hash)})"/>
    <text x="50" y="54" font-family="-apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', Inter, Roboto, sans-serif" font-size="36" font-weight="800" fill="${palette.fg}" text-anchor="middle" dominant-baseline="middle" letter-spacing="-1">${initials}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
