import React, { useRef, useState } from 'react';
import { DragDropProvider } from '@dnd-kit/react';
import { useSortable, isSortable } from '@dnd-kit/react/sortable';

function DndSortablePhotoItem({
  id,
  idx,
  item,
  isFirst,
  photosLength,
  onRemovePhoto,
  onMovePhoto,
}) {
  const { ref, isDragging, isDropTarget } = useSortable({ id, index: idx });
  const url = typeof item === 'string' ? item : item instanceof File ? URL.createObjectURL(item) : item?.url;
  const isLink = item?.isDirectLink || (!item?.file && url && !url.startsWith('blob:'));

  return (
    <div
      ref={ref}
      className={`relative group aspect-square rounded-2xl overflow-hidden bg-slate-50 border-2 transition-all cursor-grab active:cursor-grabbing select-none shadow-2xs ${
        isDragging
          ? 'opacity-40 border-dashed border-brand-blue scale-95 shadow-lg'
          : isDropTarget
          ? 'border-brand-blue ring-2 ring-brand-blue/30 scale-102'
          : isFirst
          ? 'border-amber-400 ring-2 ring-amber-400/20'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <img src={url} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover pointer-events-none" />

      {/* Top-Right Remove Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemovePhoto?.(idx);
        }}
        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] shadow-sm cursor-pointer z-20"
        title="Remove Photo"
      >
        <i className="fa-solid fa-xmark" />
      </button>

      {/* Sequence Badge */}
      <div className="absolute top-1.5 left-1.5 z-10 pointer-events-none flex flex-col gap-1 items-start">
        {isFirst ? (
          <span className="bg-amber-400 text-slate-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
            <i className="fa-solid fa-star text-[8px]" />
            <span>1st · Cover</span>
          </span>
        ) : (
          <span className="bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
            {idx + 1}{idx === 1 ? 'nd' : idx === 2 ? 'rd' : 'th'}
          </span>
        )}

        {isLink && (
          <span className="bg-indigo-600/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-2xs flex items-center gap-1">
            <i className="fa-solid fa-link text-[7px]" /> Link
          </span>
        )}
      </div>

      {/* Hover Swap & Reorder Overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={idx === 0}
            onClick={(e) => {
              e.stopPropagation();
              onMovePhoto?.(idx, idx - 1);
            }}
            title="Move Left / Forward"
            className="w-5 h-5 rounded bg-white/90 text-slate-700 hover:bg-white hover:text-brand-blue flex items-center justify-center text-[9px] shadow-sm disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <i className="fa-solid fa-arrow-left" />
          </button>
          <button
            type="button"
            disabled={idx === photosLength - 1}
            onClick={(e) => {
              e.stopPropagation();
              onMovePhoto?.(idx, idx + 1);
            }}
            title="Move Right / Backward"
            className="w-5 h-5 rounded bg-white/90 text-slate-700 hover:bg-white hover:text-brand-blue flex items-center justify-center text-[9px] shadow-sm disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <i className="fa-solid fa-arrow-right" />
          </button>
        </div>

        {!isFirst && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMovePhoto?.(idx, 0);
            }}
            title="Set as 1st (Primary Cover)"
            className="px-1.5 py-0.5 rounded bg-amber-400 hover:bg-amber-300 text-slate-900 text-[8px] font-extrabold flex items-center gap-1 shadow-sm cursor-pointer"
          >
            <i className="fa-solid fa-star text-[7px]" />
            <span>Cover</span>
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Reusable Phase 3 Media & Approvals section.
 * Handles photo drag-drop/selection, video file & preview, brochure PDF, and compliance declaration.
 */
export function MediaUploadSection({
  photos = [],
  onAddPhoto,
  onAddPhotoUrl,
  onRemovePhoto,
  onMovePhoto,
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
  const [directUrlInput, setDirectUrlInput] = useState('');

  const isMaxPhotos = photos.length >= 5;

  const handleAddDirectLink = (e) => {
    e?.preventDefault();
    const trimmed = (directUrlInput || '').trim();
    if (!trimmed) return;
    if (isMaxPhotos) return;
    onAddPhotoUrl?.(trimmed);
    setDirectUrlInput('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <i className="fa-solid fa-images text-purple-600" />
            <span>Media &amp; Approvals</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified photos (file upload or direct web links), video walk-through, and official PDF documents (Max 5 images total)
          </p>
        </div>

        {/* Hidden File Inputs */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            const remaining = Math.max(0, 5 - photos.length);
            files.slice(0, remaining).forEach((f) => onAddPhoto?.(f));
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
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-slate-700">
                Product Photos ({photos.length}/5) <span className="text-red-500">*</span>
              </label>
              {isMaxPhotos ? (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Max 5 Reached
                </span>
              ) : (
                <span className="text-[10px] text-slate-400">
                  {5 - photos.length} slot{5 - photos.length === 1 ? '' : 's'} remaining
                </span>
              )}
            </div>
            {!isMaxPhotos && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-bold text-brand-blue hover:underline cursor-pointer"
              >
                + Browse Files
              </button>
            )}
          </div>

          {/* Direct Image Link Input Bar */}
          <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-200/70 flex flex-col sm:flex-row gap-2 items-center">
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <i className="fa-solid fa-link text-xs" />
              </div>
              <input
                type="url"
                value={directUrlInput}
                disabled={isMaxPhotos}
                onChange={(e) => setDirectUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddDirectLink();
                  }
                }}
                placeholder={isMaxPhotos ? "Maximum 5 images reached" : "Paste direct image URL (bypasses Firebase storage directly to DB)"}
                className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue disabled:bg-slate-100 disabled:cursor-not-allowed"
              />
            </div>
            <button
              type="button"
              disabled={isMaxPhotos || !directUrlInput.trim()}
              onClick={handleAddDirectLink}
              className="w-full sm:w-auto px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <i className="fa-solid fa-plus text-[10px]" />
              <span>Add Link</span>
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
                files.slice(0, 5).forEach((f) => onAddPhoto?.(f));
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all ${
                photoDragOver
                  ? 'border-brand-blue bg-blue-50'
                  : 'border-slate-200 hover:border-blue-300 bg-slate-50/50'
              }`}
            >
              <i className="fa-solid fa-cloud-arrow-up text-3xl text-brand-blue mb-2" />
              <p className="text-sm font-bold text-slate-700">Click to upload files or drag &amp; drop photos here</p>
              <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, WEBP (or paste direct image link above) · Max 5 images</p>
            </div>
          ) : (
            <div className="space-y-2">
              <DragDropProvider
                onDragEnd={(event) => {
                  if (event.canceled) return;
                  const { source } = event.operation;
                  if (isSortable(source)) {
                    const { initialIndex, index } = source;
                    if (initialIndex !== index) {
                      onMovePhoto?.(initialIndex, index);
                    }
                  }
                }}
              >
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {photos.map((item, idx) => {
                    const keyId = typeof item === 'string'
                      ? item
                      : item instanceof File
                      ? `${item.name}-${item.size}-${idx}`
                      : item?.url || `photo-${idx}`;

                    return (
                      <DndSortablePhotoItem
                        key={keyId}
                        id={keyId}
                        idx={idx}
                        item={item}
                        isFirst={idx === 0}
                        photosLength={photos.length}
                        onRemovePhoto={onRemovePhoto}
                        onMovePhoto={onMovePhoto}
                      />
                    );
                  })}
                  {!isMaxPhotos && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 hover:border-brand-blue flex flex-col items-center justify-center text-slate-400 hover:text-brand-blue transition-colors cursor-pointer bg-slate-50/50"
                    >
                      <i className="fa-solid fa-plus text-base mb-1" />
                      <span className="text-[11px] font-bold">Add Photo</span>
                      <span className="text-[9px] text-slate-400">File or Link</span>
                    </button>
                  )}
                </div>
              </DragDropProvider>
              <p className="text-[11px] text-slate-400">
                <i className="fa-solid fa-circle-info mr-1" />
                Drag to reorder or use arrows. <strong>Position #1</strong> automatically serves as the primary cover photo.
              </p>
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
