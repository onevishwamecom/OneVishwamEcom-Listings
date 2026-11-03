import React, { useRef } from 'react';
import Swal from 'sweetalert2';

/**
 * ExcelMediaCell
 * An Excel-like interactive grid cell for image/media upload:
 * - Clicking the cell or button directly triggers a hidden <input type="file" />
 * - Renders inline thumbnails inside the table cell with quick delete/add
 * - Enforces max 5 images (<= 1MB each)
 * - Shows video & PDF badges with a quick button to open full media manager
 */
export default function ExcelMediaCell({
  rowIndex,
  media = {},
  onUpdateMedia,
  onOpenModal,
}) {
  const fileInputRef = useRef(null);

  const images = media.images || [];
  const video = media.video;
  const pdf = media.pdf || media.pdfUrl;

  const getImageSrc = (img) => {
    if (!img) return '';
    if (img instanceof File) return URL.createObjectURL(img);
    if (typeof img === 'string') return img;
    if (img?.preview) return img.preview;
    if (img?.url) return img.url;
    if (img?.file instanceof File) return URL.createObjectURL(img.file);
    return '';
  };

  const handleCellClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = 5 - images.length;
    if (remainingSlots <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Limit Reached',
        text: 'Maximum 5 images allowed per product. Remove an image to add a new one.',
      });
      return;
    }

    const newFiles = [];
    const oversizedFiles = [];

    for (const file of files.slice(0, remainingSlots)) {
      if (file.size > 1024 * 1024) {
        oversizedFiles.push(`${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
      } else {
        newFiles.push(file);
      }
    }

    if (oversizedFiles.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        html: `The following file(s) exceed the <b>1MB</b> limit:<br><br><code>${oversizedFiles.join(', ')}</code><br><br>Please select images ≤ 1MB.`,
      });
    }

    if (newFiles.length > 0) {
      const updated = {
        ...media,
        images: [...images, ...newFiles].slice(0, 5),
      };
      onUpdateMedia(rowIndex, updated);
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = (e, removeIdx) => {
    e.stopPropagation();
    const updatedImages = images.filter((_, i) => i !== removeIdx);
    onUpdateMedia(rowIndex, {
      ...media,
      images: updatedImages,
    });
  };

  const hasMedia = images.length > 0 || !!video || !!pdf;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Hidden file input for native OS file picker */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
      />

      {images.length === 0 ? (
        /* Empty state: clickable upload button matching user's ExcelImageCell */
        <button
          type="button"
          onClick={handleCellClick}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-blue-50 border border-dashed border-slate-300 hover:border-brand-blue text-slate-700 hover:text-brand-blue rounded-lg text-xs font-semibold transition-all shadow-2xs group"
          title="Click to browse and upload image (Max 1MB)"
        >
          <i className="fa-solid fa-cloud-arrow-up text-brand-blue group-hover:scale-110 transition-transform text-[11px]"></i>
          <span>+ Upload Image</span>
        </button>
      ) : (
        /* Populated state: inline thumbnails strip */
        <div className="flex items-center gap-1.5">
          {images.slice(0, 3).map((img, i) => {
            const src = getImageSrc(img);
            return (
              <div
                key={i}
                className="relative group w-8 h-8 rounded-lg overflow-hidden border border-slate-300 bg-slate-100 shrink-0 aspect-square"
                title={`Image ${i + 1} (Click ✕ to remove)`}
              >
                <img
                  src={src}
                  alt={`Preview ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => handleRemoveImage(e, i)}
                  className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px]"
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            );
          })}

          {images.length < 5 && (
            <button
              type="button"
              onClick={handleCellClick}
              className="w-8 h-8 rounded-lg border border-dashed border-slate-300 hover:border-brand-blue bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-brand-blue flex items-center justify-center text-xs transition-all shrink-0"
              title={`Add another image (${images.length}/5 used)`}
            >
              +
            </button>
          )}

          <span
            className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800"
            title={`${images.length}/5 Images attached`}
          >
            {images.length}/5
          </span>
        </div>
      )}

      {/* Video Pill */}
      {video && (
        <span
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800"
          title="1 Video attached (≤10MB)"
        >
          🎥 1
        </span>
      )}

      {/* PDF Pill */}
      {pdf && (
        <span
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800"
          title="1 PDF Brochure attached (≤2MB)"
        >
          📄 1
        </span>
      )}

      {/* Button to open full modal for video, pdf, and full gallery */}
      <button
        type="button"
        onClick={() => onOpenModal(rowIndex)}
        className="p-1 text-slate-400 hover:text-brand-blue hover:bg-blue-50 rounded-md transition-all text-xs"
        title="Open full media manager (Video, PDF, high-res view)"
      >
        <i className="fa-solid fa-sliders text-[11px]"></i>
      </button>
    </div>
  );
}
