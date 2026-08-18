/**
 * Phone number normalization utility (mirrors backend normalizePhone).
 * Returns the 10-digit Indian mobile number; backend will add 91 prefix.
 */

export function normalizePhone(raw) {
  if (typeof raw !== 'string' && typeof raw !== 'number') return '';
  const str = String(raw).trim();
  if (!str) return '';

  const digits = str.replace(/\D/g, '');

  let tenDigit;
  if (digits.length === 10) {
    tenDigit = digits;
  } else if (digits.length === 11 && digits.startsWith('0')) {
    tenDigit = digits.slice(1);
  } else if (digits.length === 12 && digits.startsWith('91')) {
    tenDigit = digits.slice(2);
  } else if (digits.length === 13 && digits.startsWith('91')) {
    tenDigit = digits.slice(2);
  } else if (digits.startsWith('91') && digits.length >= 13) {
    tenDigit = digits.slice(2);
  } else {
    return ''; // Invalid format - return empty for validation to catch
  }

  if (!/^[6-9]\d{9}$/.test(tenDigit)) return '';

  return tenDigit;
}

/**
 * Format phone for backend API (adds 91 prefix)
 */
export function normalizePhoneForApi(raw) {
  const tenDigit = normalizePhone(raw);
  if (!tenDigit) return '';
  return `91${tenDigit}`;
}

export function formatPhoneForDisplay(normalized) {
  if (!normalized || normalized.length !== 12 || !normalized.startsWith('91')) return normalized;
  const rest = normalized.slice(2);
  return `+91 ${rest.slice(0, 5)} ${rest.slice(5)}`;
}

export function maskPhone(normalized) {
  if (!normalized || normalized.length !== 12 || !normalized.startsWith('91')) return '******';
  const rest = normalized.slice(2);
  return `+91 *****${rest.slice(-4)}`;
}