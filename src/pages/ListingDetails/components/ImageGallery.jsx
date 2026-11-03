import { SectionCard } from './UIComponents';

export function ImageGallery({ images, video, displayTitle, onImageClick }) {
  const videoSrc = video || null;

  return (
    <SectionCard title="Media & Photos" icon="fa-photo-film">
      {videoSrc && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
            <i className="fa-solid fa-video text-brand-blue" />
            <span>Listing Video</span>
          </div>
          <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-200 max-h-[360px] flex items-center justify-center shadow-sm">
            <video
              src={videoSrc}
              controls
              playsInline
              className="w-full max-h-[360px] object-contain"
            />
          </div>
        </div>
      )}

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

              {/* Position Sequence Badge */}
              <div className="absolute top-2 left-2 z-10 pointer-events-none">
                {index === 0 ? (
                  <span className="bg-amber-400 text-slate-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <i className="fa-solid fa-star text-[8px]" />
                    <span>1st · Cover</span>
                  </span>
                ) : (
                  <span className="bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                    {index + 1}{index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'}
                  </span>
                )}
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
        !videoSrc && (
          <div className="aspect-[4/3] flex flex-col items-center justify-center text-slate-300 gap-3 bg-slate-50 rounded-xl border border-slate-100">
            <i className="fa-solid fa-image text-4xl" aria-hidden="true" />
            <span className="text-sm font-semibold">No images available</span>
          </div>
        )
      )}
    </SectionCard>
  );
}