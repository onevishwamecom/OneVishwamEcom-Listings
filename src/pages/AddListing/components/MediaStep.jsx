import Swal from "sweetalert2";
import { FormSection, FormFieldGroup } from "@/components/ui/PageContainer";

const REMOVE_CONFIRM_STYLE = {
  confirmButton: "rounded-xl px-4 py-2 font-bold",
  cancelButton: "rounded-xl px-4 py-2 font-bold",
};

export function MediaStep({
  photos,
  video,
  videoUrl,
  videoRef,
  handleAddVideo,
  removeVideo,
  documents,
  brochure,
  setBrochure,
  brochureUrl,
  setBrochureUrl,
  fileRef,
  brochureRef,
  documentRef,
  dragOver,
  setDragOver,
  docDragOver,
  setDocDragOver,
  handleAddPhoto,
  handleAddDocument,
  removePhoto,
  removeDocument,
  validationErrors,
}) {
  const confirmRemovePhoto = (index) => {
    Swal.fire({
      title: "Remove this image?",
      text: "This photo will be removed from your listing.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Remove",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      customClass: REMOVE_CONFIRM_STYLE,
    }).then((result) => {
      if (result.isConfirmed) removePhoto(index);
    });
  };

  const confirmRemoveDocument = (index) => {
    Swal.fire({
      title: "Remove this document?",
      text: "This document will be removed from your listing.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Remove",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      customClass: REMOVE_CONFIRM_STYLE,
    }).then((result) => {
      if (result.isConfirmed) removeDocument(index);
    });
  };
  return (
    <FormSection title="Images & Documents" description="Add photos and supporting documents for your listing">
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-semibold text-slate-700">
              Photos <span className="text-red-500">*</span>
            </label>
            <span className="text-xs font-bold text-brand-blue bg-blue-50 px-2 py-0.5 rounded">
              {photos.length}/5 uploaded
            </span>
          </div>

          {photos.length === 0 ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files[0]) handleAddPhoto(e.dataTransfer.files[0]);
              }}
              onClick={() => fileRef.current?.click()}
              role="button"
              tabIndex={0}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                dragOver
                  ? "border-brand-blue bg-blue-50 scale-[1.01]"
                  : "border-slate-200 hover:border-blue-300 bg-slate-50 hover:bg-slate-100/50"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-3 text-brand-blue">
                <i className="fa-solid fa-cloud-arrow-up text-xl" />
              </div>
              <h4 className="text-sm font-bold text-slate-700 mb-0.5">Drag & Drop photos here</h4>
              <p className="text-xs text-slate-500 font-medium mb-3">or click to browse from your device</p>
              <p className="text-[10px] font-semibold text-slate-400 bg-white inline-block px-2.5 py-0.5 rounded-full border border-slate-100">
                JPG, PNG, WEBP (Max 1MB each, up to 5 photos)
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              {photos.map((p, i) => (
                <div key={p.id} className="relative group w-24 h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm shrink-0">
                  {p.url ? (
                    <img src={p.url} alt={`upload-${i}`} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <i className="fa-solid fa-image text-xl mb-0.5" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={(e) => { e.stopPropagation(); confirmRemovePhoto(i); }}
                      className="w-7 h-7 rounded-full bg-brand-orange text-white flex items-center justify-center hover:bg-brand-orange/90 hover:scale-110 transition-all shadow-lg"
                    >
                      <i className="fa-solid fa-trash text-[9px]" />
                    </button>
                  </div>

                  {p.uploading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                      <i className="fa-solid fa-circle-notch fa-spin text-brand-blue text-lg mb-1" />
                      <span className="text-[9px] font-bold text-slate-600">UPLOADING</span>
                    </div>
                  )}
                </div>
              ))}

              {photos.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    if (e.dataTransfer.files[0]) handleAddPhoto(e.dataTransfer.files[0]);
                  }}
                  aria-label="Add more photos"
                  className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 hover:border-brand-blue bg-slate-50 hover:bg-blue-50 flex flex-col items-center justify-center text-brand-blue transition-all duration-200 cursor-pointer shrink-0"
                >
                  <i className="fa-solid fa-plus text-xl mb-0.5" aria-hidden="true" />
                  <span className="text-[9px] font-bold text-slate-500 hover:text-brand-blue transition-colors">Add More</span>
                </button>
              )}
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files[0]) handleAddPhoto(e.target.files[0]);
              e.target.value = "";
            }}
          />

          {validationErrors.photos && (
            <p className="mt-1.5 text-xs font-semibold text-red-500 animate-fade-in">{validationErrors.photos}</p>
          )}
        </div>

        {/* Video Section */}
        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-semibold text-slate-700">
              Short Video (Optional)
            </label>
            <span className="text-xs font-bold text-brand-blue bg-blue-50 px-2 py-0.5 rounded">
              {video || videoUrl ? "1/1 uploaded" : "0/1 uploaded"}
            </span>
          </div>

          {video || videoUrl ? (
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 p-2.5 max-w-md shadow-sm">
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black flex items-center justify-center relative">
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex items-center justify-between px-2 pt-2.5 text-white">
                <div className="min-w-0 flex items-center gap-2">
                  <i className="fa-solid fa-file-video text-brand-gold text-sm" />
                  <span className="text-xs font-semibold truncate max-w-[220px]">
                    {video?.name || "Uploaded Video"}
                  </span>
                  {video?.size && (
                    <span className="text-[10px] text-slate-400">
                      ({(video.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={removeVideo}
                  className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-bold px-2.5 py-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <i className="fa-solid fa-trash text-[10px]" /> Remove
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => videoRef.current?.click()}
              role="button"
              tabIndex={0}
              className="border-2 border-dashed border-slate-200 hover:border-brand-blue rounded-xl p-5 cursor-pointer transition-all bg-slate-50 hover:bg-blue-50/50 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-2 text-brand-blue">
                <i className="fa-solid fa-video text-lg" />
              </div>
              <h4 className="text-sm font-bold text-slate-700">Add Short Video</h4>
              <p className="text-xs text-slate-500 mb-1.5">Upload a video tour or walkthrough</p>
              <p className="text-[10px] font-semibold text-slate-400 bg-white inline-block px-2.5 py-0.5 rounded-full border border-slate-100">
                MP4, WebM, MOV (Max 10MB, 1 video only)
              </p>
              <input
                ref={videoRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files[0]) handleAddVideo(e.target.files[0]);
                  e.target.value = "";
                }}
              />
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-semibold text-slate-700">
              Documents (Optional)
            </label>
            <span className="text-xs font-bold text-brand-gold bg-amber-50 px-2 py-0.5 rounded">
              {documents.length}/4 uploaded
            </span>
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setDocDragOver(true); }}
            onDragLeave={() => setDocDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDocDragOver(false);
              if (e.dataTransfer.files[0]) handleAddDocument(e.dataTransfer.files[0]);
            }}
            onClick={() => documentRef.current?.click()}
            role="button"
            tabIndex={0}
            className={`border-2 border-dashed rounded-xl p-4 cursor-pointer transition-all ${
              docDragOver
                ? "border-brand-gold bg-amber-50"
                : "border-slate-200 hover:border-slate-300 bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3 justify-center">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-base shrink-0 ${
                docDragOver ? "bg-brand-gold/15 text-brand-gold" : "bg-brand-orange/10 text-brand-orange"
              }`}>
                <i className="fa-solid fa-file-arrow-up" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-700">Add Documents</h4>
                <p className="text-xs text-slate-500">PDF, DOC, DOCX (Max 10MB each)</p>
              </div>
            </div>
            <input
              ref={documentRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => {
                if (e.target.files[0]) handleAddDocument(e.target.files[0]);
                e.target.value = "";
              }}
            />
          </div>

          {documents.length > 0 && (
            <div className="mt-3 space-y-2">
              {documents.map((d, i) => (
                <div key={d.id} className="flex items-center gap-2.5 p-2.5 bg-white border border-slate-200 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                    <i className="fa-solid fa-file-pdf text-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-700 truncate">{d.name}</p>
                    <p className="text-[10px] font-medium text-slate-500">
                      {d.uploading ? "Uploading..." : `${(d.size / 1024).toFixed(1)} KB`}
                    </p>
                  </div>
                  {!d.uploading && (
                    <button
                      onClick={(e) => { e.stopPropagation(); confirmRemoveDocument(i); }}
                      className="w-7 h-7 rounded-full bg-white text-red-500 border border-slate-200 hover:bg-red-50 flex items-center justify-center shrink-0 shadow-sm"
                    >
                      <i className="fa-solid fa-xmark text-[9px]" />
                    </button>
                  )}
                  {d.uploading && (
                    <div className="w-7 h-7 rounded-full border-2 border-brand-blue border-t-transparent animate-spin shrink-0" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-slate-100">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Brochure PDF (Optional)
          </label>
          <div
            onClick={() => brochureRef.current?.click()}
            role="button"
            tabIndex={0}
            className={`flex items-center gap-3 border-2 border-dashed rounded-xl p-3 cursor-pointer transition-all ${
              brochure || brochureUrl
                ? "border-brand-gold/30 bg-brand-gold/10"
                : "border-slate-200 hover:border-slate-300 bg-slate-50"
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-base shrink-0 ${
              brochure || brochureUrl
                ? "bg-brand-gold/15 text-brand-gold"
                : "bg-brand-orange/10 text-brand-orange shadow-sm"
            }`}>
              <i className={`fa-solid ${brochure || brochureUrl ? "fa-file-circle-check" : "fa-file-pdf"}`} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-700">
                {brochure ? brochure.name : brochureUrl ? "Brochure uploaded" : "Upload PDF Brochure"}
              </p>
              <p className="text-[10px] font-medium text-slate-500">
                {brochure ? `${(brochure.size / 1024 / 1024).toFixed(2)} MB` : "PDF format only (Max 10MB)"}
              </p>
            </div>
            {(brochure || brochureUrl) && (
              <button
                onClick={(e) => { e.stopPropagation(); setBrochure(null); setBrochureUrl(null); }}
                className="w-7 h-7 rounded-full bg-white text-red-500 border border-slate-200 hover:bg-red-50 flex items-center justify-center shrink-0 shadow-sm"
              >
                <i className="fa-solid fa-xmark text-xs" />
              </button>
            )}
            <input
              ref={brochureRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files[0]) setBrochure(e.target.files[0]);
                e.target.value = "";
              }}
            />
          </div>
        </div>
      </div>
    </FormSection>
  );
}