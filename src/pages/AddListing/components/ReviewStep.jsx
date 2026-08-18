import Badge from "@/components/ui/Badge";
import { CATEGORIES, CITY_DATA } from "../constants";

export function ReviewStep({
  form,
  category,
  subcategory,
  catFields,
  brochure,
  brochureUrl,
  imageUrls,
  docUrls,
  documents,
  setStep,
  isEditing,
  formatINR,
  adminFeedback,
}) {
  const categoryInfo = CATEGORIES.find((c) => c.id === category) || {};

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{isEditing ? 'Review Changes' : 'Review Listing'}</h2>
          <p className="text-sm text-slate-500 mt-1">
            {isEditing
              ? 'Verify your changes before resubmitting for approval'
              : 'Verify all details before submitting for approval'}
          </p>
        </div>
        {isEditing && (
          <span className="px-3 py-1 bg-blue-100 text-brand-blue rounded-full text-xs font-bold uppercase">
            Edit Mode
          </span>
        )}
      </div>

      {adminFeedback && isEditing && (
        <div className="mb-6 p-4 rounded-xl bg-brand-orange/10 border border-brand-orange/30">
          <div className="flex items-start gap-3">
            <i className="fa-solid fa-comment-dots text-brand-orange mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-brand-orange/90 mb-2">Admin Feedback (Original Request)</p>
              <p className="text-sm text-brand-orange/80 italic">"{adminFeedback}"</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4">
            <button onClick={() => setStep(1)} className="text-sm font-bold text-brand-blue hover:text-blue-800 transition-colors">Edit</button>
          </div>

          <div className="p-6">
            <div className="flex items-start gap-5">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${categoryInfo.gradient} flex items-center justify-center text-white text-2xl shadow-sm shrink-0`}>
                <i className={`fa-solid ${categoryInfo.icon}`} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full inline-block mb-2">
                  {categoryInfo.label}
                </span>
                {subcategory && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold bg-amber-50 px-2 py-0.5 rounded-full inline-block mb-2 mr-2">
                    {subcategory}
                  </span>
                )}
                <h3 className="text-2xl font-extrabold text-slate-900 mb-1">{form.title || "Untitled Listing"}</h3>
                {form.subtitle && <p className="text-slate-500 font-medium text-sm">{form.subtitle}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 p-4 bg-slate-50 rounded-2xl">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Asking Price</p>
                <p className="font-extrabold text-brand-blue text-lg">
                  {form.price ? formatINR(form.price) : "Not set"}
                  {form.priceSuffix && <span className="text-sm font-medium text-slate-500 ml-1">{form.priceSuffix}</span>}
                  {form.priceType === "negotiable" && <Badge variant="warning" className="ml-1 text-[10px]">Negotiable</Badge>}
                  {form.priceType === "on-request" && <Badge variant="blue" className="ml-1 text-[10px]">On Request</Badge>}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Location</p>
                <p className="font-bold text-slate-700 flex items-center gap-1.5 truncate">
                  <i className="fa-solid fa-location-dot text-slate-300" />
                  {form.area}, {CITY_DATA[form.city]?.label || form.city}
                  {form.pincode && ` - ${form.pincode}`}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Contact</p>
                <p className="font-bold text-slate-700 flex items-center gap-1.5 truncate">
                  <i className="fa-solid fa-phone text-slate-300" />
                  {form.contact || "Not set"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Price Type</p>
                <p className="font-bold text-slate-700 capitalize">{form.priceType.replace('-', ' ')}</p>
              </div>
            </div>

            {form.description && (
              <div className="mt-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Description</p>
                <p className="text-sm font-medium text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">{form.description}</p>
              </div>
            )}
          </div>
        </div>

        {catFields.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 relative">
            <div className="absolute top-0 right-0 p-4">
              <button onClick={() => setStep(2)} className="text-sm font-bold text-brand-blue hover:text-blue-800 transition-colors">Edit</button>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <i className="fa-solid fa-list-check text-slate-400" /> Specifications
            </h4>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              {catFields.map((field) => (
                <div key={field.name}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 truncate pr-2">{field.label}</p>
                  <p className="text-sm font-bold text-slate-700 truncate pr-2">{form[field.name] || "-"}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 relative">
          <div className="absolute top-0 right-0 p-4">
            <button onClick={() => setStep(5)} className="text-sm font-bold text-brand-blue hover:text-blue-800 transition-colors">Edit</button>
          </div>
          <h4 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <i className="fa-solid fa-images text-slate-400" /> Media Assets
          </h4>

          {imageUrls.length > 0 ? (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {imageUrls.map((url, i) => (
                <img key={i} src={url} alt={`photo-${i}`} className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200" />
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
              <i className="fa-solid fa-image-slash text-2xl mb-2" />
              <p className="text-xs font-bold uppercase tracking-wider">No photos added</p>
            </div>
          )}

          {docUrls.length > 0 && (
            <div className="mt-4 space-y-2">
              {documents.map((d, i) => (
                d.url && (
                  <div key={i} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <i className="fa-solid fa-file-pdf text-red-500 text-lg" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-700 truncate">{d.name}</p>
                      <p className="text-xs font-medium text-slate-500">{(d.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}

          {(brochure || brochureUrl) && (
            <div className="mt-4 flex items-center gap-3 bg-brand-gold/15 text-brand-gold p-3 rounded-xl border border-brand-gold/30">
              <i className="fa-solid fa-file-pdf text-xl" />
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider">Brochure Attached</p>
                {brochure && <p className="text-[10px] font-medium truncate">{brochure.name}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}