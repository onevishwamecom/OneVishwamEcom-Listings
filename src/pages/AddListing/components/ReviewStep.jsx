import Badge from "@/components/ui/Badge";
import { CATEGORIES, CITY_DATA } from "../constants";
import { FormSection } from "@/components/ui/PageContainer";

export function ReviewStep({
  form,
  category,
  subcategory,
  catFields,
  brochure,
  brochureUrl,
  imageUrls,
  videoUrl,
  docUrls,
  documents,
  isEditing,
  formatINR,
  adminFeedback,
}) {
  const categoryInfo = CATEGORIES.find((c) => c.id === category) || {};

  return (
    <FormSection title={isEditing ? "Review Changes" : "Review Listing"} description={isEditing ? "Verify your changes before resubmitting for approval" : "Verify all details before submitting for approval"}>
      {isEditing && (
        <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-brand-blue rounded-full text-xs font-bold uppercase mb-4">
          Edit Mode
        </span>
      )}

      {adminFeedback && isEditing && (
        <div className="mb-4 p-3 rounded-lg bg-brand-orange/10 border border-brand-orange/30">
          <div className="flex items-start gap-2.5">
            <i className="fa-solid fa-comment-dots text-brand-orange mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-brand-orange/90 mb-1.5 text-sm">Admin Feedback (Original Request)</p>
              <p className="text-sm text-brand-orange/80 italic">"{adminFeedback}"</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden relative">
          <div className="p-4">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoryInfo.gradient} flex items-center justify-center text-white text-xl shadow-sm shrink-0`}>
                <i className={`fa-solid ${categoryInfo.icon}`} />
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full inline-block mb-1.5">
                  {categoryInfo.label}
                </span>
                {subcategory && (
                  <span className="text-[9px] font-bold uppercase tracking-wider text-brand-gold bg-amber-50 px-1.5 py-0.5 rounded-full inline-block mb-1.5 mr-1.5">
                    {subcategory}
                  </span>
                )}
                <h3 className="text-xl font-extrabold text-slate-900 mb-0.5">{form.title || "Untitled Listing"}</h3>
                {form.subtitle && <p className="text-slate-500 font-medium text-sm">{form.subtitle}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Asking Price</p>
                <p className="font-extrabold text-brand-blue">
                  {form.price ? formatINR(form.price) : "Not set"}
                  {form.priceSuffix && <span className="text-sm font-medium text-slate-500 ml-1">{form.priceSuffix}</span>}
                  {form.priceType === "negotiable" && <Badge variant="warning" className="ml-1 text-[9px]">Negotiable</Badge>}
                  {form.priceType === "on-request" && <Badge variant="blue" className="ml-1 text-[9px]">On Request</Badge>}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Location</p>
                <p className="font-bold text-slate-700 flex items-center gap-1 truncate">
                  <i className="fa-solid fa-location-dot text-slate-300 text-xs" />
                  {form.area}, {CITY_DATA[form.city]?.label || form.city}
                  {form.pincode && ` - ${form.pincode}`}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Contact</p>
                <p className="font-bold text-slate-700 flex items-center gap-1 truncate">
                  <i className="fa-solid fa-phone text-slate-300 text-xs" />
                  {form.contact || "Not set"}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Price Type</p>
                <p className="font-bold text-slate-700 capitalize">{form.priceType.replace('-', ' ')}</p>
              </div>
            </div>

            {form.description && (
              <div className="mt-4">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</p>
                <p className="text-sm font-medium text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">{form.description}</p>
              </div>
            )}
          </div>
        </div>

        {catFields.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 relative">
            <h4 className="text-sm font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <i className="fa-solid fa-list-check text-slate-400 text-sm" /> Specifications
            </h4>
            <div className="grid grid-cols-2 gap-y-3 gap-x-1.5">
              {catFields.map((field) => (
                <div key={field.name}>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 truncate pr-1.5">{field.label}</p>
                  <p className="text-sm font-bold text-slate-700 truncate pr-1.5">{form[field.name] || "-"}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 relative">
            <h4 className="text-sm font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <i className="fa-solid fa-images text-slate-400 text-sm" /> Media Assets
          </h4>

          {imageUrls.length > 0 ? (
            <div className="flex gap-1.5 overflow-x-auto pb-1.5">
              {imageUrls.map((url, i) => (
                <img key={i} src={url} alt={`photo-${i}`} className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-200" />
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-100">
              <i className="fa-solid fa-image-slash text-xl mb-1.5" />
              <p className="text-[9px] font-bold uppercase tracking-wider">No photos added</p>
            </div>
          )}

          {docUrls.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {documents.map((d, i) => (
                d.url && (
                  <div key={i} className="flex items-center gap-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <i className="fa-solid fa-file-pdf text-red-500 text-base" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-700 truncate">{d.name}</p>
                      <p className="text-[9px] font-medium text-slate-500">{(d.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}

          {videoUrl && (
            <div className="mt-3">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                <i className="fa-solid fa-video text-brand-blue" /> Attached Video
              </p>
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-black aspect-video max-w-sm">
                <video src={videoUrl} controls className="w-full h-full object-contain" />
              </div>
            </div>
          )}

          {(brochure || brochureUrl) && (
            <div className="mt-3 flex items-center gap-2.5 bg-brand-gold/15 text-brand-gold p-2.5 rounded-lg border border-brand-gold/30">
              <i className="fa-solid fa-file-pdf text-base" />
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-wider">Brochure Attached</p>
                {brochure && <p className="text-[9px] font-medium truncate">{brochure.name}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </FormSection>
  );
}