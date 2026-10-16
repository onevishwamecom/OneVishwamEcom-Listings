export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export function validateProfile(form) {
  const e = {};
  const name = (form.name || form.fullName || '').trim();
  if (!name) e.name = 'Name is required';
  else if (name.length < 2) e.name = 'Name must be at least 2 characters';
  else if (name.length > 50) e.name = 'Name must be at most 50 characters';

  // Email and mobile are non-editable fields in profile

  // Pincode is optional, but if entered, must be exactly 6 digits
  const pincode = (form.pincode || '').trim();
  if (pincode && !/^\d{6}$/.test(pincode)) e.pincode = 'Pincode must be 6 digits';

  return e;
}

export const INITIAL_PROFILE_FORM = {
  name: '', email: '', mobile: '', city: '', area: '', pincode: '',
};