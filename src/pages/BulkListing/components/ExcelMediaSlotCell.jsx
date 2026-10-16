import React, { useRef, useState } from 'react';
import Swal from 'sweetalert2';

/**
 * ExcelMediaSlotCell
 * Represents a dedicated in-grid upload area for each media column (Image 1..5, Video, PDF):
 * - Click anywhere in the cell to open the local folder / file picker.
 * - Drag and drop a file directly onto the cell.
 * - Validates strict size limits (≤1MB images, ≤10MB video, ≤2MB PDF).
 * - Shows immediate "✓ Selected" state with thumbnail/icon and remove [✕] button.
 */
export default function ExcelMediaSlotCell({
  type = 'image', // 'image' | 'video' | 'pdf'
  slotIndex, // 0..4 for images, undefined for video/pdf
  label = 'Media',
  value = null, // File | string (URL) | null
  onSelect,
  onRemove,
  maxSizeMB = 1,
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const isImage = type === 'image';
  const isVideo = type === 'video';
  const isPdf = type === 'pdf';

  // Get preview source if value is present
  const getPreviewSrc = () => {
    if (!value) return '';
    if (value instanceof File) return URL.createObjectURL(value);
    if (typeof value === 'string') return value;
    if (value?.preview) return value.preview;
    if (value?.url) return value.url;
    if (value?.file instanceof File) return URL.createObjectURL(value.file);
    return '';
  };

  const getFileName = () => {
    if (!value) return '';
    if (value instanceof File) return value.name;
    if (typeof value === 'string') {
      try {
        const u = new URL(value);
        return u.pathname.split('/').pop() || 'Selected URL';
      } catch {
        return value.split('/').pop() || 'Selected URL';
      }
    }
    if (value?.name) return value.name;
    return 'Selected';
  };

  const handleProcessFile = (file) => {
    if (!file) return;

    // Validate size limit
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      const actualMB = (file.size / (1024 * 1024)).toFixed(2);
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        html: `<b>${file.name}</b> (${actualMB} MB) exceeds the <b>${maxSizeMB}MB</b> limit for ${label}.<br><br>Please select a file ≤ ${maxSizeMB}MB.`,
        confirmButtonColor: '#2563eb',
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Type validation
    if (isImage && !file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Image',
        text: 'Please select a valid image file (JPG, PNG, WebP).',
      });
      return;
    }
    if (isVideo && !file.type.startsWith('video/')) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Video',
        text: 'Please select a valid video file (MP4, WebM).',
      });
      return;
    }
    if (isPdf && file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid PDF',
        text: 'Please select a valid PDF document.',
      });
      return;
    }

    if (onSelect) {
      onSelect(file);
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    handleProcessFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleProcessFile(file);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const acceptMime = isImage
    ? 'image/jpeg,image/png,image/webp'
    : isVideo
    ? 'video/mp4,video/webm'
    : 'application/pdf';

  const previewSrc = getPreviewSrc();
  const fileName = getFileName();
  const hasValue = Boolean(value);

  return (
    <div
      className="w-full min-w-[95px] max-w-[130px] mx-auto select-none"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Hidden native file input for OS file dialog */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptMime}
        className="hidden"
      />

      {!hasValue ? (
        /* Empty State: Interactive Upload Area */
        <button
          type="button"
          onClick={handleClick}
          className={`w-full h-8 px-2 rounded-lg border border-dashed flex items-center justify-center gap-1.5 text-[11px] font-semibold transition-all cursor-pointer shadow-2xs group ${
            isDragging
              ? 'border-brand-blue bg-blue-100 text-brand-blue scale-102'
              : 'border-slate-300 hover:border-brand-blue bg-white hover:bg-blue-50/80 text-slate-500 hover:text-brand-blue'
          }`}
          title={`Click or drop file to upload ${label} (≤${maxSizeMB}MB)`}
        >
          <i
            className={`fa-solid fa-cloud-arrow-up text-[10px] group-hover:scale-110 transition-transform ${
              isDragging ? 'text-brand-blue' : 'text-slate-400 group-hover:text-brand-blue'
            }`}
          ></i>
          <span>+ Upload</span>
        </button>
      ) : (
        /* Populated State: "✓ Selected" Field */
        <div
          onClick={handleClick}
          className={`relative group w-full h-8 px-1.5 rounded-lg border flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all ${
            isImage
              ? 'border-emerald-300 bg-emerald-50/90 hover:bg-emerald-100/90'
              : isVideo
              ? 'border-indigo-300 bg-indigo-50/90 hover:bg-indigo-100/90'
              : 'border-amber-300 bg-amber-50/90 hover:bg-amber-100/90'
          }`}
          title={`${label}: ${fileName} (Click to replace file)`}
        >
          {/* Visual Thumbnail / Icon */}
          {isImage ? (
            <div className="w-6 h-6 rounded overflow-hidden bg-white border border-emerald-200 shrink-0">
              <img
                src={previewSrc}
                alt={label}
                className="w-full h-full object-cover"
              />
            </div>
          ) : isVideo ? (
            <div className="w-6 h-6 rounded bg-indigo-600 text-white flex items-center justify-center shrink-0 text-[10px]">
              <i className="fa-solid fa-video"></i>
            </div>
          ) : (
            <div className="w-6 h-6 rounded bg-amber-600 text-white flex items-center justify-center shrink-0 text-[10px]">
              <i className="fa-solid fa-file-pdf"></i>
            </div>
          )}

          {/* "Selected" status and filename */}
          <div className="flex-1 min-w-0 text-left">
            <div
              className={`text-[10px] font-bold leading-none flex items-center gap-0.5 ${
                isImage
                  ? 'text-emerald-800'
                  : isVideo
                  ? 'text-indigo-900'
                  : 'text-amber-900'
              }`}
            >
              <i className="fa-solid fa-circle-check text-[8px]"></i>
              <span>Selected</span>
            </div>
            <div className="text-[8px] text-slate-500 truncate max-w-[55px] mt-0.5">
              {fileName}
            </div>
          </div>

          {/* Remove / Clear button */}
          <button
            type="button"
            onClick={handleClear}
            className="w-4 h-4 rounded-full bg-slate-200/80 hover:bg-rose-500 hover:text-white text-slate-600 flex items-center justify-center text-[9px] font-bold transition-colors shrink-0"
            title={`Remove ${label}`}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
