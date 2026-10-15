import React, { useRef, useState } from 'react';

const POPULAR_BANKS = [
  'SBI',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Canara Bank',
  'Bank of Baroda',
  'PNB',
  'LIC HFL',
  'Union Bank',
  'Kotak Mahindra',
];

export default function Phase3FinalFields({
  form = {},
  bankLoanDetails = '',
  onChange,
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
  errors = {},
}) {
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const brochureInputRef = useRef(null);
  const [photoDragOver, setPhotoDragOver] = useState(false);

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => onAddPhoto(file));
    e.target.value = '';
  };

  const handlePhotoDrop = (e) => {
    e.preventDefault();
    setPhotoDragOver(false);
    const files = Array.from(e.dataTransfer.files || []).filter((f) =>
      f.type.startsWith('image/')
    );
    files.forEach((file) => onAddPhoto(file));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onVideoSelect(file);
    }
    e.target.value = '';
  };

  const handleBrochureChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onBrochureSelect(file);
    }
    e.target.value = '';
  };

  const handleAppendBank = (bank) => {
    const trimmed = bankLoanDetails.trim();
    if (!trimmed) {
      onChange('bankLoanDetails', `Approved by ${bank}`);
    } else if (trimmed.toLowerCase().includes(bank.toLowerCase())) {
      // already includes this bank
      return;
    } else {
      onChange('bankLoanDetails', `${trimmed}, ${bank}`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoChange}
        accept="image/*"
        multiple
        className="hidden"
      />
      <input
        type="file"
        ref={videoInputRef}
        onChange={handleVideoChange}
        accept="video/*"
        className="hidden"
      />
      <input
        type="file"
        ref={brochureInputRef}
        onChange={handleBrochureChange}
        accept=".pdf,application/pdf"
        className="hidden"
      />

      {/* Group 0A: Property Location & Address */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Property Location & Address <span className="text-red-500">*</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Full physical location, locality, door/plot number, and street details
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Area / Locality
            </label>
            <input
              type="text"
              value={form.area || ''}
              onChange={(e) => onChange('area', e.target.value)}
              placeholder="e.g. Whitefield, Electronic City"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs bg-white outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 hover:border-slate-300 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              PIN Code
            </label>
            <input
              type="text"
              value={form.pincode || ''}
              onChange={(e) => onChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="e.g. 560066"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs bg-white outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 hover:border-slate-300 transition-all font-mono"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Full Address <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              value={form.address || ''}
              onChange={(e) => onChange('address', e.target.value)}
              placeholder="e.g. Plot #42, 3rd Main Road, Near ITPL Main Entrance, Whitefield, Bengaluru"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-xs bg-white outline-none resize-none transition-all ${
                errors.address
                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 hover:border-slate-300'
              }`}
            />
            {errors.address && (
              <p className="text-[11px] font-medium text-red-500 mt-1">{errors.address}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Landmark / Nearby (Optional)
            </label>
            <input
              type="text"
              value={form.landmark || ''}
              onChange={(e) => onChange('landmark', e.target.value)}
              placeholder="e.g. Opp. City Mall, Next to Hope Farm Metro Station"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs bg-white outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 hover:border-slate-300 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Group 0B: Detailed Property Description */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Detailed Description <span className="text-xs font-normal text-slate-400">(Optional)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Comprehensive details highlighting key features, plot layout, accessibility, and highlights
          </p>
        </div>

        <div>
          <textarea
            rows={4}
            value={form.description || ''}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Describe the property in detail. Mention orientation, road width, surrounding developments, connectivity, security, and unique selling points..."
            className={`w-full px-3.5 py-2.5 rounded-lg border text-xs bg-white outline-none resize-none transition-all ${
              errors.description
                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 hover:border-slate-300'
            }`}
          />
          {errors.description && (
            <p className="text-[11px] font-medium text-red-500 mt-1">{errors.description}</p>
          )}
        </div>
      </div>

      {/* Group 1: Property Photos */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Property Photos</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload up to 5 photos (max 1MB each). The first photo will be used as the cover.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
            {photos.length} / 5
          </span>
        </div>

        {/* Photos Grid & Dropzone */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-1">
          {photos.map((photo, idx) => (
            <div
              key={photo.id || idx}
              className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-50 group shadow-xs"
            >
              <img
                src={photo.url}
                alt={`Photo ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              />

              {/* Cover badge on first photo */}
              {idx === 0 && (
                <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-brand-blue text-white text-[9px] font-bold uppercase tracking-wider shadow-xs">
                  Cover
                </span>
              )}

              {/* Delete overlay */}
              <button
                type="button"
                onClick={() => onRemovePhoto(idx)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-slate-900/80 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all shadow-xs cursor-pointer"
                title="Remove photo"
              >
                <i className="fa-solid fa-trash-can text-[10px]" />
              </button>
            </div>
          ))}

          {/* Add Photo Button Slot */}
          {photos.length < 5 && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setPhotoDragOver(true);
              }}
              onDragLeave={() => setPhotoDragOver(false)}
              onDrop={handlePhotoDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all ${
                photoDragOver
                  ? 'border-brand-blue bg-blue-50/60'
                  : 'border-slate-200 hover:border-brand-blue hover:bg-blue-50/30'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center text-xs mb-1.5">
                <i className="fa-solid fa-cloud-arrow-up" />
              </div>
              <span className="text-xs font-semibold text-slate-700">Add Photo</span>
              <span className="text-[10px] text-slate-400 mt-0.5">JPG / PNG &lt;1MB</span>
            </div>
          )}
        </div>
      </div>

      {/* Group 2: Walkthrough Video & PDF Brochure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Short Video Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Walkthrough Video</h3>
              <p className="text-xs text-slate-400 mt-0.5">Optional • MP4/MOV under 10MB</p>
            </div>
            {video || videoPreview ? (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                Attached
              </span>
            ) : null}
          </div>

          {video || videoPreview ? (
            <div className="space-y-2">
              {videoPreview ? (
                <div className="relative rounded-lg overflow-hidden bg-black aspect-video max-h-40 flex items-center justify-center border border-slate-200">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : null}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-center gap-2 truncate mr-2">
                  <i className="fa-solid fa-file-video text-brand-blue" />
                  <span className="font-medium text-slate-700 truncate">
                    {video?.name || 'Property Walkthrough Video'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onRemoveVideo}
                  className="text-xs font-semibold text-red-500 hover:text-red-700 shrink-0 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => videoInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-lg p-5 text-center cursor-pointer hover:border-brand-blue hover:bg-blue-50/30 transition-all flex flex-col items-center justify-center"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs mb-1.5">
                <i className="fa-solid fa-film" />
              </div>
              <span className="text-xs font-semibold text-slate-700">Upload Walkthrough Video</span>
              <span className="text-[10px] text-slate-400 mt-0.5">MP4 / MOV under 10MB</span>
            </div>
          )}
        </div>

        {/* PDF Brochure Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Project Brochure (PDF)</h3>
              <p className="text-xs text-slate-400 mt-0.5">Optional • PDF format up to 25MB</p>
            </div>
            {brochure || brochureUrl ? (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                Attached
              </span>
            ) : null}
          </div>

          {brochure || brochureUrl ? (
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-2.5 truncate mr-2">
                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-file-pdf text-sm" />
                </div>
                <div className="truncate">
                  <p className="font-semibold text-slate-800 truncate">
                    {brochure?.name || 'Project Brochure.pdf'}
                  </p>
                  <p className="text-[10px] text-slate-400">PDF document ready</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onRemoveBrochure}
                className="text-xs font-semibold text-red-500 hover:text-red-700 shrink-0 cursor-pointer"
              >
                Remove
              </button>
            </div>
          ) : (
            <div
              onClick={() => brochureInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-lg p-5 text-center cursor-pointer hover:border-red-400 hover:bg-red-50/20 transition-all flex flex-col items-center justify-center"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs mb-1.5">
                <i className="fa-solid fa-file-arrow-up" />
              </div>
              <span className="text-xs font-semibold text-slate-700">Upload Project Brochure</span>
              <span className="text-[10px] text-slate-400 mt-0.5">PDF format up to 25MB</span>
            </div>
          )}
        </div>
      </div>

      {/* Group 3: Bank Loan Approval Details */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Bank Loan Approval Details <span className="text-red-500">*</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Specify approved financial institutions, APF project numbers, or home loan approvals
          </p>
        </div>

        <div className="space-y-3">
          {/* Quick-select Bank Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-500 block">
              Quick Add Approved Banks:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_BANKS.map((bank) => (
                <button
                  key={bank}
                  type="button"
                  onClick={() => handleAppendBank(bank)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-brand-blue border border-slate-200 hover:border-brand-blue/30 transition-all cursor-pointer active:scale-95"
                >
                  <i className="fa-solid fa-plus text-[9px]" />
                  <span>{bank}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <div>
            <textarea
              rows={3}
              value={bankLoanDetails}
              onChange={(e) => onChange('bankLoanDetails', e.target.value)}
              placeholder="e.g. Approved by SBI, HDFC Bank, ICICI Bank, and Canara Bank with APF project approval number #BLR-2026-99..."
              className={`w-full px-3.5 py-2.5 rounded-lg border text-xs bg-white outline-none resize-none transition-all ${
                errors.bankLoanDetails
                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 hover:border-slate-300'
              }`}
            />
            {errors.bankLoanDetails && (
              <p className="text-[11px] font-medium text-red-500 mt-1">{errors.bankLoanDetails}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
