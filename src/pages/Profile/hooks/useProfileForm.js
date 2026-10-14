import { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE, INITIAL_PROFILE_FORM, validateProfile } from '../constants';
import { normalizePhone } from '@/utils/phone';

function useProfileForm(user, updateProfile, uploadProfileImage, clearSuccess, successMessage, error) {
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [profileErrors, setProfileErrors] = useState({});
  const [photoUploading, setPhotoUploading] = useState(false);
  const photoInputRef = useRef(null);

  const [profileForm, setProfileForm] = useState(INITIAL_PROFILE_FORM);

  useEffect(() => {
    if (user) {
      const rawMobile = user.mobile || user.phoneNumber || user.phone || '';
      const cleanMobile = normalizePhone(rawMobile) || String(rawMobile).replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
      setProfileForm({
        fullName: user.fullName || '',
        email: user.email || '',
        mobile: cleanMobile,
        city: user.city || '',
        area: user.area || '',
        pincode: user.pincode || '',
      });
    }
  }, [user]);

  useEffect(() => {
    let timer;
    if (successMessage) {
      setSaveSuccess(successMessage);
      timer = setTimeout(() => { clearSuccess(); setSaveSuccess(null); }, 3000);
    }
    if (error) {
      setSaveError(error);
    }
    return () => { if (timer) clearTimeout(timer); };
  }, [successMessage, error, clearSuccess]);

  const handleProfileChange = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
    setSaveError(null);
    setSaveSuccess(null);
    setProfileErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handlePhotoUpload = async (file) => {
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      Swal.fire({ icon: 'error', title: 'Unsupported file type', text: 'Please select a JPG, PNG or WEBP image.', customClass: { confirmButton: 'rounded-xl px-5 py-2.5 font-bold' } });
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      Swal.fire({ icon: 'error', title: 'File too large', text: 'Image size is too large. Please select a smaller image (max 5MB).', customClass: { confirmButton: 'rounded-xl px-5 py-2.5 font-bold' } });
      return;
    }

    setPhotoUploading(true);
    setSaveError(null);
    setSaveSuccess(null);
    try {
      await uploadProfileImage(file).unwrap();
      setSaveSuccess('Profile photo updated');
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Profile photo updated successfully',
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-2xl shadow-xl',
          title: 'text-xl font-bold text-slate-800',
          htmlContainer: 'text-sm text-slate-600',
        },
      });
    } catch (err) {
      setSaveError(err?.response?.data?.message || err?.message || 'Failed to upload photo');
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    const cleanMobile = normalizePhone(profileForm.mobile) || (profileForm.mobile || '').trim().replace(/^91(?=\d{10}$)/, '');
    const v = validateProfile({ ...profileForm, mobile: cleanMobile });
    // Email and mobile are non-editable fields; do not allow them to produce validation blockers
    delete v.email;
    delete v.mobile;
    setProfileErrors(v);
    if (Object.keys(v).length) return;

    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);
    try {
      const payload = {
        fullName: profileForm.fullName.trim(),
        email: (profileForm.email || user?.email || '').trim(),
        mobile: cleanMobile || (user?.mobile || ''),
        city: (profileForm.city || '').trim(),
        area: (profileForm.area || '').trim(),
      };
      const cleanPincode = (profileForm.pincode || '').trim();
      if (cleanPincode) {
        payload.pincode = cleanPincode;
      }
      await updateProfile(payload).unwrap();
      setSaveSuccess('Profile updated successfully');
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Profile updated successfully',
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-2xl shadow-xl',
          title: 'text-xl font-bold text-slate-800',
          htmlContainer: 'text-sm text-slate-600',
        },
      });
    } catch (err) {
      setSaveError(err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (field, hasError) => `w-full rounded-2xl border bg-slate-50/50 px-4 py-3.5 text-sm outline-none focus:ring-4 transition-all duration-200 ${
    hasError
      ? 'border-brand-orange/50 focus:border-brand-orange focus:ring-brand-orange/10 focus:bg-white'
      : 'border-slate-200 focus:border-brand-blue focus:ring-brand-blue/10 focus:bg-white hover:border-slate-300'
  }`;

  const avatarSrc = user?.profileImage?.url || null;
  const initial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U';

  return {
    activeTab,
    setActiveTab,
    saving,
    saveError,
    saveSuccess,
    profileErrors,
    photoUploading,
    photoInputRef,
    profileForm,
    handleProfileChange,
    handlePhotoUpload,
    handleProfileSave,
    inputClass,
    avatarSrc,
    initial,
  };
}

export { useProfileForm };