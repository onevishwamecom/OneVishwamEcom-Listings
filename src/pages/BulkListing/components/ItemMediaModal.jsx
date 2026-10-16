import React, { useState, useRef, useEffect } from 'react';
import { uploadMediaToStorage } from '@/services/storageService';

/**
 * ItemMediaModal
 * Reusable modal for managing listing media and item details.
 *
 * Enforces:
 * - Images: Max 5, <= 1MB each (JPEG, PNG, WebP)
 * - Video: Max 1, <= 10MB (MP4, WebM)
 * - PDF: Max 1, <= 2MB (PDF)
 *
 * Reused via props:
 * - When `showProductFields` is false: Media-only editor.
 * - When `showProductFields` is true: Includes Title, Price, Subcategory, Location & Description fields.
 * - When `uploadToStorage` is true: Automatically uploads local File objects to Firebase Storage on save.
 */
export default function ItemMediaModal({
  isOpen,
  onClose,
  rowIndex,
  itemTitle,
  initialMedia,
  onSave,
  // Props for reusing with batch items or full product edit
  item,
  batchCategory,
  category,
  showProductFields = Boolean(item),
  uploadToStorage = Boolean(item),
  isSaving = false,
}) {
  const activeCategory = batchCategory || category || item?.category || 'properties';
  const effectiveTitle = itemTitle || item?.title || item?.name || (rowIndex !== undefined ? `Product Row ${rowIndex + 1}` : 'Listing Item');

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    subcategory: '',
    city: 'Bengaluru',
    area: '',
    description: '',
  });

  const [images, setImages] = useState([]); // Array of { file?: File, url?: string, id: string, name: string, size: number }
  const [video, setVideo] = useState(null); // { file?: File, url?: string, name: string, size: number }
  const [pdf, setPdf] = useState(null); // { file?: File, url?: string, name: string, size: number }
  const [errorMessage, setErrorMessage] = useState('');

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatusText, setUploadStatusText] = useState('');

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage('');
      setIsUploading(false);
      setUploadProgress(0);
      setUploadStatusText('');

      if (item) {
        setFormData({
          title: item.title || item.name || '',
          price: String(item.price || item.numericPrice || '').replace(/[^\d.]/g, ''),
          subcategory: item.subcategory || item.propertyType || '',
          city: item.city || 'Bengaluru',
          area: item.area || item.location || '',
          description: item.description || '',
        });
      } else {
        setFormData({
          title: '',
          price: '',
          subcategory: '',
          city: 'Bengaluru',
          area: '',
          description: '',
        });
      }

      // Determine initial media sources from initialMedia or item
      const mediaSource = initialMedia || {
        images: item?.images || [],
        video: item?.video || item?.videoUrl || null,
        pdf: item?.pdfUrl || item?.brochure || item?.pdf || null,
        pdfUrl: item?.pdfUrl || item?.brochure || item?.pdf || null,
      };

      const initImgs = (mediaSource.images || []).map((img, i) => {
        if (img instanceof File) {
          return {
            id: `file_${Date.now()}_${i}`,
            file: img,
            name: img.name,
            size: img.size,
            preview: URL.createObjectURL(img),
          };
        }
        if (typeof img === 'string') {
          return {
            id: `url_${i}`,
            url: img,
            name: img.split('/').pop()?.split('?')[0] || `Image ${i + 1}`,
            size: 0,
            preview: img,
          };
        }
        if (img && img.preview) return img;
        return {
          id: `item_${i}`,
          url: img?.url || '',
          file: img?.file,
          name: img?.name || `Image ${i + 1}`,
          size: img?.size || 0,
          preview: img?.file ? URL.createObjectURL(img.file) : (img?.url || ''),
        };
      });
      setImages(initImgs.slice(0, 5));

      // Video
      if (mediaSource.video) {
        const v = mediaSource.video;
        if (v instanceof File) {
          setVideo({ file: v, name: v.name, size: v.size });
        } else if (typeof v === 'string') {
          setVideo({ url: v, name: v.split('/').pop()?.split('?')[0] || 'Video file', size: 0 });
        } else {
          setVideo(v);
        }
      } else {
        setVideo(null);
      }

      // PDF
      const p = mediaSource.pdf || mediaSource.pdfUrl;
      if (p) {
        if (p instanceof File) {
          setPdf({ file: p, name: p.name, size: p.size });
        } else if (typeof p === 'string') {
          setPdf({ url: p, name: p.split('/').pop()?.split('?')[0] || 'Document.pdf', size: 0 });
        } else {
          setPdf(p);
        }
      } else {
        setPdf(null);
      }
    }
  }, [isOpen, initialMedia, item]);

  if (!isOpen) return null;

  const formatFileSize = (bytes) => {
    if (!bytes || bytes <= 0) return 'Remote link';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Add Images handler
  const handleImagesSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setErrorMessage('');

    const maxAllowed = 5 - images.length;
    if (maxAllowed <= 0) {
      setErrorMessage('Maximum 5 images allowed per product.');
      return;
    }

    const newImgs = [];
    for (const file of files.slice(0, maxAllowed)) {
      // Validate file size (1MB max)
      if (file.size > 1024 * 1024) {
        setErrorMessage(`⚠️ "${file.name}" exceeds 1MB limit (${formatFileSize(file.size)}). Max allowed is 1MB.`);
        continue;
      }
      newImgs.push({
        id: `file_${Date.now()}_${Math.random()}`,
        file,
        name: file.name,
        size: file.size,
        preview: URL.createObjectURL(file),
      });
    }

    if (files.length > maxAllowed) {
      setErrorMessage(`Only added ${newImgs.length} image(s). Products can have at most 5 images.`);
    }

    setImages((prev) => [...prev, ...newImgs].slice(0, 5));
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  // Add Video handler
  const handleVideoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMessage('');

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage(`⚠️ Video "${file.name}" exceeds 10MB limit (${formatFileSize(file.size)}). Max allowed is 10MB.`);
      if (videoInputRef.current) videoInputRef.current.value = '';
      return;
    }

    setVideo({
      file,
      name: file.name,
      size: file.size,
    });
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const removeVideo = () => {
    setVideo(null);
  };

  // Add PDF handler
  const handlePdfSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMessage('');

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage(`⚠️ PDF "${file.name}" exceeds 2MB limit (${formatFileSize(file.size)}). Max allowed is 2MB.`);
      if (pdfInputRef.current) pdfInputRef.current.value = '';
      return;
    }

    setPdf({
      file,
      name: file.name,
      size: file.size,
    });
    if (pdfInputRef.current) pdfInputRef.current.value = '';
  };

  const removePdf = () => {
    setPdf(null);
  };

  // Save handler supporting both pre-upload and direct Firebase storage upload
  const handleSave = async () => {
    if (showProductFields) {
      if (!formData.title.trim()) {
        setErrorMessage('Title / Product Name is required.');
        return;
      }
      if (!formData.price.trim()) {
        setErrorMessage('Price is required.');
        return;
      }
    }

    // Direct Firebase storage upload when requested
    if (uploadToStorage) {
      const filesToUpload = [];
      images.forEach((img, idx) => {
        if (img.file instanceof File) {
          filesToUpload.push({ type: 'images', file: img.file, slotIdx: idx });
        }
      });
      if (video?.file instanceof File) {
        filesToUpload.push({ type: 'videos', file: video.file, slotIdx: 'video' });
      }
      if (pdf?.file instanceof File) {
        filesToUpload.push({ type: 'documents', file: pdf.file, slotIdx: 'pdf' });
      }

      if (filesToUpload.length > 0) {
        setIsUploading(true);
        const uploadedUrls = {};
        const total = filesToUpload.length;

        try {
          for (let i = 0; i < total; i++) {
            const uploadItem = filesToUpload[i];
            const pct = Math.round(((i + 1) / total) * 100);
            setUploadProgress(pct);
            setUploadStatusText(`Uploading ${uploadItem.file.name} to Firebase (${i + 1}/${total})...`);

            const dlUrl = await uploadMediaToStorage({
              category: activeCategory,
              productId: item?._id || item?.itemId || `item_${Date.now()}`,
              mediaType: uploadItem.type,
              file: uploadItem.file,
            });

            uploadedUrls[uploadItem.slotIdx] = dlUrl;
          }
        } catch (err) {
          console.error('Firebase Storage upload error:', err);
          setErrorMessage(`Failed to upload media to storage: ${err.message}`);
          setIsUploading(false);
          return;
        }
        setIsUploading(false);

        const finalImages = images
          .map((img, idx) => uploadedUrls[idx] || img.url || (typeof img === 'string' ? img : ''))
          .filter(Boolean);
        const finalVideo = uploadedUrls['video'] || video?.url || (typeof video === 'string' ? video : '') || '';
        const finalPdf = uploadedUrls['pdf'] || pdf?.url || (typeof pdf === 'string' ? pdf : '') || '';

        const payload = showProductFields
          ? {
              ...formData,
              category: activeCategory,
              images: finalImages,
              video: finalVideo,
              pdfUrl: finalPdf,
            }
          : {
              images: finalImages,
              video: finalVideo,
              pdf: finalPdf,
              pdfUrl: finalPdf,
            };

        if (rowIndex !== undefined && rowIndex !== null) {
          onSave(rowIndex, payload);
        } else {
          onSave(payload);
        }
        if (!isSaving) {
          onClose();
        }
        return;
      }
    }

    // Standard client media save
    const finalImages = images
      .map((img) => (img.file ? img.file : img.url || img.preview || (typeof img === 'string' ? img : '')))
      .filter(Boolean);
    const finalVideo = video ? (video.file ? video.file : video.url || video) : null;
    const finalPdf = pdf ? (pdf.file ? pdf.file : pdf.url || pdf) : null;

    const payload = showProductFields
      ? {
          ...formData,
          category: activeCategory,
          images: finalImages,
          video: finalVideo || '',
          pdfUrl: finalPdf || '',
        }
      : {
          images: finalImages,
          video: finalVideo,
          pdf: finalPdf,
          pdfUrl: finalPdf,
        };

    if (rowIndex !== undefined && rowIndex !== null) {
      onSave(rowIndex, payload);
    } else {
      onSave(payload);
    }
    if (!isSaving) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30">
                {showProductFields ? (item ? 'Edit Listing Item' : 'Add Item') : rowIndex !== undefined ? `Item #${rowIndex + 1}` : 'Media'}
              </span>
              <span className="text-xs text-slate-300">
                Category: <span className="capitalize font-semibold text-white">{activeCategory}</span> · Status: <span className="text-amber-300 font-semibold">Pending Review</span>
              </span>
            </div>
            <h3 className="text-base font-bold text-white truncate max-w-md">
              {effectiveTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading || isSaving}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all disabled:opacity-50"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-slate-700">
          {/* Optional: Basic product fields when showProductFields is true */}
          {showProductFields && (
            <div className="space-y-3 pb-4 border-b border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Title / Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. 3 BHK Luxury Villa or Cotton Silk Saree"
                  className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Price (₹) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs font-bold">₹</span>
                    <input
                      type="text"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="e.g. 8500000"
                      className="w-full text-xs rounded-xl border border-slate-200 pl-7 pr-3.5 py-2.5 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subcategory / Type
                  </label>
                  <input
                    type="text"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    placeholder="e.g. Apartment, SUV, or Traditional"
                    className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Bengaluru"
                    className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Area / Locality
                  </label>
                  <input
                    type="text"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="e.g. Whitefield or Indiranagar"
                    className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the product or amenities..."
                  className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 resize-none"
                />
              </div>
            </div>
          )}

          {/* Rules Banner */}
          <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center text-xs">
            <div className="p-1.5 bg-white rounded-lg border border-slate-100 shadow-2xs">
              <span className="block font-bold text-slate-800">📸 Images</span>
              <span className="text-[11px] text-slate-500">Max 5 · ≤ 1MB each</span>
            </div>
            <div className="p-1.5 bg-white rounded-lg border border-slate-100 shadow-2xs">
              <span className="block font-bold text-slate-800">🎥 Video</span>
              <span className="text-[11px] text-slate-500">Max 1 · ≤ 10MB</span>
            </div>
            <div className="p-1.5 bg-white rounded-lg border border-slate-100 shadow-2xs">
              <span className="block font-bold text-slate-800">📄 PDF / Doc</span>
              <span className="text-[11px] text-slate-500">Max 1 · ≤ 2MB</span>
            </div>
          </div>

          {/* Upload Progress Banner */}
          {isUploading && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1.5 text-xs text-blue-900 animate-fade-in">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-2">
                  <i className="fa-solid fa-spinner fa-spin text-brand-blue"></i>
                  {uploadStatusText || 'Uploading to Firebase Storage...'}
                </span>
                <span className="font-mono text-brand-blue">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-brand-blue h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Validation Warning Alert */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2">
              <i className="fa-solid fa-circle-exclamation text-rose-600 mt-0.5 text-sm"></i>
              <div className="flex-1 font-medium">{errorMessage}</div>
              <button
                type="button"
                onClick={() => setErrorMessage('')}
                className="text-rose-500 hover:text-rose-700 font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* 1. Images Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">Product Images</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-brand-blue">
                  {images.length}/5 Selected
                </span>
              </div>
              {images.length < 5 && (
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={isUploading || isSaving}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-brand-blue bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all disabled:opacity-50"
                >
                  <i className="fa-solid fa-plus text-[10px]"></i> Browse Images
                </button>
              )}
            </div>

            <input
              type="file"
              ref={imageInputRef}
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handleImagesSelect}
            />

            {images.length === 0 ? (
              <div
                onClick={() => (!isUploading && !isSaving) && imageInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-brand-blue hover:bg-blue-50/40 rounded-xl p-5 text-center cursor-pointer transition-all"
              >
                <i className="fa-solid fa-cloud-arrow-up text-2xl text-slate-400 mb-1"></i>
                <p className="text-xs font-bold text-slate-700">Click to choose images (Up to 5)</p>
                <p className="text-[11px] text-slate-400">JPG, PNG, or WebP · Maximum 1MB each</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {images.map((img, i) => (
                  <div
                    key={img.id || i}
                    className="relative group border border-slate-200 rounded-xl overflow-hidden bg-slate-50 aspect-square flex flex-col justify-between"
                  >
                    <img
                      src={img.preview || img.url}
                      alt={img.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeImage(img.id)}
                          disabled={isUploading || isSaving}
                          className="w-6 h-6 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center text-xs shadow-sm disabled:opacity-50"
                        >
                          <i className="fa-solid fa-trash-can text-[10px]"></i>
                        </button>
                      </div>
                      <div className="text-[10px] text-white truncate font-medium bg-black/60 px-1.5 py-0.5 rounded">
                        {formatFileSize(img.size)}
                      </div>
                    </div>
                    {i === 0 && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold text-[9px]">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
                {images.length < 5 && (
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={isUploading || isSaving}
                    className="border-2 border-dashed border-slate-200 hover:border-brand-blue hover:bg-blue-50/50 rounded-xl aspect-square flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-brand-blue transition-all disabled:opacity-50"
                  >
                    <i className="fa-solid fa-plus text-base"></i>
                    <span className="text-[10px] font-bold">Add More</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 2. Video Section */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">Product Video</span>
                <span className="text-xs text-slate-500">(1 Video · Max 10MB)</span>
              </div>
            </div>

            <input
              type="file"
              ref={videoInputRef}
              accept="video/mp4,video/webm"
              className="hidden"
              onChange={handleVideoSelect}
            />

            {!video ? (
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                disabled={isUploading || isSaving}
                className="w-full border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 rounded-xl p-4 text-center cursor-pointer transition-all flex items-center justify-center gap-3 text-slate-600 disabled:opacity-50"
              >
                <i className="fa-solid fa-video text-indigo-500 text-lg"></i>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800">Browse Video (MP4 / WebM)</p>
                  <p className="text-[11px] text-slate-400">Maximum 10MB file size</p>
                </div>
              </button>
            ) : (
              <div className="flex items-center justify-between p-3 bg-indigo-50/60 border border-indigo-200 rounded-xl">
                <div className="flex items-center gap-3 truncate">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-film text-sm"></i>
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 truncate">{video.name || 'Video Walkthrough'}</p>
                    <p className="text-[11px] text-indigo-700 font-medium">
                      Size: {formatFileSize(video.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeVideo}
                  disabled={isUploading || isSaving}
                  className="px-2.5 py-1 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-50"
                >
                  <i className="fa-solid fa-trash-can mr-1"></i> Remove
                </button>
              </div>
            )}
          </div>

          {/* 3. PDF / Document Section */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">PDF Document / Brochure</span>
                <span className="text-xs text-slate-500">(1 Document · Max 2MB)</span>
              </div>
            </div>

            <input
              type="file"
              ref={pdfInputRef}
              accept="application/pdf"
              className="hidden"
              onChange={handlePdfSelect}
            />

            {!pdf ? (
              <button
                type="button"
                onClick={() => pdfInputRef.current?.click()}
                disabled={isUploading || isSaving}
                className="w-full border-2 border-dashed border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 rounded-xl p-4 text-center cursor-pointer transition-all flex items-center justify-center gap-3 text-slate-600 disabled:opacity-50"
              >
                <i className="fa-solid fa-file-pdf text-amber-500 text-lg"></i>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800">Browse PDF Document / Brochure</p>
                  <p className="text-[11px] text-slate-400">Maximum 2MB file size</p>
                </div>
              </button>
            ) : (
              <div className="flex items-center justify-between p-3 bg-amber-50/60 border border-amber-200 rounded-xl">
                <div className="flex items-center gap-3 truncate">
                  <div className="w-10 h-10 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-file-pdf text-sm"></i>
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 truncate">{pdf.name || 'Brochure.pdf'}</p>
                    <p className="text-[11px] text-amber-800 font-medium">
                      Size: {formatFileSize(pdf.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removePdf}
                  disabled={isUploading || isSaving}
                  className="px-2.5 py-1 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-50"
                >
                  <i className="fa-solid fa-trash-can mr-1"></i> Remove
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading || isSaving}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isUploading || isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            {isUploading || isSaving ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-check"></i>
                <span>{showProductFields ? (item ? 'Save Changes' : 'Add Item') : 'Save Media for Item'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
