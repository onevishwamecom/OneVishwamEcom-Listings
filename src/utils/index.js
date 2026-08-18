export function sanitizeText(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function getDisplayId(item) {
  if (!item) return null;
  return item._id || item.id || null;
}

export function formatDate(dateString, fallback = 'N/A') {
  if (!dateString) return fallback;
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return fallback;
  }
}

export function safeParseInt(value, fallback = 0) {
  const n = parseInt(value, 10);
  return isNaN(n) ? fallback : n;
}

export function safeParseFloat(value, fallback = 0) {
  const n = parseFloat(value);
  return isNaN(n) ? fallback : n;
}

export function currentYear() {
  return new Date().getFullYear();
}

const LAKH = 100000;
const CRORE = 10000000;

export function formatINR(value, { compact = false, asCents = false } = {}) {
  if (value === null || value === undefined || value === '') return '';

  let num = Number(value);
  if (isNaN(num)) return String(value);

  if (asCents) num = num / 100;

  const sign = num < 0 ? '-' : '';
  const abs = Math.abs(num);

  if (compact && abs >= CRORE) return `${sign}₹${(abs / CRORE).toFixed(1).replace(/\.0$/, '')} Cr`;
  if (compact && abs >= LAKH) return `${sign}₹${(abs / LAKH).toFixed(1).replace(/\.0$/, '')} L`;

  const isDecimal = !Number.isInteger(abs);
  const [intPart, decPart] = isDecimal ? abs.toFixed(2).split('.') : [String(Math.round(abs)), null];

  const last3 = intPart.slice(-3);
  const rest = intPart.slice(0, -3);
  let grouped = rest
    ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3
    : last3;

  let result = `${sign}₹${grouped}`;
  if (decPart) result += `.${decPart}`;
  return result.trim();
}

export function isImageUrl(url) {
  return typeof url === 'string' && url.trim().startsWith('http');
}
