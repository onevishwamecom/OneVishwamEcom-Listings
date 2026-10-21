import React, { useRef, useState } from 'react';

/**
 * Reusable Phase 3 Media & Approvals section.
 * Handles photo drag-drop/selection, video file & preview, brochure PDF, and compliance declaration.
 */
export function MediaUploadSection({
  photos = [],
  onAddPhoto,
  onRemovePhoto,
  video = null,
  videoPreview = null,
  onVideoSelect,
  onRemoveVideo,
  brochure = null,
  brochureUrl = null,
  onBrochureSelect,
  onRemoveBrochure,
  form = {},
  updateForm,
  errors = {},
}) {
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const brochureInputRef = useRef(null);
  const [photoDragOver, setPhotoDragOver] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <i className="fa-solid fa-images text-purple-600" />
            <span>Media &amp; Approvals</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            High-quality verified photos, video walk-through, and official PDF documents
          </p>
        </div>

        {/* Hidden File Inputs */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            files.forEach((f) => onAddPhoto?.(f));
            e.target.value = '';
          }}
          accept="image/*"
          multiple
          className="hidden"
        />
        <input
          type="file"
          ref={brochureInputRef}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onBrochureSelect?.(f);
            e.target.value = '';
          }}
          accept=".pdf"
          className="hidden"
        />
        <input
          type="file"
          ref={videoInputRef}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onVideoSelect?.(f);
            e.target.value = '';
          }}
          accept="video/*"
          className="hidden"
        />

        {/* Photos Upload Zone */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">
              Product Photos ({photos.length} uploaded) <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-bold text-brand-blue hover:underline cursor-pointer"
            >
              + Add Photos
            </button>
          </div>

          {errors.photos && (
            <p className="text-xs font-semibold text-red-500">{errors.photos}</p>
          )}

          {photos.length === 0 ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setPhotoDragOver(true);
              }}
              onDragLeave={() => setPhotoDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setPhotoDragOver(false);
                const files = Array.from(e.dataTransfer.files || []).filter((f) => f.type.startsWith('image/'));
                files.forEach((f) => onAddPhoto?.(f));
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                photoDragOver
                  ? 'border-brand-blue bg-blue-50'
                  : 'border-slate-200 hover:border-blue-300 bg-slate-50/50'
              }`}
            >
              <i className="fa-solid fa-cloud-arrow-up text-3xl text-brand-blue mb-2" />
              <p className="text-sm font-bold text-slate-700">Click to upload or drag &amp; drop photos here</p>
              <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, WEBP (Direct Firebase Storage upload)</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {photos.map((item, idx) => {
                const url = typeof item === 'string' ? item : item instanceof File ? URL.createObjectURL(item) : item?.url;
                return (
                  <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                    <img src={url} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => onRemovePhoto?.(idx)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] shadow-sm cursor-pointer"
                      title="Remove Photo"
                    >
                      <i className="fa-solid fa-xmark" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 bg-black/75 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        Cover
                      </span>
                    )}
                  </div>
                );
              })}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-brand-blue flex flex-col items-center justify-center text-slate-400 hover:text-brand-blue transition-colors cursor-pointer bg-slate-50/50"
              >
                <i className="fa-solid fa-plus text-base mb-1" />
                <span className="text-[11px] font-bold">Add More</span>
              </button>
            </div>
          )}
        </div>

        {/* Video Tour Upload & Link */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <label className="text-sm font-semibold text-slate-700 block">
            Video Tour or Walk-Through (Optional)
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => videoInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-slate-300 bg-slate-50/40 transition-colors flex items-center justify-center gap-3"
            >
              <i className="fa-solid fa-video text-xl text-slate-400" />
              <div className="text-left">
                <p className="text-xs font-bold text-slate-700">
                  {video ? (typeof video === 'string' ? 'Video Linked' : video.name) : 'Upload Video File (MP4, WebM)'}
                </p>
                <p className="text-[10px] text-slate-400">Max file size 50 MB</p>
              </div>
            </div>

            <div>
              <input
                type="url"
                placeholder="Or paste YouTube / Vimeo Video URL"
                value={form.videoUrl || ''}
                onChange={(e) => updateForm?.('videoUrl', e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
              />
            </div>
          </div>

          {(videoPreview || video) && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-emerald-600" />
                <span>Video Selected: {typeof video === 'string' ? video : video?.name || 'Preview ready'}</span>
              </span>
              <button
                type="button"
                onClick={onRemoveVideo}
                className="text-red-600 font-bold hover:underline cursor-pointer"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Brochure PDF Upload */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <label className="text-sm font-semibold text-slate-700 block">
            Official Brochure / Specification PDF (Optional)
          </label>

          <div
            onClick={() => brochureInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-slate-300 bg-slate-50/40 transition-colors flex items-center justify-center gap-3"
          >
            <i className="fa-solid fa-file-pdf text-2xl text-red-500" />
            <div className="text-left">
              <p className="text-xs font-bold text-slate-700">
                {brochure ? (typeof brochure === 'string' ? 'PDF Attached' : brochure.name) : 'Upload Product Brochure / Rate Card PDF'}
              </p>
              <p className="text-[10px] text-slate-400">Max size 25 MB</p>
            </div>
          </div>

          {(brochure || brochureUrl) && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-emerald-600" />
                <span>Document Attached: {typeof brochure === 'string' ? brochure : brochure?.name || 'Brochure PDF'}</span>
              </span>
              <button
                type="button"
                onClick={onRemoveBrochure}
                className="text-red-600 font-bold hover:underline cursor-pointer"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Declaration Terms */}
        <div className="pt-4 border-t border-slate-100 flex items-start gap-3">
          <input
            type="checkbox"
            id="declaration-agreement"
            defaultChecked
            className="w-4 h-4 mt-0.5 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
          />
          <label htmlFor="declaration-agreement" className="text-xs text-slate-600 leading-relaxed cursor-pointer select-none">
            I declare that the details provided are genuine, and I hold the legal authorization to advertise this inventory on the OneVishwam platform in compliance with terms of service.
          </label>
        </div>
      </div>
    </div>
  );
}

export default MediaUploadSection;
