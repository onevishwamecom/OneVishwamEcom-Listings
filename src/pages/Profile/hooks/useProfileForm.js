import { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE, INITIAL_PROFILE_FORM, validateProfile } from '../constants';

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
      setProfileForm({
        fullName: user.fullName || user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
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
    } catch (err) {
      setSaveError(err?.response?.data?.message || err?.message || 'Failed to upload photo');
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    const v = validateProfile(profileForm);
    setProfileErrors(v);
    if (Object.keys(v).length) return;

    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);
    try {
      await updateProfile({
        fullName: profileForm.fullName.trim(),
        email: profileForm.email.trim(),
        mobile: profileForm.mobile.trim(),
        city: profileForm.city,
        area: profileForm.area,
        pincode: profileForm.pincode.trim(),
      }).unwrap();
      setSaveSuccess('Profile updated successfully');
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
  const initial = (user?.fullName || user?.name) ? (user.fullName || user.name).charAt(0).toUpperCase() : 'U';

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