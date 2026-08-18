export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export function validateProfile(form) {
  const e = {};
  const name = (form.fullName || '').trim();
  if (!name) e.fullName = 'Full name is required';
  else if (name.length < 2) e.fullName = 'Name must be at least 2 characters';
  else if (name.length > 50) e.fullName = 'Name must be at most 50 characters';

  const email = (form.email || '').trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Invalid email';

  const mobile = (form.mobile || '').trim();
  if (mobile) {
    const digits = mobile.replace(/[\s-]/g, '');
    if (!/^\d{10}$/.test(digits)) e.mobile = 'Invalid 10-digit mobile number';
  }

  const pincode = (form.pincode || '').trim();
  if (pincode && !/^\d{6}$/.test(pincode)) e.pincode = 'Invalid 6-digit pincode';

  return e;
}

export const INITIAL_PROFILE_FORM = {
  fullName: '', email: '', mobile: '', city: '', area: '', pincode: '',
};