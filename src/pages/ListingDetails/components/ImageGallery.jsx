import { SectionCard } from './UIComponents';

export function ImageGallery({ images, displayTitle, onImageClick }) {
  return (
    <SectionCard title="Images" icon="fa-images">
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((url, index) => (
            <div
              key={index}
              className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer group"
              onClick={() => onImageClick(index)}
            >
              <img
                src={url}
                alt={`${displayTitle} - Image ${index + 1}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <i className="fa-solid fa-expand text-white text-2xl" />
              </div>
              {images.length > 1 && (
                <div className="absolute top-2 right-2">
                  <span className="bg-slate-900/80 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {index + 1} / {images.length}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="aspect-[4/3] flex flex-col items-center justify-center text-slate-300 gap-3 bg-slate-50 rounded-xl border border-slate-100">
          <i className="fa-solid fa-image text-4xl" aria-hidden="true" />
          <span className="text-sm font-semibold">No images available</span>
        </div>
      )}
    </SectionCard>
  );
}