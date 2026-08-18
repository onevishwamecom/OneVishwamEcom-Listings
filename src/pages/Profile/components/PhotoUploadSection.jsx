import { useState, useEffect } from 'react';

export function PhotoUploadSection({ avatarSrc, initial, photoUploading, photoInputRef, handlePhotoUpload }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [avatarSrc]);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-8 border-b border-slate-100">
      <div className="relative group">
        {avatarSrc && !imgError ? (
          <img
            src={avatarSrc}
            alt="Profile"
            onError={() => setImgError(true)}
            className="h-24 w-24 rounded-2xl object-cover shadow-sm ring-4 ring-slate-50 transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-blue/80 flex items-center justify-center text-white text-4xl font-extrabold shadow-glow-blue ring-4 ring-white transition-transform group-hover:scale-105">
            {initial}
          </div>
        )}
        <button
          type="button"
          onClick={() => photoInputRef.current?.click()}
          disabled={photoUploading}
          className="absolute -bottom-2 -right-2 h-9 w-9 rounded-xl bg-white text-brand-blue border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-50 hover:text-brand-blue/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Upload new photo"
        >
          {photoUploading ? <i className="fa-solid fa-spinner fa-spin text-sm" /> : <i className="fa-solid fa-camera text-sm" />}
        </button>
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Profile Photo</h3>
        <p className="text-sm font-medium text-slate-500 mb-3">Upload a new avatar. JPG, PNG or WEBP. The image is optimized to under 1 MB.</p>
        <input
          ref={photoInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => { if (e.target.files[0]) handlePhotoUpload(e.target.files[0]); e.target.value = ''; }}
        />
      </div>
    </div>
  );
}
